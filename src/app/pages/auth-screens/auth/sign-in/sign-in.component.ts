import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Keyboard } from '@capacitor/keyboard';
import { IonicModule } from '@ionic/angular';
import { Strings } from 'src/app/enum/strings.enum';
import { TermsConditionsPage } from 'src/app/pages/tabs/terms-conditions/terms-conditions.page';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { HttpService } from 'src/app/services/http/http.service';
import { OtpInputComponent } from '../otp-input/otp-input.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, ReactiveFormsModule]
})
export class SignInComponent implements OnInit {

  form: FormGroup;
  type = true;
  isLogin = false;
  isKeyboard = false;
  @Output() resetPwd: EventEmitter<any> = new EventEmitter();
  termsconditions: any;

  constructor(
    private authService: AuthService,
    private global: GlobalService,
    private httpService: HttpService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    const param = {
      id: 8
    }
    this.httpService.post('pages/getById', param).subscribe((terms: any) => {
      this.termsconditions = terms.data.content;
    });
    Keyboard.addListener('keyboardWillShow', info => {
      this.isKeyboard = true;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      console.log('keyboard will hide');
      this.isKeyboard = false;
    });
  }

  initForm() {
    this.form = new FormGroup({
      phone: new FormControl(null, { validators: [Validators.required, Validators.minLength(10)] }),
      terms: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  changeType() {
    this.type = !this.type;
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
    if (modal == true) {
      this.form.controls['terms'].setValue(true);
    }
  }
  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.value);
    this.login();
  }
  onTermsChecked(event) {
    console.log(event);
    if (!event.detail.checked) {
      this.form.patchValue({ terms: null });
    }
  }
  login() {
    this.isLogin = true;
    this.authService.checkMobileNumber(this.form.value.phone).subscribe(data => {
      console.log(data);
      if (data && data.status == 200) {
        if (data.data.is_blocked == 2) {
          this.isLogin = false;
          var status = 'error';
          this.global.showAlert('Your account has been deactivated. Please contact customer care');
        } else {
          this.generateOTP(this.form.value.phone, data.data.id);
        }
      } else if (data && data.status == 500) {
        this.isLogin = false;
        var status = 'error';
        this.global.showAlert(data.message)
      } else {
        this.isLogin = false;
        var status = 'error';
        this.global.showAlert('Something went wrong');
      }
    },
    (err) => {
      this.isLogin = false;
      this.global.errorToast(err.error.message);
    });
  }
  public generateOTP(params: any, id: any) {
    this.authService.getOTP(params).subscribe(async (data: any) => {
      if (data && data.status == 200) {
        this.resetPwd.emit(id);
      }
    });
  }
  navigate(data?) {
    const url = Strings.TABS;
    this.global.navigateByUrl(url);
  }

  forgotPassword() {
    this.resetPwd.emit('asfsdfsd');
  }

}
