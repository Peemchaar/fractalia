import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { User } from '../models/user';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  user: User;

  constructor(
    private localService: LocalService) { }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }

  add(message: string, state: string) {
    this.user = this.getLocalStorage('currentUser');

    if (this.user==null){
      this.user = new User();
      this.user.roleId = 1;
    }

    let messageObj = new Message();
    messageObj.state = state;
    messageObj.text = message;
    if (this.user.roleId === 4){ // If is admin
      if(messageObj.state === "ok" || messageObj.state === "info"){
          messageObj.timeLeft = 3
      }
      else{
        messageObj.timeLeft = 10
      }
    }
    else{ // Other users
      messageObj.timeLeft = 5
    }
    this.messages.push(messageObj);
  }

  clear() {
    this.messages.splice(0, 1);
  }
}
