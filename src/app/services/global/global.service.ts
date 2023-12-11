import { Injectable } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { isPlatform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CallNumber } from 'capacitor-call-number';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  isLoading: boolean = false;

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) { }

  setLoader() {
    this.isLoading = !this.isLoading;
  }

  showAlert(message: string, header?, buttonArray?, inputs?) {
    this.alertCtrl.create({
      header: header ? header : 'Authentication failed',
      message: message,
      inputs: inputs ? inputs : [],
      buttons: buttonArray ? buttonArray : ['Okay']
    })
    .then(alertEl => alertEl.present());
  }

  checkErrorMessageForAlert(error, msg?) {
    if(error?.error?.message) {
      msg = error.error.message;
    }
    console.log('error message alert: ', msg);
    this.showAlert(msg);
  }

  async showActionSheet(buttonArray, header?) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: header ? header : 'Options',
      buttons: buttonArray
    });
    await actionSheet.present();
    // const { role } = await actionSheet.onDidDismiss();
    // console.log('onDidDismiss resolved with role', role);
  }

  async showToast(msg, color, position, duration = 3000) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: duration,
      color: color,
      position: position
    });
    toast.present();
  }

  errorToast(msg?, duration = 4000) {
    this.showToast(msg ? msg : 'No Internet Connection', 'danger', 'bottom', duration);
  }

  checkMessageForErrorToast(error, msg?) {
    if(error?.error?.message) {
      msg = error.error.message;
    }
    this.errorToast(msg);
  }

  successToast(msg) {
    this.showToast(msg, 'success', 'bottom');
  }

  showLoader(msg?, spinner?) {
    // this.isLoading = true;
    if(!this.isLoading) this.setLoader();
    return this.loadingCtrl.create({
      message: msg,
      spinner: spinner ? spinner : 'bubbles'
    }).then(res => {
      res.present().then(() => {
        if(!this.isLoading) {
          res.dismiss().then(() => {
            console.log('abort presenting');
          });
        }
      })
    })
    .catch(e => {
      console.log('show loading error: ', e);
    });
  }

  hideLoader() {
    // this.isLoading = false;
    if(this.isLoading) this.setLoader();
    return this.loadingCtrl.dismiss()
    .then(() => console.log('dismissed'))
    .catch(e => console.log('error hide loader: ', e));
  }

  async createModal(options) {
    const modal = await this.modalCtrl.create(options);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);
    if(data) return data;
  }

  modalDismiss(val?) {
    let data: any = val ? val : null;
    console.log('data', data);
    this.modalCtrl.dismiss(data);
  }

  getIcon(title) {
    const name = title.toLowerCase();
    switch(name) {
      case 'home': return 'home-outline';
      case 'work': return 'briefcase-outline';
      default: return 'location-outline';
    }
  }

  async customStatusbar(primaryColor?: boolean) {
    if(Capacitor.getPlatform() != 'web') {
      await StatusBar.setStyle({ style: primaryColor ? Style.Dark : Style.Light });
      if(isPlatform('android')) StatusBar.setBackgroundColor({color : primaryColor ? '#de0f17' : '#ffffff'});
    }
  }

  async takePicture() {
    // take picture
    const image = await Camera.getPhoto({
      quality: 90, // can increase quality to 100 - result in bigger file size
      // allowEditing: false,
      source: CameraSource.Prompt,
      width: 600,
      resultType: CameraResultType.Base64,
      // saveToGallery: false
    });
    console.log(image);
    return image;
    // let pic = 'data:image/png;base64,' + image.base64String;
    // return pic;
  }

  getBlob(b64Data) {
    let contentType = '';
    let sliceSize = 512;

    b64Data = b64Data.replace(/data\:image\/(jpeg|jpg|png)\;base64\,/gi, '');

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  checkPlatform(platform = 'web') {
    if(Capacitor.getPlatform() == platform) return true;
    return false;
  }

  async call(number) {
    return CallNumber.call({ 
      number, 
      bypassAppChooser: this.checkPlatform('ios') ? true : false
    });
  }

  navigateByUrl(url, replaceUrl = true) {    
    if(replaceUrl == false) this.router.navigateByUrl(url);
    else this.router.navigateByUrl(url, {replaceUrl: replaceUrl});
  }

  navigate(url: any) {
    this.router.navigate(url);
  }

  isIos() {
    if(Capacitor.getPlatform() == 'ios') return true;
    return false;
  }
  
}
