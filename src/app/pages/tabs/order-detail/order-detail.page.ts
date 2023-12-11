import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { RatingComponent } from 'src/app/components/rating/rating.component';
import { TrackComponent } from 'src/app/components/track/track.component';
import { Order } from 'src/app/models/order.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, TrackComponent, RatingComponent]
})
export class OrderDetailPage implements OnInit, OnDestroy {

  id: any;
  order: any;
  // orderSub: Subscription;
  // riderSub: Subscription;
  stat: string;
  interval: any;
  duration: any;
  public delivery_status = [
    {'name':'Order Placed','status_icon':'order-placed.png'},
    {'name':'Accepted','status_icon':'accept.png'},
    {'name':'Processing','status_icon':'processing.png'},
    {'name':'On Hold','status_icon':'hold.png'},
    {'name':'Out for Delivery','status_icon':'out-for-delivery.png'},
    {'name':'Delivered','status_icon':'delivered.png'},
    {'name':'Rejected','status_icon':'cancel.png'},
    {'name':'N/A','status_icon':''}
  ]
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private global: GlobalService
  ) { }

  async ngOnInit() {
    this.global.customStatusbar();
    const id = this.route.snapshot.paramMap.get('id');
    console.log('check id: ', id);
    if(!id) {
      this.navCtrl.back();
      return;
    }
    this.id = id;
    console.log('id: ', this.id);
    await this.getOrder();
  }

  async getOrder() {
    try {
      this.global.showLoader();
      //this.order = await this.orderService.getOrder(this.id);
      (await this.orderService.getOrder(this.id)).subscribe((res:any) => { 
        console.log(res);
        this.order = res.data.order;
      });
      this.global.hideLoader();
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      this.global.checkMessageForErrorToast(e);
    }
  //  this.orderSub = (await this.orderService.getOrder(this.id)).subscribe((order: any) => {
  //    console.log('orderSub', order);
  //    this.order = order; 
  //    console.log('current order: ', this.order);
  //    console.log('riderSub: ', this.riderSub);
  //   if((!this.riderSub) && (this.order?.status == 'Ongoing' || this.order?.status == 'Picked')) {
  //     console.log('current order1: ', this.order);
  //     this.liveTrackRider();
  //   } else if(this.riderSub && this.order?.status != 'Ongoing' && this.order?.status != 'Picked') {
  //     console.log('current order2: ', this.order);
  //     this.UnsubcribeProfile();
  //   }
  //   console.log('current order3: ', this.order);
  //   }, e => {
  //     console.log(e);
  //   }); 
  }

  async liveTrackRider() {    
    // this.riderSub = (await this.orderService.liveTrackRider(this.order?.rider_id)).subscribe(rider => {
    //   console.log('rider: ', rider);
    //   this.order.rider = {...rider};
    // }, e => {
    //   console.log(e);
    // });  
  }

  printOrder() {}

  changeStat(event) {
    console.log(event);
    this.stat = event.detail.value;
  }  

  async changeStatus(status) {
    try {
      this.global.showLoader();      
      // const order = {...this.order, status};
      // console.log(order);
      await this.orderService.updateOrder(this.order, {status: status});
      this.global.hideLoader();
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      this.global.errorToast();
    }
  }

  getBgColor(status) {
    switch(status) {
      case 5: return 'var(--ion-color-success)';
      case 3: return 'var(--ion-color-danger)';
      case 6: return 'var(--ion-color-danger)';
      default: return '';
      // case 'Created' || 'Accepted' || 'Ongoing': return 'var(--ion-color-secondary)';
      // case 'Accepted': return 'var(--ion-color-secondary)';
    }
  }

  // async supportActionSheet() {
  //   const actionSheet = await this.global.showActionSheet(
  //     [
  //       {
  //         text: 'Chat',
  //         icon: 'chatbubble',
  //         handler: () => {
  //           console.log('chat clicked');
  //         },
  //       },
  //       {
  //         text: 'Call',
  //         icon: 'call',
  //         handler: () => {
  //           console.log('Call clicked');
  //           // this.call()
  //         },
  //       },
  //       {
  //         text: 'Favorite',
  //         icon: 'heart',
  //         handler: () => {
  //           console.log('Favorite clicked');
  //         },
  //       },
  //       {
  //         text: 'Cancel',
  //         icon: 'close',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         },
  //       },
  //     ],
  //   );
  // }

  call(number) {
    this.global.call(number)
    .then(() => {})
    .catch((e) => console.log(e));
  }

  checkClass() {
    if(this.order?.status == 'Delivered' || this.order?.status == 'Rejected' || this.order?.status == 'Cancelled') 
      return 'ion-no-border';
    else return '';
  }

  updateDuration(duration) {
    this.duration = duration;
  }

  // UnsubcribeProfile() {    
  //   if(this.riderSub) this.riderSub.unsubscribe();
  // }

  ngOnDestroy() {
    this.global.customStatusbar(true);
    // if(this.orderSub) this.orderSub.unsubscribe();
    // this.UnsubcribeProfile();
  } 

}
