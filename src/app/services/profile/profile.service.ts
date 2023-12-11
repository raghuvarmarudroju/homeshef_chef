import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  uid: string;
  private _profile = new BehaviorSubject<any>(null);

  get profile() {
    return this._profile.asObservable();
  }

  constructor(
    private authService: AuthService, 
    private apiService: ApiService,
    private http: HttpService
  ) { }

  async getUid() {
    if(!this.uid) {
      this.uid = await this.authService.getId();
    }
    return this.uid;
  }
  public userById(input : any){

    return this.http.post('users/getById', input)
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
  async getProfile() {
    try {
      //await this.apiService.delayedResponse(500); //remove when working with real apis
      await this.getUid();
      let data = null;
      if(this.uid) {
        this.authService.userById(this.uid).subscribe((userData: any) => { 
          console.log(userData);
          this._profile.next(userData.data); 
          // let profile: User = userData.data;
          // console.log('profile: ', profile);
          // console.log(profile);
          // this._profile.next(profile); 
        });
        
      }
      
      return data;
    } catch(e) {
      throw(e);
    }
  }

  async updateProfile(profile, param) {
    await this.getUid();
    param.id = this.uid;
    this.authService.update(param).subscribe((userData: any) => { 
      this._profile.next(userData.data); 
    });
  }

  async updateProfilePic(pic) {
    try {
      await this.getUid();
      // let postData = new FormData(); // for formdata
      // postData.append('profileImages', imageFile, imageFile.name || 'profile.jpg');
      // const imageFile = new File([blob], 'profile.png', { type: 'image/png' });
      if(this.uid) {
        let data: User = this._profile.value;
        data = { ...data, photo: pic };
        this._profile.next(data);
        return data;
      }
      return null;
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async updateProfileWithEmail(profile, param, password) {
    try {
      await this.authService.updateEmail(profile.email, param.email, password);
      await this.updateProfile(profile, param);
      return profile;
    } catch(e) {
      throw(e);
    }
  }

  reset() {
    this.uid = null;
    this._profile.next(null);
  }

}
