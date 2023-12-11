import { EmptyScreenComponent } from 'src/app/components/empty-screen/empty-screen.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Coupon } from 'src/app/interfaces/coupon.interface';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, EmptyScreenComponent]
})
export class CouponsComponent implements OnInit {
  
  @Input() orderTotal: number;
  @Input() chef_id: string;
  @Output() close: EventEmitter<any> = new EventEmitter();
  coupons: Coupon[] = [];
  isLoading: boolean = false;
  more: boolean[];
  model = {
    title: 'Sorry! No offers for you',
    subTitle: 'Currently, there are no coupons available',
    icon: 'ticket',
    color: 'primary'
  };
  
  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.getCoupons();
  }

  async getCoupons() {
    try {
      this.isLoading = true;
      const coupons: Coupon[] = await this.orderService.getCoupons(this.chef_id);
      if(coupons?.length > 0) {
        this.more = new Array(coupons.length).fill(false);
        coupons.map((coupon) => {
          coupon.saved = this.getSavedAmount(coupon);
          return coupon;
        });
        this.coupons = [...coupons];
      }
      this.isLoading = false;
    } catch(e) {
      this.isLoading = false;
      console.log(e);
    }
  }

  getSavedAmount(coupon: Coupon) {
    let amt = 0;
    if(coupon?.minimumOrderAmount) {
      amt = this.orderTotal - coupon.minimumOrderAmount;
      if(amt < 0) return amt;
    }
    amt = coupon?.isPercentage ? (this.orderTotal * (coupon?.discount / 100)) : coupon?.discount;
    if(coupon?.upto_discount) {
      console.log('check amt: ', amt);
      amt = (amt >= coupon.upto_discount) ? coupon.upto_discount : amt;
    }
    return amt;
  }
  
  closeModal(data?) {
    this.close.emit(data);
  }

}
