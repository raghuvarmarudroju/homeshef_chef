import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicSlides } from '@ionic/angular';
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

  swiperModules = [IonicSlides];
  banners: Banner[] = [];
  chefs: Chef[] = [];
  isLoading: boolean = false;
  location = {} as Address;
  addressSub: Subscription;
  profile : any;
  profileSub: Subscription;
  communityData: any;
  categories: any;
  orders: any;
  public selectedCategoryId: number = 1;
  filteredOrders: any;
  emptyScreenModel = {
    icon: 'fast-food',
    title: 'No Orders Placed Yet',
    noSpace: true,
  };
  constructor(
    private addressService: AddressService,
    private cartService: CartService,
    public global: GlobalService,
    private profileService: ProfileService,
    private orderService: OrderService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.getData();
    this.global.customStatusbar();
    this.profileSub = this.profileService.profile.subscribe({
      next: profile => {
        console.log(profile);
        this.profile = profile;
        this.communityData = profile.community;
        this.orders = profile.orders;
        
        this.isLoading = false;
        console.log(this.orders);
      }
    });
   
    if(this.profile?.id){
      
    }
    
  }

  async getData() {
    try {
      this.chefs = [];
      await this.addressService.checkExistAddress(this.location);
      await this.profileService.getProfile();
      this.categories = await this.categoryService.getOrderCategories();
      this.selectCategory(this.categories[0].id);
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
  public selectCategory(id:any){
    this.selectedCategoryId = id;
    if(id == 1){
      this.filteredOrders =  this.orders.filter((item: any) =>new Date(item.delivery_date) == new Date());
    }else if(id == 2){
      this.filteredOrders =  this.orders.filter((item: any) =>new Date(item.delivery_date) > new Date());
    }else{
      this.filteredOrders =  this.orders.filter((item: any) =>new Date(item.delivery_date) < new Date());
    }
    //this.getMenuItems();
    //this.sidenav.close();
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
  }

}