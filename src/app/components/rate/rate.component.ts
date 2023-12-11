import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Order } from 'src/app/models/order.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { OrderService } from 'src/app/services/order/order.service';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RatingComponent]
})
export class RateComponent implements OnInit {

  @Input() order: Order;
  rating: any = {
    rate_chef: 0,
    comment_chef: '',
    rate_rider: 0,
    comment_rider: ''
  };

  constructor(
    private global: GlobalService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    if(this.order?.rating) this.rating = this.order.rating;
  }

  // onRatingChange(event) {
  //   console.log(event);
  // }

  dismiss() {
    this.global.modalDismiss();
  }

  async submit() {
    try {
      this.global.showLoader();
      console.log(this.order);
      if(this.rating?.rate_chef == 0) {
        this.global.errorToast('Please rate the chef');
      } else if(this.rating?.rate_rider == 0) {
        this.global.errorToast('Please rate the rider');
      } else {
        await this.orderService.updateOrder(this.order, { rating: this.rating });
        this.global.modalDismiss();
      }
      this.global.hideLoader();
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      this.global.errorToast();
    }
  }

}
