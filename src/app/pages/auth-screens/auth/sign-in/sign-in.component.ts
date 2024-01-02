import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Keyboard } from '@capacitor/keyboard';
import { IonicModule } from '@ionic/angular';
import { Strings } from 'src/app/enum/strings.enum';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';

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

  constructor(
    private authService: AuthService,
    private global: GlobalService
  ) { 
    this.initForm();
  }

  ngOnInit() {
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
      email: new FormControl(null, {validators: [Validators.required]}),
      password: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]})
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
    this.login();
  }
  // if(data) {
  //   this.navigate(data);
  //   this.isLogin = false;
  //   this.form.reset();
  // } else {
  //   this.isLogin = false;
  //   this.global.showAlert('You are not an Authorized User! Please try again with proper credentials.');
  // }
  login() {
    this.isLogin = true;
    this.authService.login(this.form.value.email, this.form.value.password).subscribe(auth=>{ 
      if (auth && auth.status == 200 ) {
        if (auth.data.is_verified == 1) {
          console.log(window['plugins'].OneSignal.User.pushSubscription);
          if(auth.data.onesignal_id==null || auth.data.onesignal_id != window['plugins'].OneSignal.User.pushSubscription.id){
            const param = {
              id : auth.data.id,
              onesignal_id : window['plugins'].OneSignal.User.pushSubscription.id
            }
            this.authService.update(param).subscribe((userData: any) => { 
              this.authService.setUserData(auth.data?.id);
              this.navigate(auth.data);
              this.isLogin = false;
              this.form.reset();
              console.log(auth);
            });
          }else{
            this.authService.setUserData(auth.data?.id);
              this.navigate(auth.data);
              this.isLogin = false;
              this.form.reset();
              console.log(auth);
          }
        } else {
          this.global.hideLoader();
          this.global.errorToast('Your are not verified.Please contact administrator');
        }
      }else{
        this.isLogin = false;
        this.global.showAlert('You are not an Authorized User! Please try again with proper credentials.');
      }
    },error => {
      console.log(error);
      this.isLogin = false;
      this.global.showAlert('You are not an Authorized User! Please try again with proper credentials.');
  });
  }

  navigate(data?) {    
    const url = Strings.TABS;
    this.global.navigateByUrl(url);
  }

  forgotPassword() {
    this.resetPwd.emit(true);
  }

}
