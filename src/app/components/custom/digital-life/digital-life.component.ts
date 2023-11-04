import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { PartnerService } from 'src/app/services/partner.service';
import { FormService } from 'src/app/services/form.service';
import { DigitalLife } from 'src/app/models/digitalLife';
import { MessageService } from 'src/app/services/message.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TruncateService } from 'src/app/services/truncate.service';
import { UserValidator } from 'src/app/validators/user.validator';
import { LocalService } from 'src/app/services/local.service';


@Component({
  selector: 'app-digital-life',
  templateUrl: './digital-life.component.html',
  styleUrls: ['./digital-life.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DigitalLifeComponent implements AfterViewInit{

  public data: DigitalLife = new DigitalLife;
  postError = false;
  submitted = false;
  loading = false;
  dniName: string;
  optName: string;
  public showMessage: boolean = false;
  public message: string = "";

  constructor(public partnerService: PartnerService,
    public userService: UserService,
    public formService: FormService,
    private messageService: MessageService,
    private router: Router,
    public truncateService: TruncateService,
    private http: HttpClient,
    private translate: TranslateService,
    public activeModal: NgbActiveModal,
    private localService: LocalService) {
    if (formService.serviceName) {

      if (this.getLocalStorage('currentService') == null) {
       // this.router.navigate(['/']);
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

    translate.get('SELECCIONE_ARCHIVO').subscribe(res => { this.dniName = res; this.optName = res });

  }

  ngAfterViewInit(): void {
    var file1 = document.getElementById('dniLabel')
    var file2 = document.getElementById('optLabel')
    var txtBtn = this.translate.instant("BROWSE");
    file1.setAttribute('data-value', txtBtn);
    file2.setAttribute('data-value', txtBtn);
  }
  change = () => {
    this.loading = !this.loading;
  }
  onSubmit() {
    this.showMessage = false
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
    this.formService.postDigitalLife(this.data).then(result => {
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

  getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    this.getBase64(fileToUpload).then(result => { this.data.dniImage = result.toString(); this.data.dniImageName = this.dniName = fileToUpload.name });
  }

  public uploadOptional = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    this.getBase64(fileToUpload).then(result => { this.data.optImage = result.toString(); this.data.optImageName = this.optName = fileToUpload.name });
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }
}
