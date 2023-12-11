import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
import { Address } from 'src/app/models/address.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  uid: string;
  private _addresses = new BehaviorSubject<Address[]>([]);
  private _addressChange = new BehaviorSubject<Address>(null);


  get addresses() {
    return this._addresses.asObservable();
  }
  get addressChange() {
    return this._addressChange.asObservable();
  }

  constructor(
    private auth: AuthService, 
    private api: ApiService
  ) { }
  
  async getUid() {
    if(!this.uid) {
      this.uid = await this.auth.getId();
    }
    return this.uid;
  }

  async getAddresses(limits?: number) {
    try {
      await this.api.delayedResponse(1000); //remove when working with real apis
      await this.getUid();
      let addresses: Address[] = this.api.allAddresses.filter((address) => address.user_id == this.uid);
      if(limits) {
        addresses = addresses.slice(0, limits);
      }
      this._addresses.next(addresses);
      return addresses;
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async addAddress(param) {
    try {            
      await this.getUid();
      if(this.uid) {
        const currentAddresses = this._addresses.value;
        const address = new Address(
          '1',
          param.title,
          param.address,
          param.landmark,
          param.house,
          param.lat,
          param.lng,
          this.uid
        );
        currentAddresses.push(address);
        this._addresses.next(currentAddresses);
        this._addressChange.next(address);
        return address;
      }
      return null;
    } catch(e) {
      throw(e);
    }
  }

  async updateAddress(id, param, user_id?) {
    try {
      let currentAddresses = this._addresses.value;
      const index = currentAddresses.findIndex(x => x.id == id);
      const data = new Address(
        id,
        param.title,
        param.address,
        param.landmark,
        param.house,
        param.lat,
        param.lng,
        user_id,
      );
      currentAddresses[index] = data;
      this._addresses.next(currentAddresses);
      console.log('check data: ', data);
      this._addressChange.next(data);
      return data;
    } catch(e) {
      throw(e);
    }
  }

  async deleteAddress(param) {
    try {
      let currentAddresses = this._addresses.value;
      currentAddresses = currentAddresses.filter(x => x.id != param.id);
      this._addresses.next(currentAddresses);
      return currentAddresses;
    } catch(e) {
      throw(e);
    }
  }

  changeAddress(address) {
    this._addressChange.next(address);
  }

  async checkExistAddress(location) {
    try { 
      console.log('check exist address: ', location);     
      let loc: Address = location;
      await this.getUid();
      console.log('uid address service: ', this.uid);
      if(this.uid) {
        const address: Address = this.api.allAddresses.find((address) => address.user_id == this.uid && address.lat == location.lat && address.lng == location.lng);
        if(address) loc = address;
      }
      if(!this.uid && (loc?.user_id || loc?.id)) {
        loc = null;
      }
      console.log('location value: ', loc);
      this.changeAddress(loc);
      return loc;
    } catch(e) {
      throw(e);
    }
  }

  reset() {
    console.log('reset address');
    this.uid = null;
    this._addresses.next([]);
    // this._addressChange.next(null);
  }
 
}
