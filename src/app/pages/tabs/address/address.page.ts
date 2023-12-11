import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Address } from 'src/app/models/address.model';
import { Subscription } from 'rxjs';
import { GlobalService } from 'src/app/services/global/global.service';
import { AddressService } from 'src/app/services/address/address.service';
import { NavigationExtras, Router, RouterModule } from '@angular/router';
import { EmptyScreenComponent } from 'src/app/components/empty-screen/empty-screen.component';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, EmptyScreenComponent]
})
export class AddressPage  implements OnInit, OnDestroy {

  isLoading: boolean;
  addresses: Address[] = [];
  addressesSub: Subscription;
  model = {
    title: 'No Addresses added yet',
    icon: 'location-outline'
  };

  constructor(
    private global: GlobalService,
    private addressService: AddressService,
    private router: Router) { }

  ngOnInit() {
    this.addressesSub = this.addressService.addresses.subscribe({
      next: address => {
        console.log('addresses: ', address);
        this.addresses = address;      
      }
    });
    this.getAddresses();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter AddressPage');
    this.global.customStatusbar();
  }

  async getAddresses() {    
    try {
      this.isLoading = true;
      // this.global.showLoader();
      const addresses = await this.addressService.getAddresses();
      console.log('addresses list: ', addresses);
      this.isLoading = false;
      // this.global.hideLoader();
    } catch(e) {
      console.log(e);
      this.isLoading = false;
      // this.global.hideLoader();
      this.global.errorToast();
    }
  }

  getIcon(title) {
    return this.global.getIcon(title);
  }

  editAddress(address) {
    console.log(address);
    const navData: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(address)
      }
    };
    this.router.navigate([this.router.url, 'edit-address'], navData);
  }

  deleteAddress(address) {
    console.log('address: ', address);
    this.global.showAlert(
      'Are you sure you want to delete this address?',
      'Confirm',
      [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('cancel');
            return;
          }
        },
        {
          text: 'Yes',
          handler: async () => {
            this.global.showLoader();
            await this.addressService.deleteAddress(address);
            this.global.hideLoader();
          }
        }
      ]
    )
  }

  ngOnDestroy() {
    if(this.addressesSub) this.addressesSub.unsubscribe();
    this.global.customStatusbar(true);
  }

}
