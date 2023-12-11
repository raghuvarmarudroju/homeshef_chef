import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Chef } from 'src/app/interfaces/chef.interface';

@Component({
  selector: 'app-chef-detail',
  templateUrl: './chef-detail.component.html',
  styleUrls: ['./chef-detail.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ChefDetailComponent implements OnInit {

  @Input() data: Chef;
  @Input() isLoading;

  constructor() { }

  ngOnInit() {}

  getCuisine(cuisine) {
    return cuisine.join(', ');
  }

}
