import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonicModule } from '@ionic/angular';
import { Strings } from 'src/app/enum/strings.enum';
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
    otp: '',
  };
  resetPwd = false;
  resetPwdModel: any = {};
  id: any;

  constructor(
    private global: GlobalService,
    private authService: AuthService
  ) { }

  ngOnInit() {}

  segmentChanged(event: any) {
    
    this.segmentValue = event.detail.value;
  }

  reset(event) {
    console.log(event);
    this.resetPwd = false;
    this.reset_pwd_model = {
      otp: '',
    };
  }

  openResetPwdModal(event) {
    console.log(event);
    this.id = event;
    this.resetPwd = true;
    this.getResetPwdData();
  }

  async sendResetPasswordEmailOtp(email : any) {
    try {
      this.global.showLoader();
      const data = await this.authService.sendResetPasswordOtp(email);

      console.log(data);
      this.reset_pwd_model = {...this.reset_pwd_model};
      this.getResetPwdData();
      this.global.hideLoader();
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      let msg = 'Something went wrong, please try again';
      this.global.checkErrorMessageForAlert(e, msg);
    };
  }

  async verifyOtp(otp) {
    try { 
      this.global.showLoader();
      const param = {
        id: this.id,
        otp: otp
      };
      this.authService.verifyOTP(param).subscribe(async (data: any) => { 
        console.log(data);
        if(data.status == 200 && data.data){
          this.authService.userById(data.data.id).subscribe((data: any) => { 
            if (data && data.status === 200 && data.data && data.data.role_id == 3) {
              if (data && data.data && data.data.is_active == 1) {
                if (data.data.is_verified == 1) {
                  console.log(window['plugins'].OneSignal.User.pushSubscription);
                  if(data.data.onesignal_id==null || data.data.onesignal_id != window['plugins'].OneSignal.User.pushSubscription.id){
                    const param = {
                      id : data.data.id,
                      onesignal_id : window['plugins'].OneSignal.User.pushSubscription.id
                    }
                    this.authService.updateUser(param).subscribe((userData: any) => { 
                      this.authService.setUserData(data.data?.id);
                      this.global.hideLoader();
                      this.modal.dismiss();
                      this.navigate(data);
                    });
                  }else{
                    this.authService.setUserData(data.data?.id);
                    this.global.hideLoader();
                    this.modal.dismiss();
                    this.navigate(data);
                  }
                  // this.authService.setUserData(data.data?.id);
                  // this.global.hideLoader();
                  // this.modal.dismiss();
                  // this.navigate(data);
                } else {
                  this.global.hideLoader();
                  this.global.errorToast('Your are not verified.Please contact administrator');
                }
              } else {
                this.global.hideLoader();
                this.global.errorToast('You cannnot login at this time');
              }
            } else if (data && data.status === 500) {
              this.global.hideLoader();
              this.global.errorToast(data.data.message);
            } else {
              this.global.hideLoader();
              this.global.errorToast('Something went wrong');
            }
          });
        } else if (data && data.status == 500) {
          this.global.errorToast(data.data.message);
        } else {
          this.global.errorToast('Something went wrong');
        }
      },
      (err) => {
        this.global.hideLoader();
        this.global.errorToast(err.error.message);
      });
      // const data = await this.authService.verifyOTP(param);
      // console.log(data);
      // this.reset_pwd_model = {...this.reset_pwd_model, otp};
      // this.getResetPwdData();
      // this.global.hideLoader();
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      let msg = 'Something went wrong, please try again';
      this.global.checkErrorMessageForAlert(e, msg);
    }; 
  }
  navigate(data?) {    
    const url = Strings.TABS;
    this.global.navigateByUrl(url);
  }
  async resetPassword(new_password : any) {
    try {
      this.global.showLoader();
      this.reset_pwd_model = {...this.reset_pwd_model};
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
     if(this.reset_pwd_model?.otp == '') {
      data = {title: 'Verify your Mobile Number', subTitle: 'Enter the verification code sent to your Mobile Number.', button: 'VERIFY'};
      flag = 2;
    }
    console.log(data);
    // return data;
    this.resetPwdModel = { ...data, otp, flag };
  }

}
