import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Strings } from 'src/app/enum/strings.enum';
import { matchingPasswords, emailValidator, pincodeValidator, phoneValidator } from 'src/app/utils/app-validators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { HttpService } from 'src/app/services/http/http.service';
import { TermsConditionsPage } from 'src/app/pages/tabs/terms-conditions/terms-conditions.page';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class SignUpComponent  implements OnInit {

  form: FormGroup;
  type = false;
  isLoading: boolean = false;
  termsconditions: any;
  communities: any;

  constructor(
    private authService: AuthService, 
    private global: GlobalService,
    private httpService: HttpService,
    public fb: FormBuilder
  ) { 
    this.initForm();
  }

  ngOnInit() {
    const param = {
      id : 4
    }
    this.httpService.post('terms',param).subscribe((terms: any) => { 
      this.termsconditions = terms.data.content;
    });
    this.httpService.get('communities').subscribe((communities: any) => { 
      this.communities = communities.data.communities;
      console.log(communities);
    });
  }

  initForm() {
    this.form = this.fb.group({ 
      community_id: ['', Validators.required],
      name: ['', Validators.required],
      number: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      password: ['', Validators.required],
      terms: [false, Validators.required]                            
    });
  }

  changeType() {
    this.type = !this.type;
  }

  onSubmit() {
    if(!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.value);
    
    this.register();
  }
  async terms() {
    const options = {
      component: TermsConditionsPage,
      componentProps: {
        terms: this.termsconditions
      },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8
    };
    const modal = await this.global.createModal(options);
    console.log('modal value: ', modal);
    if(modal == true){
      this.form.controls['terms'].setValue(true);
    }
  }
  register() {
    this.isLoading = true;
    console.log(this.form.value);
    this.authService.register(this.form.value).subscribe((data: any) => {
      if(data && data.status == 200 ) {
        this.authService.setUserData(data.data?.chef.id);
        this.navigate(data.data.chef);
        this.isLoading = false;
        this.form.reset();
      }
    }, error => {
      this.global.errorToast(error.error.message);
    });
  }
  navigate(data?) {    
    const url = Strings.TABS;
    this.global.navigateByUrl(url);
  }

}