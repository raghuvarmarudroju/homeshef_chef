import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditProfileComponent } from 'src/app/components/edit-profile/edit-profile.component';
import { Order } from 'src/app/models/order.model';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/order/order.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Strings } from 'src/app/enum/strings.enum';
import { RouterModule } from '@angular/router';
import { OrderComponent } from 'src/app/components/order/order.component';
import { EmptyScreenComponent } from 'src/app/components/empty-screen/empty-screen.component';
import { EditAboutComponent } from 'src/app/components/edit-about/edit-about.component';
import { TimingsPage } from '../timings/timings.page';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, OrderComponent, EmptyScreenComponent]
})
export class AccountPage implements OnInit, OnDestroy {

  profile: any = {};
  isLoading: boolean;
  orders: Order[] = [];
  ordersSub: Subscription;
  profileSub: Subscription;
  emptyScreenModel = {
    icon: 'fast-food',
    title: 'No Orders Placed Yet',
    noSpace: true,
  };
  loadMore = false;
  noMoreOrders = false;

  constructor(
    // private navCtrl: NavController,
    private orderService: OrderService,
    private cartService: CartService,
    public global: GlobalService,
    private profileService: ProfileService,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.ordersSub = this.orderService.orders.subscribe({
      next: orders => {
        console.log('order data: ', orders);
        this.orders = orders;
      }, 
      error: e => {
        console.log(e);
      }
    });
    this.profileSub = this.profileService.profile.subscribe({
      next: profile => {
        this.profile = profile;
        console.log(this.profile);
      }
    });
    this.getData();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter AccountPage');
    this.global.customStatusbar(true);
    this.getData();
  }

  async getData() {
    try {
      this.isLoading = true;
      await this.profileService.getProfile();
      await this.orderService.getPastOrders();
      this.isLoading = false; 
    } catch(e) {
      this.isLoading = false;
      console.log(e);
      this.global.checkMessageForErrorToast(e);
    }
  }

  async loadMoreOrders() {
    try {
      this.loadMore = true;
      const response: any = await this.orderService.getPastOrders();
      this.noMoreOrders = !response?.loadMore;
      console.log('no more orders: ', this.noMoreOrders);
      this.loadMore = false; 
    } catch(e) {
      this.loadMore = false;
      console.log(e);
      this.global.checkMessageForErrorToast(e);
    }
  }

  async editPicture() {
    // take picture
    try {
      this.global.showLoader();
      const imageData = await this.global.takePicture();
      if(imageData) {
        const pic = 'data:image/png;base64,' + imageData.base64String;
        const response = await this.profileService.updateProfilePic(pic);
        console.log(response);
        this.global.successToast('Profile picture updated');
      }
      this.global.hideLoader();
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
    }
  }

  confirmLogout() {
    this.global.showAlert(
      'Are you sure you want to sign-out?',
      'Confirm',
      [{
        text: 'No',
        role: 'cancel'
      }, {
        text: 'Yes',
        handler: () => {
          this.logout();
        }
      }]
    );
  }

  async reorder(order: Order) {
    console.log(order);
    let data = await this.cartService.getCart();
    console.log('data: ', data);
    if(data?.value) {
      this.cartService.alertClearCart(null, null, null, order);
    } else {
      this.cartService.orderToCart(order);
    }
  }
  async updateTimings() {
    const options = {
      component: TimingsPage,
      componentProps: {
        profile: this.profile
      },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8
    };
    const modal = await this.global.createModal(options);
  }
  async editProfile() {
    const options = {
      component: EditProfileComponent,
      componentProps: {
        profile: this.profile
      },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8
    };
    const modal = await this.global.createModal(options);
  }
  async editAbout() {
    const options = {
      component: EditAboutComponent,
      componentProps: {
        profile: this.profile
      },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8
    };
    const modal = await this.global.createModal(options);
  }
  call(number) {
    this.global.call(number)
    .then(() => {})
    .catch((e) => console.log(e));
  }

  async cancel(order) {
    try {
      this.global.showLoader();
      console.log(order);
      await this.orderService.updateOrder(order, {status: 'Cancelled'});
      this.global.hideLoader();
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      this.global.errorToast();
    }
  }

  logout() {
    this.global.showLoader();
    this.authService.logout().then(() => {
      this.login();
      this.global.hideLoader();
    })
    .catch(e => {
      console.log(e);
      this.global.hideLoader();
      this.global.errorToast('Logout Failed! Check your internet connection');
    });
  }

  login() {
    // this.navCtrl.navigateRoot(Strings.LOGIN);
    this.global.navigateByUrl(Strings.LOGIN);
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave AccountPage');
    this.global.customStatusbar();
  }

  ngOnDestroy() {
    console.log('ngondestroy account page');
    if(this.ordersSub) this.ordersSub.unsubscribe();
    if(this.profileSub) this.profileSub.unsubscribe();
    this.profileService.reset();
    this.orderService.reset();
  }

}
