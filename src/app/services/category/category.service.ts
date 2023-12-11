import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Category } from 'src/app/interfaces/category.interface';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private api: ApiService,
    private http: HttpService
  ) { }

  // categories
  async getCategories(){
    try {
      let categories : any = this.http.get('food_types');
      console.log(categories);
      return categories;
    } catch(e) {
      throw(e);
    }
  }
  async getchefCategories(uid) {
    try {
      const categories: Category[] = this.api.allCategories.filter((category) => category.chef_id == uid);
      return categories;
    } catch(e) {
      throw(e);
    }
  }
  async getOrderCategories() {
    try {
      const categories: any[] = this.api.allOrderCategories;
      return categories;
    } catch(e) {
      throw(e);
    }
  }
}
