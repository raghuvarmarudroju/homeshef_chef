import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Strings } from 'src/app/enum/strings.enum';
import { User } from 'src/app/models/user.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { HttpService } from '../http/http.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class AuthUserId {
  constructor(public uid: string) {}
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public static UNKNOWN_USER = null;
  private _uid = new BehaviorSubject<AuthUserId>(AuthService.UNKNOWN_USER);

  get userId() {
    return this._uid.asObservable().pipe(map(uid => {
        console.log(uid);
        if(uid) return uid
        else return AuthService.UNKNOWN_USER;
      })
    );
  }

  constructor(
    private storage: StorageService,
    private global: GlobalService,
    public http:HttpClient, 
  ) { }
  public login(email: string, password: string){
    const httpOptions = {
      headers: new HttpHeaders({
        "basic": environment.authToken
      })
    };
    const input ={
      username : email,
      password : password
    }
    return this.http.post(environment.adminURL + 'cheflogin', input,httpOptions)
      .pipe(
        map(
          (response:any) => {
            if (response) {
              return response;
            }
          },
          (error: any) => {
            return error;
          }
        )
      )
  }
  public checkMobileNumber(input : any){
    const param = {
      mobile: input,
      cc: '+91',
      from:'2'
    };
    return this.http.post(environment.adminURL +'checkMobileNumber', param)
      .pipe(
        map(
          (response:any) => {
            if (response) {
              return response;
            }
          },
          (error: any) => {
            return error;
          }
        )
      )
  }
  public getOTP(input : any){
    const param = {
      mobile: input,
      cc: '+91',
      from:'2'
    };
    return this.http.post(environment.adminURL +'send_otp', param)
      .pipe(
        map(
          (response:any) => {
            if (response) {
              return response;
            }
          },
          (error: any) => {
            return error;
          }
        )
      )
  }
  public verifyOTP(input : any){

    return this.http.post(environment.adminURL +'verifyOTP', input)
      .pipe(
        map(
          (response:any) => {
            if (response) {
              return response;
            }
          },
          (error: any) => {
            return error;
          }
        )
      )
  }
  public updateUser(input : any){

    return this.http.post(environment.adminURL +'edit_profile', input)
      .pipe(
        map(
          (response:any) => {
            if (response) {
              return response;
            }
          },
          (error: any) => {
            return error;
          }
        )
      )
  }
  public userById(id : any){

    return this.http.get(environment.serverBaseUrl + 'chef/'+id)
      .pipe(
        map(
          (response:any) => {
            if (response) {
              return response;
            }
          },
          (error: any) => {
            return error;
          }
        )
      )
  }
  public register(data : any){

    return this.http.post(environment.adminURL + 'chef/register',data)
      .pipe(
        map(
          (response:any) => {
            if (response) {
              return response;
            }
          },
          (error: any) => {
            return error;
          }
        )
      )
  }
  
  public update(data : any){

    return this.http.post(environment.adminURL + 'users/update',data)
      .pipe(
        map(
          (response:any) => {
            if (response) {
              return response;
            }
          },
          (error: any) => {
            return error;
          }
        )
      )
  }
  async getId() {
    const user = this._uid.value;
    console.log('auth user id: ', user?.uid);
    if(user?.uid) {
      return user.uid;
    } else {
      // return (await this.storage.getStorage(Strings.UID)).value;
      const uid = (await this.storage.getStorage(Strings.UID)).value;
      console.log(uid);
      this._uid.next(new AuthUserId(uid));
      return uid;
    }
  }
  public getChefOrders(input : any){
    const httpOptions = {
      headers: new HttpHeaders({
        "basic": environment.authToken
      })
    };
    return this.http.post(environment.adminURL + 'ordersByCid',input,httpOptions)
      .pipe(
        map(
          (response:any) => {
            if (response) {
              return response;
            }
          },
          (error: any) => {
            return error;
          }
        )
      )
  }
  setUserData(uid) {
    this.storage.setStorage(Strings.UID, uid);
    this._uid.next(new AuthUserId(uid));
  }

  async sendResetPasswordOtp(email: string) {
    try {
      const data = { email };
      // const response = await this.http.lastValueFrom(this.http.get('your_api', data));
      // console.log(response);
      // return response;
      return null;
    } catch(e) {
      throw(e);
    }
  }

  async verifyResetPasswordOtp(email: string, otp: string) {
    try {
      const data = { 
        email,
        reset_password_token: otp 
      };
      // const response = await this.http.lastValueFrom(this.http.get('your_api', data));
      // console.log(response);
      // return response;
      return null;
    } catch(e) {
      throw(e);
    }
  }

  async resetPassword(data) {
    try {
      // const response = await this.http.lastValueFrom(this.http.patch('your_api', data));
      // console.log(response);
      // return response;
      return null;
    } catch(e) {
      throw(e);
    }
  }

  async logout() {
    try {
      await this.storage.removeStorage(Strings.UID);
      this._uid.next(AuthService.UNKNOWN_USER);
      return true;
    } catch(e) {
      throw(e);
    }
  }
  public delete(input : any){
    return this.http.post(environment.adminURL + 'users/delete', input)
      .pipe(
        map(
          async (response:any) => {
            if (response) {
              await this.storage.removeStorage(Strings.UID);
              this._uid.next(AuthService.UNKNOWN_USER);
              return response;
            }
          },
          (error: any) => {
            return error;
          }
        )
      )
  }
  async updateEmail(oldEmail, newEmail, password) {
    try {
      // update email, password required for verification if login via email
      return;
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async introGuard() {
    const hasSeenIntro = await this.storage.getStorage(Strings.INTRO_KEY);
    if(hasSeenIntro && hasSeenIntro.value == 'true') {
      return true;
    } else {
      this.global.navigateByUrl(Strings.WELCOME);
      return false;
    }
  }

  async autoLoginGuard() {
    try {
      // const user: any = await this.getUserData();
      // if(user?.uid) {
      //   this.global.navigateByUrl(Strings.TABS);
      //   return false;
      // }
      const uid = await this.getId();
      if(uid) {
        this.global.navigateByUrl(Strings.TABS);
        return false;
      }
      return true;  
    } catch(e) {
      throw(e);
    }
  }

  async authGuard() {
    try {
      // const user: any = await this.getUserData();
      // console.log('authguard user: ', user);
      // if(user && user?.uid) {
      //   this.setUserData(user.uid);
      //   return true;
      // }
      const uid = await this.getId();
      if(uid) {
        this.setUserData(uid);
        return true;
      }
      this.global.navigateByUrl(Strings.LOGIN);
      return false;  
    } catch(e) {
      throw(e);
    }
  }

  async getUserData() {
    const data = await this.storage.getStorage(Strings.UID);
    return { uid: data?.value };
  }
}
