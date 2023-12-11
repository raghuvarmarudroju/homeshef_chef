import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
// import { combineLatest, Subject, Subscription } from 'rxjs';
import { GlobalService } from 'src/app/services/global/global.service';
import { LoadingChefComponent } from 'src/app/components/loading-chef/loading-chef.component';
import { ChefComponent } from 'src/app/components/chef/chef.component';
import { EmptyScreenComponent } from 'src/app/components/empty-screen/empty-screen.component';
import { RouterModule } from '@angular/router';
import { Chef } from 'src/app/interfaces/chef.interface';
import { ChefService } from 'src/app/services/chef/chef.service';
import { AddressService } from 'src/app/services/address/address.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    RouterModule,
    LoadingChefComponent,
    ChefComponent,
    EmptyScreenComponent
  ]
})
export class SearchPage implements OnInit, OnDestroy {

  @ViewChild('searchInput') sInput;
  model: any = {
    icon: 'search-outline',
    title: 'No Chefs Found'
  };
  isLoading: boolean;
  query: any;
  chefs: Chef[] = [];

  // startAt = new Subject();
  // endAt = new Subject();

  // startObs = this.startAt.asObservable();
  // endObs = this.endAt.asObservable();

  // querySub: Subscription;
  location: any = {};
  addressSub: Subscription;

  constructor(
    private addressService: AddressService,
    private chefService: ChefService,
    public global: GlobalService
  ) { }

  ngOnInit() {
    this.addressSub = this.addressService.addressChange.subscribe({
      next: (address) => {
        console.log('address', address);
        if(address && address?.lat) {
          if(this.location?.lat == address?.lat && this.location?.lng == address?.lng) {
            return null;
          }
          this.location = address;
          // search nearby chefs
          console.log('search nearby chefs');
          this.querySearch();
        }
      }, 
      error: (e) => {
        console.log(e);
      }
    });
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.sInput.setFocus();
    }, 500);
  }

  async onSearchChange(event) {
    console.log(event.detail.value);
    this.query = event.detail.value.toLowerCase();
    this.querySearch();
  }

  async querySearch() {
    try {
      this.chefs = [];
      if(!this.location?.lat) {
        this.global.showAlert(
          'Kindly select a location to proceed...', 
          'Location needed', 
          [
            {
              text: 'OK',
              role: 'cancel',
              handler: () => {
                console.log('Confirm');
              }
            }
          ]
        );
        return null;
      }
      if(this.query?.length > 0) {
        // this.startAt.next(this.query); // it is a PUA code, used to match query that start with querytext
        // this.endAt.next(this.query + '\uf8ff');
        this.isLoading = true;
        this.chefs = await this.chefService.searchNearbyChefs(
          this.query, 
          this.location?.lat, 
          this.location?.lng
        );
        console.log(this.chefs);
        this.isLoading = false;
      }
    } catch(e) {
      console.log(e);
      this.isLoading = false;
      this.global.checkMessageForErrorToast(e);
    }
  }

  ngOnDestroy() {
    if(this.addressSub) this.addressSub.unsubscribe();
    // if(this.querySub) this.querySub.unsubscribe();
  }

}