import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonicModule, IonicSlides } from '@ionic/angular';
import { NavigationExtras, Router, RouterModule } from '@angular/router';
import { Address } from 'src/app/models/address.model';
import { Subscription } from 'rxjs';
import { AddressService } from 'src/app/services/address/address.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LocationService } from 'src/app/services/location/location.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { ChefService } from 'src/app/services/chef/chef.service';
import { BannerService } from 'src/app/services/banner/banner.service';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { ChefComponent } from 'src/app/components/chef/chef.component';
import { LoadingChefComponent } from 'src/app/components/loading-chef/loading-chef.component';
import { BannerComponent } from 'src/app/components/banner/banner.component';
import { Banner } from 'src/app/interfaces/banner.interface';
import { Chef } from 'src/app/interfaces/chef.interface';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { OrderService } from 'src/app/services/order/order.service';
import { OrderComponent } from 'src/app/components/order/order.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    RouterModule, 
    ChefComponent, 
    LoadingChefComponent, 
    OrderComponent, 
    BannerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild(IonContent, {static: false}) content: IonContent;
  swiperModules = [IonicSlides];
  banners: Banner[] = [];
  chefs: Chef[] = [];
  isLoading: boolean = false;
  location = {} as Address;
  addressSub: Subscription;
  profile : any;
  profileSub: Subscription;
  orderSub: Subscription;
  communityData: any;
  categories: any;
  orders: any;
  public selectedCategoryId: number = 1;
  filteredOrders: any;
  emptyScreenModel ={
    icon: 'fast-food-outline',
    title: 'Sorry! No orders available',
    noSpace: true,
  };
  selectedTabId: any=1;
  isVerified: boolean = false;
  constructor(
    private addressService: AddressService,
    private cartService: CartService,
    public global: GlobalService,
    private profileService: ProfileService,
    private orderService: OrderService,
    private categoryService: CategoryService
  ) { 
    var selectedTab = localStorage.getItem('selectedTabId');
    if (selectedTab && selectedTab != null && selectedTab !== 'null') {
      console.log(selectedTab);
      this.selectedTabId = parseInt(selectedTab);
    }else{
      this.selectedTabId = 1;
    }
    
  }

  ngOnInit() {
    this.isLoading = true;
    var selectedTab = localStorage.getItem('selectedTabId');
    if (selectedTab && selectedTab != null && selectedTab !== 'null') {
      console.log(selectedTab);
      this.selectedTabId = parseInt(selectedTab);
    }else{
      this.selectedTabId = 1;
    }
    this.global.customStatusbar();
    this.profileSub = this.profileService.profile.subscribe({
      next: profile => {
        console.log(profile);
        if(profile){
          this.profile = profile;
          if(profile?.is_verified == 1){
            this.isVerified = true;
          }
          this.communityData = profile?.community;
          this.selectTab(this.selectedTabId);
          this.isLoading = false;
        }
        
      }
    });
    this.orderSub = this.orderService.orders.subscribe({
      next: orders => {
        console.log(orders);
        if(orders){
          this.orders = orders;
          this.selectTab(this.selectedTabId);
        }
      }
    });
    this.getData();
    if(this.profile?.id){
      
    }
    
  }
  refresh(event){
    setTimeout(() => {
      this.getData();
      event.target.complete();
    }, 2000);
  }
  async getData() {
    try {
      this.chefs = [];
      await this.addressService.checkExistAddress(this.location);
      await this.orderService.getOrders();
      await this.profileService.getProfile();
      this.categories = await this.categoryService.getOrderCategories();
      
    } catch(e) {
      console.log(e);
      this.global.errorToast();
    }
  }

  async reorder(order: any) {
    console.log(order);
    let data = await this.cartService.getCart();
    console.log('data: ', data);
    if(data?.value) {
      this.cartService.alertClearCart(null, null, null, order);
    } else {
      this.cartService.orderToCart(order);
    }
  }
  call(number) {
    this.global.call(number)
    .then(() => {})
    .catch((e) => console.log(e));
  }
  public selectTab(id:any){
    this.selectedTabId = id;
    localStorage.setItem('selectedTabId',id);
    this.filteredOrders=[];
    if(id == 1){
      this.filteredOrders =  this.orders.filter((item: any) => new Date(item.delivery_date).toLocaleDateString() == new Date().toLocaleDateString());
    }else if(id == 2){
      this.filteredOrders =  this.orders.filter((item: any) => new Date(item.delivery_date).toLocaleDateString() > new Date().toLocaleDateString());
    }else{
      this.filteredOrders =  this.orders.filter((item: any) => new Date(item.delivery_date).toLocaleDateString() < new Date().toLocaleDateString());
    }
    //this.getMenuItems();
    //this.sidenav.close();
    console.log(this.filteredOrders);
  }
  async cancel(order) {
    try {
      this.global.showLoader();
      console.log(order);
      const params= {
        id : order.id,
        status : 6
      } 
      this.orderService.updateStatus(params).subscribe((data:any) => { 
        if(data.status == 200){
          this.getData();
        }
        
      });
      this.global.hideLoader();
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      this.global.errorToast();
    }
  }
  async accept(order) {
    
    try {
      this.global.showLoader();
      console.log(order);
      const params= {
        id : order.id,
        status : 1
      } 
      this.orderService.updateStatus(params).subscribe((data:any) => { 
        if(data.status == 200){
          this.getData();
        }
      });
      this.global.hideLoader();
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      this.global.errorToast();
    }
  }

  ngOnDestroy() {
    console.log('ngondestroy homepage');
    if(this.addressSub) this.addressSub.unsubscribe();
    this.addressService.reset();
    if(this.orderSub) this.orderSub.unsubscribe();
    this.orderService.reset();
  }

}