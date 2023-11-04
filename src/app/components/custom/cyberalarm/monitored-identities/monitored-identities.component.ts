import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MonitoredIdentity } from 'src/app/models/monitoredIdentity';
import { MessageService } from 'src/app/services/message.service';
import { MonitoredIdentitiesService } from 'src/app/services/monitored-identities.service';
import { UserService } from 'src/app/services/user.service';
import { UserValidator } from './../../../../validators/user.validator';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-monitored-identities',
  templateUrl: './monitored-identities.component.html',
  styleUrls: ['./monitored-identities.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MonitoredIdentitiesComponent implements OnInit {

  addIdentityForm: FormGroup;
  selectedIdentity: MonitoredIdentity = { identityId: -1, identity: '', partnerSuiteId: -1, breaches: -1, lastAnalysisDate:'' }
  loading = false;
  public showMessage: boolean = false;
  public errorMessage: string = "";
  currentTotalCards = 0;

  constructor(
    public monitoredIdentitiesService: MonitoredIdentitiesService,
    private formBuilder: FormBuilder,
    private router: Router,
    public messageService: MessageService,
    public translate: TranslateService,
    public userService: UserService,
    private localService: LocalService) {
    if (monitoredIdentitiesService.serviceId) {
      if (this.getLocalStorage('currentService') == null) {
        this.router.navigate(['/']);
        return;
      }
      else { // If refresh
        let service = this.getLocalStorage('currentService');
        monitoredIdentitiesService.serviceId = service.id;
        monitoredIdentitiesService.serviceName = service.name;
        monitoredIdentitiesService.serviceIcon = service.icon;
        monitoredIdentitiesService.serviceDesc = service.desc;
        monitoredIdentitiesService.longDesc = service.longDesc;
        monitoredIdentitiesService.maxIdentitiesByUser = Number(localStorage.getItem('maxIdentitiesByUser'));
      }
    }
    else {
      let service = this.getLocalStorage('currentService');
      monitoredIdentitiesService.serviceId = service.id;
      monitoredIdentitiesService.serviceName = service.name;
      monitoredIdentitiesService.serviceIcon = service.icon;
      monitoredIdentitiesService.serviceDesc = service.desc;
      monitoredIdentitiesService.longDesc = service.longDesc;
      monitoredIdentitiesService.maxIdentitiesByUser = Number(localStorage.getItem('maxIdentitiesByUser'));

    }
    this.loadData();
  }

  ngOnInit() {
    this.addIdentityForm = this.formBuilder.group({
      identity: new FormControl('', [
        Validators.required,
        UserValidator.validEmail
      ])
    });
  }

  reloadForm() {
    this.addIdentityForm.reset()
  }

  async loadData() {
    await this.monitoredIdentitiesService.getMonitoredIdentitiesByUser();
    this.monitoredIdentitiesService.canAddIdentities = Number(localStorage.getItem('maxIdentitiesByUser')) <= this.monitoredIdentitiesService.identities.length
  }

  get addIdentityControls() { return this.addIdentityForm.controls; }
  get inputIdentity() {
    return this.addIdentityForm.get('identity')
  }

  getSelectedIdentity(id) {
    this.selectedIdentity = this.monitoredIdentitiesService.identities.find(identity => identity.identityId == id);
  }

  // Services calls
  addIdentity() {
    this.loading = true;
    var monitoredIdentity = new MonitoredIdentity();
    monitoredIdentity.identity = this.addIdentityControls.identity.value.trim()
    if (UserValidator.validEmail(monitoredIdentity.identity) == null) {
      this.errorMessage = this.translate.instant('MULTIUSER.VALIDATION4'); this.showMessage = true; this.loading = false; return;
    }

    if (this.userService.selSuiteId)
      monitoredIdentity.partnerSuiteId = this.userService.selSuiteId;
    else {
      monitoredIdentity.partnerSuiteId = Number(localStorage.getItem('partnerSuiteId'));
    }
    this.translate.get('REQUEST_SERVICE').subscribe(res => this.messageService.add(res, "ok"));
    // this.monitoredIdentitiesService.addMonitoredIdentity(monitoredIdentity).then(
    //   result => {
    //     this.loading = false;
    //     if (result) {
    //       this.messageService.add(this.translate.instant('CYBERALARM.IDENTITIES.ADD_FORM.RESULT_OK'), "ok");
    //       this.loadData();
    //       document.getElementById('frmAddIdentity').style.display = "none";
    //       this.reloadForm()
    //     }
    //     else {
    //       this.messageService.add(this.translate.instant('CYBERALARM.IDENTITIES.ADD_FORM.RESULT_ERROR'), "error");
    //       document.getElementById('frmAddIdentity').style.display = "none";
    //       this.reloadForm()
    //     }
    //   })
  }

  // Services calls
  deleteIdentity() {
    this.loading = true;
    this.translate.get('REQUEST_DELETE_SERVICE').subscribe(res => this.messageService.add(res, "ok"));
    this.monitoredIdentitiesService.deleteMonitoredIdentity(this.selectedIdentity.identityId).then(
      result => {
        this.loading = false;
        if (result) {
          this.messageService.add(this.translate.instant('CYBERALARM.IDENTITIES.REMOVE_FORM.RESULT_OK'), "ok");
          this.loadData();
          document.getElementById('frmRemoveIdentity').style.display = "none";
        }
        else
          this.messageService.add(this.translate.instant('CYBERALARM.IDENTITIES.REMOVE_FORM.RESULT_ERROR'), "error");
      })
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);
}

}
