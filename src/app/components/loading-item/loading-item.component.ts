import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-loading-item',
  templateUrl: './loading-item.component.html',
  styleUrls: ['./loading-item.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class LoadingItemComponent implements OnInit {

  dummy = Array(10);

  constructor() { }

  ngOnInit() {}

}
