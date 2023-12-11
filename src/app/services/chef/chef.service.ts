import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Chef } from 'src/app/interfaces/chef.interface';

@Injectable({
  providedIn: 'root'
})
export class ChefService {

  constructor(private api: ApiService) { } 

  async getChefs() {
    try {
      await this.api.delayedResponse(1000); //remove when working with real apis
      const chefs: Chef[] = this.api.allChefs;
      return chefs;
    } catch(e) {
      throw(e);
    }
  }

  async getChefById(id) {
    try {
      await this.api.delayedResponse(1000); //remove when working with real apis
      const chef = this.api.allChefs.find((chef) => chef.id == id);
      return chef;
    } catch(e) {
      throw(e);
    }
  }

  async getNearbyChefs(lat, lng): Promise<any> {
    try {
      await this.api.delayedResponse(1000); //remove when working with real apis
      // const chefs: Chef[] = this.api.allChefs; // get all chefs
      const chefs: Chef[] = this.api.allChefs.filter(chef => {
        const distance = this.calculateDistance(
          lat,
          lng,
          chef?.latitude,
          chef?.longitude
        );
        if(distance <= this.api.radius) {
          console.log('distance: ', distance);
          chef.distance = distance;
          return true;
        }
        return false;
      })
      .sort((a, b) => a.distance - b.distance);
      return chefs;
    } catch(e) {
      throw(e);
    }
  }

  searchNearbyChefs(query: string, lat: number, lng: number) {

    // search chef by Chef name or menu name
    this.api.delayedResponse(1000); //remove when working with real apis
    return this.api.allChefs.filter((chef: any) => {
      // const short_name = chef.name.toLowerCase();
      // return short_name.includes(this.query);

      const searchQuery = query;

      const distance = this.calculateDistance(
        lat,
        lng,
        chef?.latitude,
        chef?.longitude
      );
      if(distance > this.api.radius) {
        return false;
      }

      chef.distance = distance;

      const shortName = chef.name.toLowerCase();
      
      // Check if the chef name includes the search query
      if (shortName.includes(searchQuery)) {
        return true;
      }

      const menu = this.api.allItems.filter((item) => item.chef_id == chef.id);

      // Check if the chef has any category that includes the search query
      const itemsMatch = menu.some((item: any) =>
        item.name.toLowerCase().includes(searchQuery)
      );
      if (itemsMatch) {
        return true;
      }

      // // Check if the chef has any category that includes the search query
      // const categoriesMatch = chef.categories.some((category: any) =>
      //   category.name.toLowerCase().includes(searchQuery)
      // );
      // if (categoriesMatch) {
      //   return true;
      // }

      // // Check if any cuisine of the chef includes the search query
      // const cuisinesMatch = chef.cuisines.some((cuisine: string) =>
      //   cuisine.toLowerCase().includes(searchQuery)
      // );
      // if (cuisinesMatch) {
      //   return true;
      // }

      // If no match found, exclude the chef from the filtered list
      return false;

    })
    .sort((a, b) => a.distance - b.distance);
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.degToRad(lat2 - lat1);
    const dLon = this.degToRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  degToRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

}
