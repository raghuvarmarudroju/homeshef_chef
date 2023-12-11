import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Banner } from 'src/app/interfaces/banner.interface';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(
    private api: ApiService
  ) { }  

  async getBanners() {
    try {
      await this.api.delayedResponse(1000); //remove when working with real apis
      const banners: Banner[] = this.api.banners;
      return banners;
    } catch(e) {
      throw(e);
    }
  }
}
