import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FormService } from 'src/app/services/form.service';
import { MessageService } from 'src/app/services/message.service';
import { PartnerService } from 'src/app/services/partner.service';
import { TruncateService } from 'src/app/services/truncate.service';
import { UserService } from 'src/app/services/user.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-emailsimulatorform',
  templateUrl: './emailsimulatorform.component.html',
  styleUrls: ['./emailsimulatorform.component.scss']
})
export class EmailsimulatorformComponent implements OnInit {
  // public data: EmailSimulator = new EmailSimulator;
  postError = false;
  submitted = false;
  loading = false;
  public status = 1;
  public showMessage: boolean = false;
  public message: string = "";

  constructor(public partnerService: PartnerService,
    public formService: FormService,
    public userService: UserService,
    private messageService: MessageService,
    private router: Router,
    public truncateService: TruncateService,
    private translate: TranslateService,
    public activeModal: NgbActiveModal,
    private localService: LocalService) { 
      if(formService.serviceId)
      {
        if(this.getLocalStorage('currentService') == null){
          this.router.navigate(['/']);
          return;
        }
        else{ // If refresh
          let service = this.getLocalStorage('currentService');
          let suiteColor = localStorage.getItem('suiteColor');
          let suiteGradColor = localStorage.getItem('suiteGradColor');
          userService.selSuiteColor = suiteColor;
          userService.selSuiteGradColor = suiteGradColor;
          formService.serviceId = service.id;
          formService.serviceName = service.name;
          formService.serviceIcon = service.icon;
          formService.serviceDesc = service.desc;
          formService.longDesc= service.longDesc;
        }
      }
      else
      {
        let service = this.getLocalStorage('currentService');
        let suiteColor = localStorage.getItem('suiteColor');
        let suiteGradColor = localStorage.getItem('suiteGradColor');
        userService.selSuiteColor = suiteColor;
        userService.selSuiteGradColor = suiteGradColor;
        formService.serviceId = service.id;
        formService.serviceName = service.name;
        formService.serviceIcon = service.icon;
        formService.serviceDesc = service.desc;
        formService.longDesc= service.longDesc;
      }

      //Recuperar Estadisticas. Si no tiene no hay usuario. Si tiene mostrar aunque sean vacias

    }

  ngOnInit(): void {
  }

  change = () =>{
    this.loading = !this.loading;
  }
  onSubmit()
  {
    this.showMessage = false;      
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }
  
}
