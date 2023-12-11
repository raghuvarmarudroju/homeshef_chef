import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { IonicModule } from "@ionic/angular";
import { GlobalService } from "src/app/services/global/global.service";
import { HttpService } from "src/app/services/http/http.service";
import { ProfileService } from "src/app/services/profile/profile.service";

@Component({
  selector: "app-timings",
  templateUrl: "./timings.page.html",
  styleUrls: ["./timings.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class TimingsPage implements OnInit {
  @Input() profile;
  isSubmitted = false;
  form: FormGroup;
  timings: any;
  chefItems: FormArray;
  constructor(
    private profileService: ProfileService,
    private global: GlobalService,
    private httpService: HttpService,
    private formBuilder: FormBuilder
  ) {
    //this.timings = this.profile.timings;
  }

  ngOnInit() {
    this.timings = this.profile.timings;
    console.log(this.timings);
    this.form = new FormGroup({
      timings: new FormArray([])
    });
    this.timings.forEach((t: any) => {
      this.addTiming(t);
    });
  }
  createTiming(t : any): FormGroup {
    return this.formBuilder.group({
      id: [t.id],
      chef_id: [t.chef_id],
      category_id: [t.category_id],
      category_name: [t.category.name],
      start_time: [t.start_time],
      end_time: [t.end_time],
      delivery_pickup_time: [t.delivery_pickup_time],
      delivery_pickup_end_time: [t.delivery_pickup_end_time],
    });
  }
  
  addTiming(t : any): void {
    this.chefItems = this.form.get('timings') as FormArray;
    this.chefItems.push(this.createTiming(t));
  }
  async onSubmit() {
    try {
      
      const params = {
        timings : JSON.stringify(this.form.value.timings)
      }
      this.httpService.post("chef/timings/update", params).subscribe((item: any) => {
        if(item.status == 200){
          this.global.successToast('Timings updated!');
          this.global.modalDismiss(item);
        }else{
          this.global.errorToast('Something went wrong!');
        }
       
      });
    } catch (e) {
      console.log(e);
      this.isSubmitted = false;
      this.global.errorToast();
    }
  }
}
