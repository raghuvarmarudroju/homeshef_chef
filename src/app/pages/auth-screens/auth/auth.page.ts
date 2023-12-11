import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonicModule } from '@ionic/angular';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { GlobalService } from 'src/app/services/global/global.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule,
    SignInComponent,
    SignUpComponent,
    ResetPasswordComponent
  ],
})
export class AuthPage implements OnInit {

  segmentValue = '1';
  @ViewChild('forgot_pwd_modal') modal: IonModal;
  reset_pwd_model = {
    email: '',
    otp: '',
    new_password: ''
  };
  resetPwd = false;
  resetPwdModel: any = {};

  constructor(
    private global: GlobalService,
    private authService: AuthService
  ) { }

  ngOnInit() {}

  segmentChanged(event: any) {
    console.log(event);
    this.segmentValue = event.detail.value;
  }

  reset(event) {
    console.log(event);
    this.resetPwd = false;
    this.reset_pwd_model = {
      email: '',
      otp: '',
      new_password: ''
    };
  }

  openResetPwdModal(event) {
    this.resetPwd = true;
    this.getResetPwdData();
  }

  async sendResetPasswordEmailOtp(email) {
    try {
      this.global.showLoader();
      const data = await this.authService.sendResetPasswordOtp(email);
      console.log(data);
      this.reset_pwd_model = {...this.reset_pwd_model, email};
      this.getResetPwdData();
      this.global.hideLoader();
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      let msg = 'Something went wrong, please try again';
      this.global.checkErrorMessageForAlert(e, msg);
    };
  }

  async verifyResetPasswordOtp(otp) {
    try {  
      this.global.showLoader();
      const data = await this.authService.verifyResetPasswordOtp(this.reset_pwd_model.email, otp);
      console.log(data);
      this.reset_pwd_model = {...this.reset_pwd_model, otp};
      this.getResetPwdData();
      this.global.hideLoader();
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      let msg = 'Something went wrong, please try again';
      this.global.checkErrorMessageForAlert(e, msg);
    }; 
  }

  async resetPassword(new_password) {
    try {
      this.global.showLoader();
      this.reset_pwd_model = {...this.reset_pwd_model, new_password};
      this.getResetPwdData();
      const data = await this.authService.resetPassword(this.reset_pwd_model);
      console.log(data);
      this.global.hideLoader();
      this.modal.dismiss();
      this.global.successToast('Your password is changed successfully. Please login now.');
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      let msg = 'Something went wrong, please try again';
      this.global.checkErrorMessageForAlert(e, msg);
    };
  }

  getResetPwdData() {
    let data: any = {};
    let otp;
    let flag;
    if(this.reset_pwd_model?.email == '' && this.reset_pwd_model?.otp == '') {
      data = {
        title: 'Forgot password', 
        subTitle: 'Enter your email for the verification process, we will send a verification code to your email.', 
        button: 'SEND OTP'
      };
      otp = '';
      flag = 1;
    } else if(this.reset_pwd_model?.email != '' && this.reset_pwd_model?.otp == '') {
      data = {title: 'Verify your Email', subTitle: 'Enter the verification code sent to your email.', button: 'VERIFY'};
      flag = 2;
    } else {
      data = {
        title: 'Reset password', 
        subTitle: 'Enter your new password, must be atleast 8 characters long.', 
        button: 'SAVE'
      };
      flag = 3;
    }
    console.log(data);
    // return data;
    this.resetPwdModel = { ...data, otp, flag };
  }

}
