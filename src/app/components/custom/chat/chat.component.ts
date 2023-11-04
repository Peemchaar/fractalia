import { Component, ViewEncapsulation } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { ChatData } from 'src/app/models/chatData';
import { PartnerService } from 'src/app/services/partner.service';
import { ChatDataService } from 'src/app/services/chat-data.service';
import { Router } from '@angular/router';
import { TruncateService } from 'src/app/services/truncate.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent {
  
  messages: string[];
  data: ChatData;
  consultas = [];
 public questionIndex = -1;

  constructor(
    public chatService: ChatService, 
    public userService: UserService, 
    public partnerService: PartnerService,
    public chatDataService: ChatDataService,
    public truncateService: TruncateService,
    private router: Router,
    private localService: LocalService) { 
    if(chatService.serviceName)
    {        
      if(this.getLocalStorage('currentService') == null){
        this.router.navigate(['/']);
        return;
      }
      else{ // If refresh
        let suiteColor = localStorage.getItem('suiteColor');
        let suiteGradColor = localStorage.getItem('suiteGradColor');          
        let partnerSuiteId = localStorage.getItem('partnerSuiteId');
        let service = this.getLocalStorage('currentService');
        userService.selSuiteColor = suiteColor;
        userService.selSuiteGradColor = suiteGradColor;
        chatService.serviceId = service.id;          
        chatService.serviceName = service.name;
        chatService.serviceIcon = service.icon;          
        chatService.serviceDesc= service.desc;
        chatService.longDesc= service.longDesc;   
        chatService.partnerSuiteId = partnerSuiteId;
      }
    }
    else 
    {
      let suiteColor = localStorage.getItem('suiteColor');
      let suiteGradColor = localStorage.getItem('suiteGradColor');          
      let partnerSuiteId = localStorage.getItem('partnerSuiteId');
      let service = this.getLocalStorage('currentService');
      userService.selSuiteColor = suiteColor;
      userService.selSuiteGradColor = suiteGradColor;
      chatService.serviceId = service.id;          
      chatService.serviceName = service.name;
      chatService.serviceIcon = service.icon;          
      chatService.serviceDesc= service.desc;
      chatService.longDesc= service.longDesc;   
      chatService.partnerSuiteId = partnerSuiteId;
    }
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }
}
