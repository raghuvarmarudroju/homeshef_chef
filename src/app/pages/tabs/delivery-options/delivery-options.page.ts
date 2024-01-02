import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GlobalService } from 'src/app/services/global/global.service';
import { CuisineService } from 'src/app/services/cuisine/cuisine.service';
import { NavigationExtras, Router, RouterModule } from '@angular/router';
import { EmptyScreenComponent } from 'src/app/components/empty-screen/empty-screen.component';
import { FormsModule } from '@angular/forms';
import { HttpService } from 'src/app/services/http/http.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-delivery-options',
  templateUrl: './delivery-options.page.html',
  styleUrls: ['./delivery-options.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, EmptyScreenComponent]
})
export class DeliveryOptionsPage implements OnInit,OnDestroy{

  isLoading: boolean;
  isSubmitted = false;
  profileSub: Subscription;
  model = {
    title: 'No cuisines added yet',
    icon: 'location-outline'
  };
  delivery_type : any;
  profile: any;
  constructor(
    private global: GlobalService,
    private navCtrl: NavController,
    private cuisineService: CuisineService,
    private profileService: ProfileService,
    private httpService: HttpService,
    private router: Router) { 
      this.profileSub = this.profileService.profile.subscribe({
        next: profile => {
          this.profile = profile;
          console.log(this.profile);
          //alert(this.profile.transport_type);
          this.delivery_type = this.profile.transport_type;
        }
      });
      this.getData();
    }

  ngOnInit() {
    
  }

  ionViewDidEnter() {
    this.getData();
    console.log('ionViewDidEnter cuisinePage');
    this.global.customStatusbar();
  }
  getIcon(title) {
    return this.global.getIcon(title);
  }
  async getData() {
    try {
      this.isLoading = true;
      await this.profileService.getProfile();
      this.isLoading = false; 
    } catch(e) {
      this.isLoading = false;
      console.log(e);
      this.global.checkMessageForErrorToast(e);
    }
  }
  ngOnDestroy() {
    if(this.profileSub) this.profileSub.unsubscribe();
    this.global.customStatusbar(true);
  }
  toggleSubmit() {
    this.isSubmitted = !this.isSubmitted;
  }
  async onSubmit() {
    await this.cuisineService.getUid();
    try {
      this.toggleSubmit();
      const params = {
        id : this.cuisineService.uid,
        transport_type : this.delivery_type
      }
      this.httpService.post("users/update", params).subscribe((item: any) => {
        if(item.status == 200){
          this.global.successToast('Delivery Option updated!');
          this.toggleSubmit();
          this.navCtrl.back();
        }else{
          this.global.errorToast('Something went wrong!');
        }
       
      });
      this.toggleSubmit();
    } catch(e) {
      console.log(e);
      this.isSubmitted = false;
      this.global.errorToast();
    }

  }

}
