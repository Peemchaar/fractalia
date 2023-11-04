import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpertsConnection } from 'src/app/models/expertsConnection';
import { FormService } from 'src/app/services/form.service';
import { MessageService } from 'src/app/services/message.service';
import { PartnerService } from 'src/app/services/partner.service';
import { TruncateService } from 'src/app/services/truncate.service';
import { UserService } from 'src/app/services/user.service';
import { UserValidator } from 'src/app/validators/user.validator';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-expert-connection',
  templateUrl: './expert-connection.component.html',
  styleUrls: ['./expert-connection.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ExpertConnectionComponent {
  public data: ExpertsConnection = new ExpertsConnection;
  postError = false;
  submitted = false;
  loading = false;
  public message: string = "";
  public showMessage: boolean = false;

  constructor(public partnerService: PartnerService,
    public userService: UserService,
    public formService: FormService,
    private messageService: MessageService,
    private router: Router,
    public truncateService: TruncateService,
    private translate: TranslateService,
    public activeModal: NgbActiveModal,
    private localService: LocalService) {
    if (formService.serviceName) {
      if (this.getLocalStorage('currentService') == null) {
        this.router.navigate(['/']);
        return;
      }
      else { // If refresh
        let service = this.getLocalStorage('currentService');
        let suiteColor = localStorage.getItem('suiteColor');
        let suiteGradColor = localStorage.getItem('suiteGradColor');
        userService.selSuiteColor = suiteColor;
        userService.selSuiteGradColor = suiteGradColor;
        formService.serviceId = service.id;
        formService.serviceName = service.name;
        formService.serviceIcon = service.icon;
        formService.serviceDesc = service.desc;
        formService.longDesc = service.longDesc;
      }
    }
    else {
      let service = this.getLocalStorage('currentService');
      let suiteColor = localStorage.getItem('suiteColor');
      let suiteGradColor = localStorage.getItem('suiteGradColor');
      userService.selSuiteColor = suiteColor;
      userService.selSuiteGradColor = suiteGradColor;
      formService.serviceId = service.id;
      formService.serviceName = service.name;
      formService.serviceIcon = service.icon;
      formService.serviceDesc = service.desc;
      formService.longDesc = service.longDesc;
    }
  }

  change = () => {
    this.loading = !this.loading;
  }
  onSubmit() {
    this.showMessage = false;
    if (this.data.phone != null && this.data.phone.length > 0) {
      if (UserValidator.validPhone(this.data.phone) == null) {
        this.message = this.translate.instant('MULTIUSER.VALIDATION11'); this.showMessage = true; this.loading = false; return;
      }
    }
    if (UserValidator.validEmail(this.data.email) == null) {
      this.message = this.translate.instant('MULTIUSER.VALIDATION4'); this.showMessage = true; this.loading = false; return;
    }
    this.postError = false;
    this.submitted = true;
    this.change();
    this.translate.get('FORM_ENVIANDO').subscribe(res => this.messageService.add(res, "ok"));
    this.formService.postExpertsConnection(this.data).then(result => {
      this.change();
      this.translate.get('FORM_ENVIADO').subscribe(res => this.messageService.add(res, "ok"));
      this.activeModal.dismiss('Cross click');
    }, error => {
      this.translate.get('ERROR_ENVIO_FORM').subscribe(res => {
        this.messageService.add(res, "error"); this.postError = true;
        this.change();
      });
    });
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }
}
