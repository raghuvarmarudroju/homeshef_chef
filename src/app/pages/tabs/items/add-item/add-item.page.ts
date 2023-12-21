import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormArray,FormsModule , FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { AddressService } from 'src/app/services/address/address.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { ActivatedRoute } from '@angular/router';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { MapComponent } from 'src/app/components/map/map.component';
import { Strings } from 'src/app/enum/strings.enum';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { HttpService } from 'src/app/services/http/http.service';
import { forkJoin, map } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule,FormsModule, ReactiveFormsModule, MapComponent]
})
export class AddItemPage implements OnInit {

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
  sub: any;

  showImage:boolean = false;


  product_gst = 5;
  homeshef_commission = 15;
  homeshef_commission_gst = 18;
  tds = 1;


  wpflMarginPercent = 15;
  wpflMarginValue:any;
  gstPercent = 5;
  gstValue:any;
  tdsPercent = 1;
  tdsValue:any;
  chefEarnings:any;
  foodTags: Array<any> = [];
  foodTypes: Array<any> = [];
  ingredients: Array<any> = [];
  units: Array<any> = [];
  minDate = new Date();
  maxDate = new Date();
  start_date: any;
  end_date: any;
  itemImage : any ='assets/imgs/noimage.png';
  public dates: any = {
    startDate: new Date(Date.now()),
    endDate: new Date(Date.now())
  }
  weekDays:any = [
    {"k":"Su","v":"sun","name":"Sunday","selected":true,"id":1},
    {"k":"Mo","v":"mon","name":"Monday","selected":true,"id":2},
    {"k":"Tu","v":"tue","name":"Tuesday","selected":true,"id":3},
    {"k":"We","v":"wed","name":"Wednesday","selected":true,"id":4},
    {"k":"Th","v":"thu","name":"Thursday","selected":true,"id":5},
    {"k":"Fr","v":"fri","name":"Friday","selected":true,"id":6},
    {"k":"Sa","v":"sat","name":"Saturday","selected":true,"id":7},
  ];
  availabilityFlags: any[] = [
    {value: 0, name: 'Not Limited'},
    {value: 1, name: 'Available On'},
    {value: 2, name: 'Unavailable On'},
    {value: 3, name: 'Available During'},
    {value: 4, name: 'Unavailable During'}
  ];
  basePrice: number;
  commission: any;
  commission_gst: number;
  total_commission: any;

  constructor(
    private navCtrl: NavController,
    private menuService: MenuService,
    private addressService: AddressService,
    private authService: AuthService,
    public formBuilder: FormBuilder,
    private httpService: HttpService,
    private global: GlobalService,
    private maps: GoogleMapsService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.checkForUpdate();
  }

  async checkForUpdate() {
    this.isLoading = true;
    this.observePrice(0);
    this.initForm();
  }

  initForm() {
    forkJoin({
      foodTags: this.menuService.getFoodTags(),
      ingredients: this.menuService.getIngredients(),
      units : this.menuService.getUnits(),
      foodTypes : this.menuService.getFoodTypes()

    })
    .pipe(
      map(response => {
        const foodTags = <Array<any>>response.foodTags.data.food_tags;
        const ingredients = <Array<any>>response.ingredients.data.ingredients;
        const units = <Array<any>>response.units.data.size_units;
        const foodTypes = <Array<any>>response.foodTypes.data;
        
        this.foodTags = foodTags;
        this.ingredients = ingredients;
        this.units = units;
        this.foodTypes = foodTypes;

        console.log("result ", this.foodTags)
      })
    )
    .subscribe((data) => {
      console.log(data)
      
    });
    this.formData();    
  }
  async formData() {
    this.form = new FormGroup({
      chef_id: new FormControl(await this.authService.getId(), {validators: [Validators.required]}),
      name: new FormControl('', {validators: [Validators.required]}),
      description: new FormControl('', {validators: [Validators.required]}),
      availability: new FormControl(0),
      dayNames: this.formBuilder.array([new FormControl('sun'),new FormControl('mon'),new FormControl('tue'),new FormControl('wed'),new FormControl('thu'),new FormControl('fri'),new FormControl('sat')]),
      startDate: new FormControl(this.dates.startDate),
      endDate: new FormControl(this.dates.endDate),
      perDayItemCookedCount: new FormControl(0, {validators: [Validators.required]}),
      price: new FormControl(0, {validators: [Validators.required]}),
      types: new FormControl(null, {validators: [Validators.required]}),
      unit: new FormControl('', {validators: [Validators.required]}),
      size: new FormControl(0, {validators: [Validators.required]}),
      expiresIn: new FormControl(0, {validators: [Validators.required]}),
      ingredients: this.formBuilder.array([]),
      spiceLevel: new FormControl('Not Spicy', {validators: [Validators.required]}),
      reheatingInstructions: new FormControl('', {validators: [Validators.required]}),
      tags: this.formBuilder.array([]),
      comment: new FormControl('', {validators: [Validators.required]}),
      chefearnings: new FormControl(0),
      wpflMarginPercent : new FormControl(0),
      wpflMarginValue : new FormControl(0),
      gstPercent : new FormControl(0),
      gstValue : new FormControl(0),
      tdsPercent : new FormControl(0),
      tdsValue : new FormControl(0),
      image: new FormControl(null)
    });
    this.isLoading = false;
  }
  public alterWeekDaysSelection(index:number, e:any) {
    this.weekDays[index].selected = !this.weekDays[index].selected;
    console.log(e);
    console.log(e.detail.value);
    let dayarr = this.form.get('dayNames') as FormArray;
    if(e.detail.checked){
      dayarr.push(new FormControl(e.detail.value));
    }
    else {
      let i = 0;
      dayarr.controls.forEach((t: any) => {
        if(t.value == e.detail.value) {
          dayarr.removeAt(i);
          return;
        }
        i++;
      });
    }
    console.log(this.form.get('dayNames').value);
  }
   
