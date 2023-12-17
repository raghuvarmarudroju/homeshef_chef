import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Item } from 'src/app/interfaces/item.interface';
import { HttpService } from '../http/http.service';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    "basic": environment.basic
  }),
  //params:null
};

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private api: ApiService,
    public https:HttpClient,
    private http: HttpService
  ) { }

  async getChefMenu(input) {
    try {
      //await this.api.delayedResponse(1000); //remove when working with real apis
      //return this.http.post(environment.adminURL + 'products', input)
      const items: any = this.http.post(environment.adminURL + 'products', input);
      console.log(items);
      return items;
    } catch(e) {
      throw(e);
    }
  }
  public convertImgToBase64(url:string, callback:any){
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }
  public getCategories(): Observable<any[]>{
    return this.http.get('food_types',httpOptions);
  }
  public getFoodTypes(): Observable<any> {
    return this.http.get('food_types');
  }
  public getShefs(): Observable<any> {
    return this.http.get('chefs');
  }
  public getFoodTags(): Observable<any> {
    return this.http.get('food_tags');
  }
  public getIngredients(): Observable<any>{
    return this.http.get('ingredients',httpOptions);
  }
  public getUnits(): Observable<any> {
    return this.http.get('size_units');
  }
  public saveChefItem(input: any) {
    return this.https.post(environment.adminURL+'product/add', input)
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
  public getMenuItemById(id:number): Observable<any>{
    return this.http.get(environment.serverBaseUrl + 'menu-item-' + id + '.json');
  }
}
