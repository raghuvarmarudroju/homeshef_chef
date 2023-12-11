import { GlobalService } from 'src/app/services/global/global.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonModal, IonicModule, NavController } from '@ionic/angular';
import { Address } from 'src/app/models/address.model';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/interfaces/cart.interface';
import { NavigationExtras, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart/cart.service';
import { AddressService } from 'src/app/services/address/address.service';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { CartItemComponent } from 'src/app/components/cart-item/cart-item.component';
import { EmptyScreenComponent } from 'src/app/components/empty-screen/empty-screen.component';
import { CouponsComponent } from 'src/app/components/coupons/coupons.component';
import { Coupon } from 'src/app/interfaces/coupon.interface';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule, 
    CartItemComponent, 
    EmptyScreenComponent,
    CouponsComponent
  ]
})
export class CartPage implements OnInit, OnDestroy {

  @ViewChild(IonContent, {static: false}) content: IonContent;
  @ViewChild('coupon_modal') modal: IonModal;
  urlCheck: any;
  url: any;
  model = {} as Cart;
  // deliveryCharge = 20;
  instruction: any;
  location = {} as Address;
  cartSub: Subscription;
  addressSub: Subscription;
  applyCoupon: boolean = false;
  selectedCoupon: Coupon;

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private global: GlobalService,
    private cartService: CartService,
    private addressService: AddressService,
  ) { }

  async ngOnInit() {
    await this.getData();
    this.addressSub = this.addressService.addressChange.subscribe({
      next: async (address) => {
        console.log('location cart: ', address);
        this.location = address;
        if(this.location?.id && this.location?.id != '') {
          const result = await this.cartService.checkCart(this.location.lat, this.location.lng);
          console.log(result);
          if(result) {
            this.clearCartAlert();
          }
        }
      }
    });
    this.cartSub = this.cartService.cart.subscribe({
      next: cart => {
        console.log('cart page: ', cart);
        this.model = cart;
        // if(!this.model) this.location = {} as Address;
        console.log('cart page model: ', this.model);
        if(this.model && this.selectedCoupon) this.model.grandTotal -= this.selectedCoupon?.saved;
      }
    });
  }

  async getData() {
    await this.checkUrl();
    await this.cartService.getCartData();
  }

  checkUrl() {
    let url: any = (this.router.url).split('/');
    console.log('url: ', url);
    const spliced = url.splice(url.length - 2, 2); // /tabs/cart url.length - 1 - 1
    this.urlCheck = spliced[0];
    console.log('urlcheck: ', this.urlCheck);
    url.push(this.urlCheck);
    this.url = url;
    console.log(this.url);
  }

  clearCartAlert() {
    // // for using toast instead of alert
    // this.global.errorToast(
    //   'Your location is too far from the chef in the cart, kindly search from some other chef nearby.',
    //   5000);
    // 
    this.cartService.clearCart();
    this.global.showAlert(
      'Your location is too far from the chef in the cart, your cart is emptied and kindly search from some other chef nearby.',
      'Location too far',
      [{
        text: 'OK',
        role: 'cancel'
      }]
    );
  }

  getPreviousUrl() {
    return this.url.join('/');
  }

  quantityPlus(index) {
    this.cartService.quantityPlus(index);
  }

  quantityMinus(index) {
    this.cartService.quantityMinus(index);
  }

  addAddress(location?) {
    let url: any;
    let navData: NavigationExtras;
    if(location) {
      location.from = 'cart';
      navData = {
        queryParams: {
          data: JSON.stringify(location)
        }
      }
    }
    if(this.urlCheck == 'tabs') url = ['/', 'tabs', 'address', 'edit-address'];
    else url = [this.router.url, 'address', 'edit-address'];
    this.router.navigate(url, navData);
  }

  async changeAddress() {
    try {
      const options = {
        component: SearchLocationComponent,
        componentProps: {
          from: 'cart'
        },
        breakpoints: [0, 0.5, 0.8],
        initialBreakpoint: 0.8
      };
      const address = await this.global.createModal(options);
      if(address) {
        if(address == 'add') this.addAddress();
        await this.addressService.changeAddress(address);
      }
    } catch(e) {
      console.log(e);
    }
  }

  async makePayment() {
    try {
      console.log('model: ', this.model);
      let data: any = {
        chef_id: this.model.chef.id,
        instruction: this.instruction ? this.instruction : '',
        chef: this.model.chef,
        order: this.model.items,
        // time: moment().format('lll'),
        address: this.location,
        total: this.model.totalPrice,
        grandTotal: this.model.grandTotal,
        deliveryCharge: this.model.deliveryCharge,
        status: 'Created',
        payment_status: true,
        payment_mode: 'COD'
      };
      if(this.selectedCoupon) {
        data = { ...data, coupon: this.selectedCoupon };
      }
      console.log('order: ', data);
      await this.cartService.saveCartOrder(data);
      if(this.urlCheck && this.urlCheck != 'tabs') this.router.navigate([this.router.url, 'payment-option']);
      else this.global.navigateByUrl('/tabs/payment-option', false);
    } catch(e) {
      console.log(e);
    }
  }

  scrollToBottom() {
    this.content.scrollToBottom(500);
  }

  closeCouponModal(coupon) {
    console.log('coupon data: ', coupon);
    if(coupon) {
      this.selectedCoupon = coupon;
      // this.model.coupon = coupon;
      this.model.grandTotal -= this.selectedCoupon?.saved;
    }
    this.modal.dismiss();
  }

  removeCoupon() {
    this.model.grandTotal += this.selectedCoupon?.saved;
    this.selectedCoupon = null;
  }

  async destroy() {
    if(this.global.checkPlatform()) {
      const pop = await this.navCtrl.pop();
      console.log('destroy: ', pop);
      if(!pop) {
        this.ionViewWillLeave();
        this.ngOnDestroy();
      }
    }
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave CartPage');
    if(this.model?.items && this.model?.items.length > 0) {
      console.log('save cart cartpage: ', this.model);
      this.cartService.saveCart();
    }
  }

  ngOnDestroy() {
    console.log('Destroy CartPage');
    if(this.addressSub) this.addressSub.unsubscribe();
    if(this.cartSub) this.cartSub.unsubscribe();
  }

}