  nameChanged(arg) {
    console.log(this.start_date);
  } 
  public observePrice(event : any) {
    if(event != 0){
      let selectedValue = event.detail.value;
      this.basePrice = selectedValue - (this.gstPercent/100)*100;
      console.log(this.basePrice);
      this.commission = (this.homeshef_commission/100)*this.basePrice;
      console.log(this.commission);
      this.commission_gst =  (this.homeshef_commission_gst/100) * this.commission;
      console.log(this.commission_gst);
      this.tdsValue =  (this.tds/100) * this.basePrice;
      console.log(this.tdsValue);
      this.total_commission =  this.commission + this.commission_gst;
      console.log(this.total_commission);
      this.chefEarnings =  selectedValue - this.total_commission - this.tdsValue;
      console.log(this.chefEarnings);


    }  
  }
  public observePrices(event : any) {
    if(event != 0){
      let selectedValue = event.detail.value;
      this.wpflMarginValue = (this.wpflMarginPercent/100)*selectedValue;
      console.log(this.wpflMarginValue);
      this.chefEarnings = selectedValue - this.wpflMarginValue;
      this.gstValue = (this.gstPercent/100) * this.wpflMarginValue;
      this.chefEarnings = this.chefEarnings - this.gstValue;
      this.tdsValue = (this.tdsPercent/100) * this.chefEarnings;
      this.chefEarnings = this.chefEarnings - this.tdsValue;

    }  
  }
  public handleTags(e: any) {
    console.log(e);
    let tagarr = this.form.get('tags') as FormArray;
    tagarr.clear();
    if(e.detail.value) {
      e.detail.value.forEach((t: any) => {
        tagarr.push(new FormControl(t));
      });
    }
    console.log(this.form.get('tags')?.value);
  }
  public handleIngredients(e: any) {
    console.log(e);
    let ingredientarr = this.form.get('ingredients') as FormArray;
    ingredientarr.clear();
    if(e.detail.value) {
      e.detail.value.forEach((t: any) => {
        ingredientarr.push(new FormControl(t));
      });
    }
    console.log(this.form.get('ingredients')?.value);
  }
  toggleFetched() {
    this.isLocationFetched = !this.isLocationFetched;
  }

  toggleSubmit() {
    this.isSubmitted = !this.isSubmitted;
  }
  async editPicture() {
    // take picture
    try {
      //this.global.showLoader();
      const imageData = await this.global.takePicture();
      if(imageData) {
        const pic = 'data:image/png;base64,' + imageData.base64String;
        this.form.controls['image'].patchValue(pic);
        this.itemImage = pic;
      }
      //this.global.hideLoader();
    } catch(e) {
      console.log(e);
      //this.global.hideLoader();
    }
  }
  async onSubmit() {
    try {
      this.toggleSubmit();
      console.log(this.form.value);
      if(!this.form.valid) {
        this.global.errorToast('Please fill all fields');
        this.toggleSubmit();
        return;
      }
      this.form.value.startDate = moment(new Date(this.form.get('startDate')?.value)).format('YYYY-MM-DD');
      this.form.value.endDate = moment(new Date(this.form.get('endDate')?.value)).format('YYYY-MM-DD');
      this.form.value.chefearnings = this.chefEarnings;
      this.form.value.wpflMarginPercent = this.homeshef_commission;
      this.form.value.wpflMarginValue = this.commission;
      this.form.value.gstPercent = this.homeshef_commission_gst;
      this.form.value.gstValue = this.commission_gst;
      this.form.value.tdsPercent = this.tdsPercent;
      this.form.value.tdsValue = this.tdsValue;
      console.log(this.form.value);
      const params = {
        data : JSON.stringify(this.form.value)
      }
      console.log(params);
      if(!this.form.value.image) {
        this.global.errorToast('Please upload the item image!');
      }else {
        this.httpService.post("product/add", params).subscribe((item: any) => {
          console.log(item);
          if(item.data.status == 200){
            this.check = true;
            this.navCtrl.back();
            this.toggleSubmit();
          }else{
            this.global.errorToast('Something went wrong!');
          }
         
        });
      }
      this.check = true;
      //this.navCtrl.back();
      this.toggleSubmit();
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

  ionViewDidLeave() {
   console.log('ionViewDidLeave EditAddressPage');
   if(this.from == 'home' && !this.check) {
    this.addressService.changeAddress({});
   }
  }

}