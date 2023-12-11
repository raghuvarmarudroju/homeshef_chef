import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  page: number = 0;
  recordsLimit = 2;
  uid: string;
  order_fetched = false; // remove - when using real apis
  new_order = null; // remove - when using real apis

  private _orders = new BehaviorSubject<Order[]>([]);

  get orders() {
    return this._orders.asObservable();
  }

  constructor(
    private auth: AuthService, 
    private api: ApiService,
    public http:HttpClient,
  ) {}

  async getUid() {
    if(!this.uid) {
      this.uid = await this.auth.getId();
    }
    return this.uid;
  }

  async getCoupons(chef_id?) {
    try {
      await this.api.delayedResponse(1000); //remove when working with real apis
      const currentDateTime = new Date();
      const coupons = this.api.allCoupons.filter(
        (coupon) => (!coupon?.chef_id || coupon?.chef_id == chef_id) && new Date(coupon?.expiryDate) >= currentDateTime
      );
      return coupons;
    } catch(e) {
      throw(e);
    }
  }

  async getPastOrders() {
    try {
      await this.api.delayedResponse(1000); //remove when working with real apis
      await this.getUid();
      if(this.uid) {
        this.page++;
        console.log('page: ', this.page);
        // const orders: Order[] = (this.api.allOrders.filter((order) => order.user_id == this.uid)).slice(0, 3);
        let orders: Order[] = this.api.allOrders.filter((order) => order.user_id == this.uid);
        const startIndex = (this.page - 1) * this.recordsLimit;
        const endIndex = ((this.page - 1) * this.recordsLimit) + this.recordsLimit;
        orders = orders.slice(startIndex, endIndex);
        console.log('orders', orders);

        let currentOrders: Order[] = this._orders.value;
        console.log('currentOrders: ', currentOrders);
        if(!this.order_fetched && this.new_order) { // remove this condition when using real apis
          currentOrders = [this.new_order];
          this.new_order = null;
        }
        currentOrders.push(...orders);
        this.order_fetched = true; //remove when working with real apis
        this._orders.next(currentOrders);
        const loadMore = orders?.length < this.recordsLimit ? false : true;
        console.log('loadMore: ', loadMore);
        return {orders: currentOrders, loadMore};
      }
      return [];
    } catch(e) {
      throw(e);
    }
  }

  async placeOrder(param) {
    try {      
      // const order = JSON.stringify(param.order);
      await this.getUid();
      if(this.uid) {
        const user = this.api.users.find((user) => user.id == this.uid);
        
        const order_id = (this.api.allOrders.length + 1).toString();

        const currentDate = new Date();
        
        let currentOrders: Order[] = [];
        const order = new Order(
          param.address,
          param.chef_id,
          user,
          param.order,
          param.total,
          param.grandTotal,
          param.deliveryCharge,
          param.status,
          param.payment_status,
          param.payment_mode,
          param?.coupon ? param.coupon.saved : 0,
          order_id,    
          this.uid,
          param.instruction,
          currentDate,
          currentDate,
          param.chef,
          param?.coupon,
          param?.payment_id ? param.payment_id : '',
        );

        if(!this.order_fetched) this.new_order = order; // remove - when using real apis

        currentOrders.push(order);
        console.log('latest order: ', currentOrders);
        currentOrders = currentOrders.concat(this._orders.value);
        this._orders.next(currentOrders);
        return currentOrders;
      }
      return null;
    } catch(e) {
      throw(e);
    }
  }
  public updateStatus(input: any){
    const httpOptions = {
      headers: new HttpHeaders({
        "basic": environment.authToken
      })
    };
    
    return this.http.post(environment.adminURL + 'orderStatus', input,httpOptions)
      .pipe(
        map(
          (response:any) => {
            if (response) {
              return response;
            }
          },
          (error: any) => {
            return error;
          }
        )
      )
    //return this.http.get<any[]>(this.url + 'orders.json');
  }
  async updateOrder(order, data) {
    try {
      await this.getUid();
      if(this.uid) {
        const newOrder = {...order, ...data};
  
        // for recent orders
        let currentOrders: Order[] = [...this._orders.value];
        const index = currentOrders.findIndex(x => x.id == order.id);
        currentOrders[index] = newOrder;
  
        console.log('orders: ', currentOrders);
        this._orders.next(currentOrders);
        return newOrder;
      }
      return null;
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async getOrder(id) {
    await this.getUid();
    const input = {
      id: id
    };
    return this.http.post(environment.serverBaseUrl + 'orders/mealById', input)
      .pipe(
        map(
          (response:any) => {
            if (response) {
              return response;
            }
          },
          (error: any) => {
            return error;
          }
        )
      )
  }

  reset() {
    this.uid = null;
    this.page = 0;
    this._orders.next([]);
  }

  // async liveTrackRider(rider_id) {
  //   try {
  //     // get live location of rider
  //   } catch(e) {
  //     throw(e);
  //   }
  // }

}
