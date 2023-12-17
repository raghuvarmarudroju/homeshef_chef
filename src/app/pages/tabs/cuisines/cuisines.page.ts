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

@Component({
  selector: 'app-cuisines',
  templateUrl: './cuisines.page.html',
  styleUrls: ['./cuisines.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, EmptyScreenComponent]
})
export class CuisinesPage implements OnInit,OnDestroy{

  isLoading: boolean;
  cuisines: any[] = [];
  cuisinesSub: Subscription;
  isSubmitted = false;
  chefCuisines: any[] = [];
  chefCuisinesSub: Subscription;
  selectedCuisines: any[] = [];
  model = {
    title: 'No cuisines added yet',
    icon: 'location-outline'
  };

  constructor(
    private global: GlobalService,
    private navCtrl: NavController,
    private cuisineService: CuisineService,
    private httpService: HttpService,
    private router: Router) { }

  ngOnInit() {
    this.cuisinesSub = this.cuisineService.cuisines.subscribe({
      next: cuisine => {
        console.log('cuisines: ', cuisine);
        this.cuisines = cuisine;     
        this.chefCuisines.forEach(element => {

          var index = this.cuisines.map(function (cuisine) { return cuisine.id; }).indexOf(element.cuisine_id);
          console.log(index);
          this.cuisines[index].selected = true;
        }); 
      }
    });
    this.chefCuisinesSub = this.cuisineService.chefCuisines.subscribe({
      next: cuisine => {
        console.log('cuisines: ', cuisine);
        this.chefCuisines = cuisine;
        this.chefCuisines.forEach(element => {
          this.selectedCuisines.push(element.cuisine_id);
          var index = this.cuisines.map(function (cuisine) { return cuisine.id; }).indexOf(element.cuisine_id);
          console.log(index);
          this.cuisines[index].selected = true;
        }); 
      }
    });
    this.getcuisines();
  }

  ionViewDidEnter() {
    
    console.log('ionViewDidEnter cuisinePage');
    this.global.customStatusbar();
  }

  async getcuisines() {    
    try {
      this.isLoading = true;
      this.global.showLoader();
      const cuisines = await this.cuisineService.getCuisines();
      console.log('cuisines list: ', cuisines);
      const chefCuisines = await this.cuisineService.getChefCuisines();
      console.log('cuisines list: ', chefCuisines);
      this.isLoading = false;
      this.global.hideLoader();
    } catch(e) {
      console.log(e);
      this.isLoading = false;
      this.global.hideLoader();
      this.global.errorToast();
    }
  }

  getIcon(title) {
    return this.global.getIcon(title);
  }

  editcuisine(cuisine) {
    console.log(cuisine);
    const navData: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(cuisine)
      }
    };
    this.router.navigate([this.router.url, 'edit-cuisine'], navData);
  }
  ngOnDestroy() {
    if(this.cuisinesSub) this.cuisinesSub.unsubscribe();
    this.global.customStatusbar(true);
  }
  toggleSubmit() {
    this.isSubmitted = !this.isSubmitted;
  }
  public cuisineSelection(e:any) {
    console.log(e);
    if(e.detail.checked == true){
      this.selectedCuisines.push(e.detail.value);
    }
    else {
      var index = this.selectedCuisines.indexOf(e.detail.value);
      this.selectedCuisines.splice(index,1);
    }
    this.selectedCuisines = this.removeDuplicates(this.selectedCuisines);
    console.log(this.selectedCuisines);
  }
 removeDuplicates(arr) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
    }
  async onSubmit() {
    await this.cuisineService.getUid();
    try {
      this.toggleSubmit();
      const params = {
        id : this.cuisineService.uid,
        cuisines : JSON.stringify(this.selectedCuisines)
      }
      this.httpService.post("chef/cuisines/update", params).subscribe((item: any) => {
        if(item.status == 200){
          this.global.successToast('Cuisines updated!');
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
