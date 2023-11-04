import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { IdentityBreach } from 'src/app/models/identityBreach';
import { MonitoredIdentity } from 'src/app/models/monitoredIdentity';
import { DashboardUserService } from 'src/app/services/dashboard-user.service';
import { LocalService } from 'src/app/services/local.service';
import { MessageService } from 'src/app/services/message.service';
import { MonitoredIdentitiesService } from 'src/app/services/monitored-identities.service';
import { UserService } from 'src/app/services/user.service';
import { UserValidator } from 'src/app/validators/user.validator';
import { environment } from 'src/environments/environment';
import { ModalComponent } from '../../modal/modal.component';

declare var $ : any;

@Component({
  selector: 'app-monitored-identities-integrated',
  templateUrl: './monitored-identities-integrated.component.html',
  styleUrls: ['./monitored-identities-integrated.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MonitoredIdentitiesIntegratedComponent implements OnInit {

  @Input() serviceName: string;
  @Input() serviceIcon: string;
  @Input() serviceCard?: boolean = false;
  @ViewChild('identity') identity: ElementRef;
  addIdentityForm: FormGroup;
  selectedIdentity: MonitoredIdentity = { identityId: -1, identity: '', partnerSuiteId: -1, breaches: -1, lastAnalysisDate:'' }
  breachedIdentity: MonitoredIdentity = { identityId: -1, identity: '', partnerSuiteId: -1, breaches: -1, lastAnalysisDate:'' }
  currentBreach: IdentityBreach[] = [{monitoredIdentityId: -1, domain: "", name: "", description: "", detectionDate: ""}];
  loading = false;
  public staticContentUrl = environment.STATIC_CONTENT;
  public showMessage: boolean = false;
  public errorMessage: string = "";
  public globalLoading: boolean = false;
  public dataEmails: string[] = [];
  public success: boolean = false
  public totalIdentities: string = "0/0"
  public emails = Array<MonitoredIdentity>();
  public compactCards: boolean = false;
  public showAddCard: boolean = false;

  constructor(
    public monitoredIdentitiesService: MonitoredIdentitiesService,
    private formBuilder: FormBuilder,
    public router: Router,
    public messageService: MessageService,
    public translate: TranslateService,
    public userService: UserService,
    public modalService: NgbModal,
    public dashboardService: DashboardUserService,
    private localService: LocalService) {
    monitoredIdentitiesService.maxIdentitiesByUser = Number(localStorage.getItem('maxIdentitiesByUser'));
    
  }

  ngOnInit() {
    this.globalLoading = true;
    this.loadData();
    if(this.getLocalStorage('identitiesData') != null ){
      let service = this.getLocalStorage('identitiesData');
      this.monitoredIdentitiesService.serviceId = service.id;
      this.monitoredIdentitiesService.serviceName = service.name;
      this.monitoredIdentitiesService.serviceIcon = service.icon;
      this.monitoredIdentitiesService.serviceDesc = service.desc;
      this.monitoredIdentitiesService.longDesc = service.longDesc;
    }else{
      this.router.navigate(['/']);
    }

    //this.totalIdentities= `${this.monitoredIdentitiesService.identities.length}/${this.monitoredIdentitiesService.maxIdentitiesByUser}`
    this.addIdentityForm = this.formBuilder.group({
      identity: new FormControl('', [
        Validators.required,
        UserValidator.validEmail
      ])
    });
    this.globalLoading = false;
  }

  reloadForm() {
    this.addIdentityForm.reset()
    this.dataEmails = []
    this.success = false;
  }

  closeAddModal(){
    this.reloadForm();
    document.getElementById('addModalClose').click();
  }

  fakeArray(length: number){
   
    (length > 0)? this.showAddCard = true : this.showAddCard = false;
  }


  async loadData() {
    await this.monitoredIdentitiesService.getMonitoredIdentitiesByUser();
    this.monitoredIdentitiesService.canAddIdentities = Number(localStorage.getItem('maxIdentitiesByUser')) > this.monitoredIdentitiesService.identities.length
    this.fakeArray(this.monitoredIdentitiesService.maxIdentitiesByUser - this.monitoredIdentitiesService.identities.length)
    if(this.monitoredIdentitiesService.canAddIdentities == true){
      (this.monitoredIdentitiesService.identities.length >= 3)? this.compactCards = true : this.compactCards = false
    }else{
      (this.monitoredIdentitiesService.identities.length > 3)? this.compactCards = true : this.compactCards = false
    }
    this.totalIdentities= `${this.monitoredIdentitiesService.identities.length}/${this.monitoredIdentitiesService.maxIdentitiesByUser}`
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
    this.showMessage=false;
    var sendData = []
    this.dataEmails.forEach(element => {
      var monitoredIdentity = new MonitoredIdentity();
      monitoredIdentity.identity = element.trim();
      if (this.userService.selSuiteId)
        monitoredIdentity.partnerSuiteId = this.userService.selSuiteId;
      else {
        monitoredIdentity.partnerSuiteId = Number(localStorage.getItem('partnerSuiteId'));
      }
      sendData.push(monitoredIdentity)
    });

    
    this.translate.get('REQUEST_SERVICE').subscribe(res => this.messageService.add(res, "ok"));
    this.monitoredIdentitiesService.addMonitoredIdentities(sendData).then(
      result => {
        this.loading = false;
        if (result) {

          
          this.messageService.add(this.translate.instant('CYBERALARM.IDENTITIES.ADD_FORM.RESULT_OK'), "ok");
          this.loadData();
          this.dashboardService.getUserDashboard();
          this.success = true
        }
        else {
          this.messageService.add(this.translate.instant('CYBERALARM.IDENTITIES.ADD_FORM.RESULT_ERROR'), "error");
          this.reloadForm()
        }
      });
      this.emails = new Array<MonitoredIdentity>();
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
          this.dashboardService.getUserDashboard();
          document.getElementById('closeModalRemove').click();
        }
        else{
          document.getElementById('closeModalRemove').click();
          this.messageService.add(this.translate.instant('CYBERALARM.IDENTITIES.REMOVE_FORM.RESULT_ERROR'), "error");
        }
      })
  }


  getIdentityBreach(id){
    this.loading = true;
    this.breachedIdentity = this.monitoredIdentitiesService.identities.find(identity => identity.identityId == id);
    this.monitoredIdentitiesService.getIdentityBreach(id).then(
      result => {
        if(result.length > 0){
          this.currentBreach = []
          result.forEach(element => {
            this.currentBreach.push(element)
          });
        }else{
          this.currentBreach = [{monitoredIdentityId: -1, domain: "", name: "", description: "", detectionDate: ""}];
        }
        this.loading = false;
      })
  }

  addEmail(email){
    if(email != "")
    {
      this.showMessage = false;
      if (UserValidator.validEmail(email) && this.dataEmails.indexOf(email) == -1) {
        this.dataEmails.push(email);
        this.identity.nativeElement.value = '';
      }
      else {
        this.errorMessage = this.translate.instant('MULTIUSER.VALIDATION4'); this.showMessage = true; this.loading = false; return;
      }
    }
  }

  deleteEmail(email){
    this.showMessage = false;
    if(email != "")
    {
      if(this.dataEmails.includes(email)){ 
        this.dataEmails.splice(this.dataEmails.indexOf(email),1);
      }
    }
  }

  openfrmAddIdentity(){
    this.showMessage= false;
    $('#frmAddIdentity').show();
  }
  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }
  open(name: string, desc: string, icon: string) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.desc = desc;
    modalRef.componentInstance.icon = icon;
  }
}
