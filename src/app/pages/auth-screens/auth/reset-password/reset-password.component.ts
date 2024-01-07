import { FormsModule, NgForm } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { OtpInputComponent } from '../otp-input/otp-input.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, OtpInputComponent]
})
export class ResetPasswordComponent implements OnInit {

  @Input() model;
  length: number;
  @Output() check_email: EventEmitter<any> = new EventEmitter();
  @Output() verify_otp: EventEmitter<any> = new EventEmitter();
  @Output() set_password: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log(this.model);
  }
  
  getOtpLength(length) {
    this.length = length;
  }

  onOtpChange(otp) {
    this.model.otp = otp;
    console.log(this.model.otp);
  }

  onSubmit(form: NgForm) {
    console.log(form);
    if(!form.valid) return;
    if(this.model.flag == 1) this.check_email.emit(form.value.email);
    else if(this.model.flag == 2) this.verify_otp.emit(this.model.otp);
    else this.set_password.emit(form.value.new_password);
  }

}
