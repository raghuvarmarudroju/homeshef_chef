import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.page.html',
  styleUrls: ['./terms-conditions.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TermsConditionsPage implements OnInit {
  @Input() terms;
  constructor(private global: GlobalService) { }

  ngOnInit() {
  }
  agreeTerms(){
    this.global.modalDismiss(true);
  }
}
