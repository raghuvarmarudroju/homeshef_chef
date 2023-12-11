import { Injectable } from '@angular/core';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Capacitor } from '@capacitor/core';
import { Geolocation, PositionOptions } from '@capacitor/geolocation';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private locationAccuracy: LocationAccuracy) { }

  async getCurrentLocation(openSettings?: boolean) {
    try {
      if(!Capacitor.isPluginAvailable('Geolocation')) {
        return null;
      }
      const permissionStatus = await Geolocation.checkPermissions();
      console.log('Permission status: ', permissionStatus.location);
      if(permissionStatus?.location != 'granted') {
        const requestStatus = await Geolocation.requestPermissions();
        if(requestStatus.location != 'granted') {
          if(openSettings) await this.openSettings(true);
          return null;
        }
      }
      if(Capacitor.getPlatform() == 'android') {
        this.enableGps();
      }
      let options: PositionOptions = {
        maximumAge: 3000,
        timeout: 10000,
        enableHighAccuracy: false
      };
      return await Geolocation.getCurrentPosition(options);
    } catch(e) {
      console.log('error: ', e.message);
      if(openSettings && e?.message == 'Location services are not enabled') {
        await this.openSettings();
      }
      throw(e);
    }
  }

  async enableGps() {
    const canRequest = await this.locationAccuracy.canRequest();
    if(canRequest) {
      await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
    }
  }

  openSettings(app = false) {
    console.log('open settings...');
    return NativeSettings.open({
      optionAndroid: app ? AndroidSettings.ApplicationDetails : AndroidSettings.Location, 
      optionIOS: app ? IOSSettings.App : IOSSettings.LocationServices
    });
  }

}
