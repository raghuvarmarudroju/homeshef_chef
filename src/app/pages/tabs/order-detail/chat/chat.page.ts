import { ChatService } from 'src/app/services/chat/chat.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonicModule, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Chat } from 'src/app/interfaces/chat.interface';
import { GlobalService } from 'src/app/services/global/global.service';
import { CommonModule } from '@angular/common';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { EmptyScreenComponent } from 'src/app/components/empty-screen/empty-screen.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ChatBoxComponent, EmptyScreenComponent]
})
export class ChatPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;
  urlCheck: any;
  url: any;
  message: string;
  model = {
    icon: 'chatbubbles-outline',
    title: 'No inbox message'
  };
  chats: Observable<Chat[]>;
  order_id: any;
  isLoading: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private chatService: ChatService,
    private global: GlobalService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('check id: ', id);
    if(!id) {
      this.navCtrl.back();
      return;
    }
    this.order_id = id;
    console.log('id: ', this.order_id);
    this.getChats();
  }

  async getChats() {
    try {
      this.global.showLoader();
      await this.chatService.getChats(this.order_id);
      this.chats = this.chatService.messages;
      this.scrollToBottom();
      this.global.hideLoader();
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      this.global.checkMessageForErrorToast(e);
    }
  }

  checkUrl() {
    let url: any = (this.router.url).split('/');
    const spliced = url.splice(url.length - 2, 2); // /tabs/cart url.length - 1 - 1
    this.urlCheck = spliced[0];
    url.push(this.urlCheck);
    this.url = url;
  }

  getPreviousUrl() {
    this.checkUrl();
    return this.url.join('/');
  }

  async sendMessage() {
    try {
      this.isLoading = true;
      this.chatService.sendMessage(this.message);
      this.message = '';
      this.isLoading = false;
      this.scrollToBottom();
    } catch(e) {
      this.isLoading = false;
      console.log(e);
      this.global.errorToast();
    }
  }

  scrollToBottom() {
    console.log('scroll bottom');
    if(this.chats) this.content.scrollToBottom(500);
  }

  scrollToTop() {
    this.content.scrollToTop(1500);
  }

  // ScrollToPoint(X, Y) {
  //   this.content.scrollToPoint(X, Y, 1500);
  // }

}
