import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-loading-chef',
  templateUrl: './loading-chef.component.html',
  styleUrls: ['./loading-chef.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class LoadingChefComponent implements OnInit {
  
  dummy = Array(10);

  constructor() { }

  ngOnInit() {}

}
