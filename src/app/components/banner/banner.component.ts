import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicSlides } from '@ionic/angular';
import { Banner } from 'src/app/interfaces/banner.interface';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BannerComponent implements OnInit {

  swiperModules = [IonicSlides];
  @Input() bannerImages: Banner[];

  constructor(private router: Router) { }

  ngOnInit() {}

  goToChef(data) {
    console.log(data);
    if(data?.chef_id) {
      this.router.navigate(['/', 'tabs', 'chefs', data.chef_id]);
    }
  }

}
