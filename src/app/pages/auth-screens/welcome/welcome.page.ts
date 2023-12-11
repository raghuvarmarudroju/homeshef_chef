import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicSlides } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage/storage.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Strings } from 'src/app/enum/strings.enum';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WelcomePage implements OnInit {

  swiperModules = [IonicSlides];

  constructor(
    private storage: StorageService,
    private global: GlobalService
  ) { }

  ngOnInit() {}

  async goToLogin() {
    await this.storage.setStorage(Strings.INTRO_KEY, 'true');
    this.global.navigateByUrl(Strings.LOGIN);
  }

}