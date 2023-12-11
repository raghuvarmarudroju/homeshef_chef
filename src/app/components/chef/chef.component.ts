import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Chef } from 'src/app/interfaces/chef.interface';

@Component({
  selector: 'app-chef',
  templateUrl: './chef.component.html',
  styleUrls: ['./chef.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ChefComponent implements OnInit {

  @Input() chef: Chef;

  constructor() { }

  ngOnInit() {}

  getCuisine(cuisine) {
    return cuisine.join(', ');
  }

}
