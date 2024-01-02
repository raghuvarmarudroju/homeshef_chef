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
import { HttpService } from 'src/app/services/http/http.service';
import { ChefService } from 'src/app/services/chef/chef.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, OrderComponent, EmptyScreenComponent]
})
export class PaymentPage implements OnInit, OnDestroy {

  profile: any = {};
  isLoading: boolean;
  profileSub: Subscription;
  paymentSub : Subscription;
  emptyScreenModel = {
    icon: 'fast-food',
    title: 'No Orders Placed Yet',
    noSpace: true,
  };
  payments: any;

  constructor(
    // private navCtrl: NavController,
    private orderService: OrderService,
    private chefService: ChefService,
    public global: GlobalService,
    private profileService: ProfileService,
    private authService: AuthService,
    private httpService : HttpService
    ) { }

  ngOnInit() {
    this.profileSub = this.profileService.profile.subscribe({
      next: profile => {
        this.profile = profile;
        console.log(this.profile);
      }
    });
    this.paymentSub = this.chefService.payments.subscribe({
      next: payment => {
        this.payments = payment;
        console.log(this.payments);
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
      await this.chefService.getPayments();
      this.isLoading = false; 
    } catch(e) {
      this.isLoading = false;
      console.log(e);
      this.global.checkMessageForErrorToast(e);
    }
  }

  a
  ionViewDidLeave() {
    console.log('ionViewDidLeave AccountPage');
    this.global.customStatusbar();
  }

  ngOnDestroy() {
    console.log('ngondestroy account page');
    if(this.profileSub) this.profileSub.unsubscribe();
    if(this.paymentSub) this.paymentSub.unsubscribe();
    this.profileService.reset();
    this.chefService.reset();
  }

}
