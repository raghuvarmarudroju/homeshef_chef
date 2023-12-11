import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class CuisineService {

  uid: string;
  private _cuisines = new BehaviorSubject<any[]>([]);
  private _cuisineChange = new BehaviorSubject<any>(null);

  private _chefCuisines = new BehaviorSubject<any[]>([]);
  private _chefCuisineChange = new BehaviorSubject<any>(null);


  get cuisines() {
    return this._cuisines.asObservable();
  }
  get cuisineChange() {
    return this._cuisineChange.asObservable();
  }
  get chefCuisines() {
    return this._chefCuisines.asObservable();
  }
  get chefCuisineChange() {
    return this._chefCuisineChange.asObservable();
  }
  constructor(
    private auth: AuthService, 
    private httpService: HttpService,
    private api: ApiService
  ) { }
  
  async getUid() {
    if(!this.uid) {
      this.uid = await this.auth.getId();
    }
    return this.uid;
  }
  async getChefCuisines() {
    try {
      //await this.apiService.delayedResponse(500); //remove when working with real apis
      await this.getUid();
      let data = null;
      if(this.uid) {
        this.httpService.get('chef/cuisines/'+this.uid).subscribe((cuisineData:any)=>{
          console.log(cuisineData);
          let cuisines: any = cuisineData.data.results;
          console.log('cuisines: ', cuisines);
          console.log(cuisines);
          this._chefCuisines.next(cuisines);
        })   
      }
      
      return data;
    } catch(e) {
      throw(e);
    }
  }
  async getCuisines() {
    try {
      //await this.apiService.delayedResponse(500); //remove when working with real apis
      await this.getUid();
      let data = null;
      this.httpService.get('cuisines').subscribe((cuisineData:any)=>{
        console.log(cuisineData);
        let cuisines: any = cuisineData.data.cuisines;
        cuisines.forEach(element => {
          element.selected = false;
        });
        this._cuisines.next(cuisines);
      }) 
      return data;
    } catch(e) {
      throw(e);
    }
  }
  
  // async updatecuisine(id, param, user_id?) {
  //   try {
  //     let currentcuisines = this._cuisines.value;
  //     const index = currentcuisines.findIndex(x => x.id == id);
  //     const data = new cuisine(
  //       id,
  //       param.title,
  //       param.cuisine,
  //       param.landmark,
  //       param.house,
  //       param.lat,
  //       param.lng,
  //       user_id,
  //     );
  //     currentcuisines[index] = data;
  //     this._cuisines.next(currentcuisines);
  //     console.log('check data: ', data);
  //     this._cuisineChange.next(data);
  //     return data;
  //   } catch(e) {
  //     throw(e);
  //   }
  // }

  reset() {
    console.log('reset cuisine');
    this.uid = null;
    this._cuisines.next([]);
    // this._cuisineChange.next(null);
  }
 
}
