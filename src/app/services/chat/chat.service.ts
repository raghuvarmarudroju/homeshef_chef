import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ApiService } from '../api/api.service';
import { Strings } from 'src/app/enum/strings.enum';
import { Chat } from 'src/app/interfaces/chat.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  uid: string;
  private changeOrder: BehaviorSubject<string | null> = new BehaviorSubject(null);
  private messages$ = new BehaviorSubject<Chat[]>([]);

  get messages() {
    return this.messages$.asObservable();
  }

  constructor(
    private auth: AuthService,
    private api: ApiService
  ) {}

  async getUid() {
    if(!this.uid) {
      this.uid = await this.auth.getId();
    }
    return this.uid;
  }

  async getChats(orderId) {
    try {
      await this.api.delayedResponse(1000); //remove when working with real apis
      this.changeOrder.next(orderId);
      const chats = this.api.allChats.filter((chat) => chat.orderId == orderId);
      console.log(chats);
      this.messages$.next(chats); // converting into observable using "of()" 
    } catch(e) {
      throw(e);
    }
  }

  public sendMessage(message): void {
    this.getUid();
    const orderId = this.changeOrder.value;
    console.log(orderId);
    const new_message: Chat = {
      id: '1',
      message,
      senderType: Strings.TYPE,
      senderId: this.uid,
      timestamp: new Date().toISOString(),
      orderId: orderId
    };
    let chats = this.messages$.value;
    chats.push(new_message);
    this.messages$.next(chats);
    // save new message for a particular order in the server
  }

}