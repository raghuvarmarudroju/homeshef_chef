import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { AddressService } from 'src/app/services/address/address.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { ActivatedRoute } from '@angular/router';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { MapComponent } from 'src/app/components/map/map.component';
import { Strings } from 'src/app/enum/strings.enum';
import { HttpService } from 'src/app/services/http/http.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html',
  styleUrls: ['./edit-address.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, MapComponent]
})
export class EditAddressPage implements OnInit {

  form: FormGroup;
  isSubmitted = false;
  location: any = {};
  isLocationFetched: boolean;
  center: any;
  update: boolean;
  id: any;
  uid: string;
  isLoading: boolean = false;
  from: string;
  check: boolean = false;
  chef: any;

  constructor(
    private navCtrl: NavController,
    private addressService: AddressService,
    private global: GlobalService,
    private httpService: HttpService,
    private authService: AuthService,
    private maps: GoogleMapsService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    const id = await this.authService.getId();

    console.log("check id: ", id);
    if (!id) {
      this.navCtrl.back();
      return;
    }
    this.uid = id;
    this.checkForUpdate();
  }

  async checkForUpdate() {
    this.isLoading = true;
    this.location.title = 'Locating...';
    this.isLocationFetched = false;
    this.initForm();
  }

  async initForm() {
    await this.httpService.get("chef/" + this.uid).subscribe((chef: any) => {
      if(chef.status == 200){
        this.chef = chef.data.results;
        let data = chef.data.results.chef_address;
        this.center = {
          lat: data.lat,
          lng: data.lng
        };
        this.id = data.id;
        this.form = new FormGroup({
          floor: new FormControl(data.floor, {validators: [Validators.required]}),
          house: new FormControl(data.house, {validators: [Validators.required]}),
          block: new FormControl(data.block, {validators: [Validators.required]}),
        });
        this.isLoading = false;
        this.location = data;
      }
    });
 
    
  }

  fetchLocation(event) {
    this.location = event;
    console.log('location: ', this.location);
    this.isLocationFetched = true;
    this.cdr.detectChanges();
  }
  
  toggleFetched() {
    this.isLocationFetched = !this.isLocationFetched;
  }

  toggleSubmit() {
    this.isSubmitted = !this.isSubmitted;
  }

  async onSubmit() {
    try {
      this.toggleSubmit();
      console.log(this.form);
      if(!this.form.valid) {
        this.toggleSubmit();
        return;
      }
      const data = {
        floor: this.form.value.floor,
        house: this.form.value.house,
        block: this.form.value.block
      };
        await this.httpService.put('address/'+this.id,data).subscribe((address: any) => { 
          console.log(address);
          if(address.status == 200){
            this.global.successToast('Address updated');
            this.navCtrl.back();
          }
        });
      
    } catch(e) {
      console.log(e);
      this.isSubmitted = false;
      this.global.errorToast();
    }

  }

  loginPrompt() {
    this.global.showAlert(
      'You need to login to add address. Do you want to proceed to login?',
      'Login',
      [{
        text: 'No',
        role: 'cancel'
      }, {
        text: 'Yes',
        handler: () => {
          this.global.navigateByUrl(Strings.LOGIN);
        }
      }]
    );
  }

  async searchLocation() {
    try {
      const options = {
        component: SearchLocationComponent,
        // cssClass: 'address-modal',
        // swipeToClose: true,
        breakpoints: [0, 0.5, 0.7, 0.9],
        initialBreakpoint: 0.7,
        // handleBehaviour: "cycle",
        // handle: false
      };
      const location = await this.global.createModal(options);
      console.log('location: ', location);
      if(location) {
        this.location = location;
        const loc = {
          lat: location.lat,
          lng: location.lng
        };
        // update marker
        this.update = true;
        this.maps.changeMarkerInMap(loc);
      }
    } catch(e) {
      console.log(e);
    }
  }


}