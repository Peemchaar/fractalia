import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { LocalService } from 'src/app/services/local.service';
import { CookieService } from 'ngx-cookie-service';
import { ChatFormComponent } from '../../common/chat-form/chat-form.component';

@Component({
  selector: 'app-chatmodal',
  templateUrl: './chatmodal.component.html',
  styleUrls: ['./chatmodal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatmodalComponent implements OnInit {

  @Input() name: string;
  @Input() icon: string;
  allCookieData: any;

  constructor(
    public activeModal: NgbActiveModal,
    public chatService: ChatService,
    public userService: UserService,
    private router: Router,
    private localService: LocalService,
    private Cookies: CookieService) {
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

  ngOnInit(): void {
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }

  close(): void {
    this.allCookieData = this.Cookies.getAll();
    ChatFormComponent.deleteCookies().then(result => {
      
      setInterval(() => {
        this.activeModal.dismiss('Cross click');
      }, 200);
    });
    
  }

}
