import { Component, Input, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ChatDataService } from 'src/app/services/chat-data.service';
import { PartnerService } from 'src/app/services/partner.service';
import { LocalService } from 'src/app/services/local.service';

declare function startChat(): any;
@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatFormComponent {

  public static async deleteCookies() {
    startChat();
    return true;
  }

  @Input() name: string = '';
  active: boolean = false;
  isShown: boolean = true ; // hidden by default
  constructor(public userService: UserService,
    public chatDataService: ChatDataService,
    public partnerService: PartnerService,
    private localService: LocalService) {

    }
    async ngOnInit(){
      let service = this.getLocalStorage('currentService');
      await this.chatDataService.loadChat(Number(service.id), this.name);
    }

    myLoadEvent(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    getLocalStorage(key) {
      return this.localService.getJsonValue(key);
    }
}
