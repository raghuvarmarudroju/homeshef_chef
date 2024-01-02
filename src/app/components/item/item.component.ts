import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/interfaces/item.interface';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { HttpService } from 'src/app/services/http/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  providers: [
    DatePipe,
  ]
})
export class ItemComponent implements OnInit {

  @Input() item: any;
  @Input() chef: any;
  @Input() index;
  cartSub: Subscription;
  @Output() add: EventEmitter<Item> = new EventEmitter();
  @Output() minus: EventEmitter<Item> = new EventEmitter();
  @Output() plus: EventEmitter<Item> = new EventEmitter();
  serverImageUrl: string;
  selectedCard: string;
  selectedDate: Date;
  cartItems: any;
  days = ['sun','mon','tue','wed','thu','fri','sat'];
  constructor(private cartService: CartService,public datepipe: DatePipe,private httpService: HttpService,private global: GlobalService) {
    this.serverImageUrl = environment.serverImageUrl;
    var selectedDate = localStorage.getItem('selectedDate');
    if (selectedDate && selectedDate != null && selectedDate !== 'null') {
      this.selectedDate = new Date(selectedDate);
    }
    this.cartSub = this.cartService.cart.subscribe({
      next: cart => {
        console.log('cart page: ', cart);
        if(cart?.items){
          this.cartItems = cart.items;
        }
      }
    });
  }

  async ngOnInit() {
    await this.cartService.getCartData();
  }
  addItem() {
    this.item.delivery_date = this.selectedDate;
    this.add.emit(this.item);
    
  }
  editItem() {
    this.global.navigate(['/', 'tabs', 'menu','edit', this.item.id]);
  }
  quantityPlus() {
    this.item.delivery_date = this.selectedDate;
    this.plus.emit(this.item);
    this.onCart();
  }
  public onCart(){
     console.log(this.cartItems);
    if(this.cartItems){
      if(this.cartItems.find(item=>(item.id == this.item.id && moment(item.delivery_date).format('MM/DD/YYYY') === moment(this.selectedDate).format('MM/DD/YYYY')))){
        //alert('sdfsdf');
        return false;
      }else{
        return true;
      }
    }
    return true;
  }
  public categoryTimeCheck(chef_id : any,category_id : any,date : any){
    
    var chef = this.chef;
    var selectedCategory = chef.timings.find((item : any) => item.category_id == category_id);
    var selectedDate = this.datepipe.transform(new Date(date), 'yyyy-MM-dd');
    var todayDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    if(selectedCategory){
      if(selectedDate == todayDate){

        var start_time = selectedCategory.start_time.split(":");
        let start = new Date();
        start.setHours(start_time[0]);
        start.setMinutes(start_time[1]);
        start.setSeconds(start_time[2]);
  
        var end_time = selectedCategory.end_time.split(":");
        let end = new Date();
        end.setHours(end_time[0]);
        end.setMinutes(end_time[1]);
        end.setSeconds(end_time[2]);
        console.log(category_id);
        if ((new Date(date).getTime() >= new Date(start).getTime()) && (new Date(date).getTime() <= new Date(end).getTime())) {
          console.log('false');
          return false;
        } else {
          console.log('true');
          return true;
        }    
      }else{
        console.log('false');
        return false;
      }
    }else{
      return true;
    }
  }
  quantityMinus() {
    this.minus.emit(this.item);
  }

}
