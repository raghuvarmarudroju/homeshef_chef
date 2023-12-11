import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global/global.service';
import { Order } from 'src/app/models/order.model';
import { RateComponent } from '../rate/rate.component';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RatingComponent]
})
export class OrderComponent implements OnInit {

  @Input() order: any;
  @Output() reorder: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() accept: EventEmitter<any> = new EventEmitter();
  @Output() call: EventEmitter<any> = new EventEmitter();
  // @Output() rate: EventEmitter<any> = new EventEmitter();
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
    private global: GlobalService
  ) {}

  ngOnInit() {
    console.log(this.order);
  }

  reorderItem() {
    this.reorder.emit(this.order);
  }

  rateFood() {
    let options: any = {
      component: RateComponent,
      componentProps: {
        order: this.order
      },
      // cssClass: 'home-modal',
      swipeToClose: true, //works in ios only to close modal by swiping from top to bottom
      // presentingElement: this.routerOutlet.nativeEl
    };
    this.global.createModal(options);
  }

  track() {
    this.global.navigate(['/', 'tabs', 'orders', this.order.id]);
  }

  cancelOrder() {
    this.cancel.emit(this.order);
  }
  acceptOrder() {
    this.accept.emit(this.order);
  }
  callRider(phone) {
    this.call.emit(phone);
  }

}