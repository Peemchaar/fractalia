import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BackupService } from 'src/app/services/backup.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { TruncateService } from 'src/app/services/truncate.service';
import { PartnerService } from 'src/app/services/partner.service';
import { LocalService } from 'src/app/services/local.service';
import { environment } from 'src/environments/environment';
import { ModalComponent } from '../modal/modal.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AcronismodalComponent } from '../automatic-activation/help-modal/acronis-modal/acronismodal.component';
import { MessageService } from 'src/app/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { WizardStep } from 'src/app/models/wizardStep';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BackupComponent implements OnInit {
  @Input() serviceCard?: boolean = false;
  public staticContentUrl = environment.STATIC_CONTENT;
  public loading: boolean = false;
  public mobile: boolean = false;
  public tablet: boolean = false;
  public acronisData: WizardStep = new WizardStep;
  screenWidth$: BehaviorSubject<number> = new BehaviorSubject(null);
  private readonly unsubscriber$: Subject<any> = new Subject();

  constructor(
    
    public backupService: BackupService,    
    public userService: UserService,    
    public truncateService: TruncateService,
    private messageService: MessageService,
    private translate: TranslateService,
    private router: Router,
    public modalService: NgbModal,
    public partnerService: PartnerService,
    private localService: LocalService) { 
      /* if(backupService.serviceId)
      {
        if(this.getLocalStorage('currentService') == null)
        {
          this.router.navigate(['/']);
          return;
        }
        else
        { // If refresh
          let service = this.getLocalStorage('currentService');
          backupService.serviceId = service.id;          
          backupService.serviceName = service.name;
          backupService.serviceIcon = service.icon;
          backupService.serviceDesc= service.desc;    
          backupService.longDesc= service.longDesc; 
          this.userService.selSuiteName = localStorage.getItem('suiteName');
        }
      }
      else 
      {
        let service = this.getLocalStorage('currentService');
        backupService.serviceId = service.id;          
        backupService.serviceName = service.name;
        backupService.serviceIcon = service.icon;
        backupService.serviceDesc= service.desc;    
        backupService.longDesc= service.longDesc; 
        this.userService.selSuiteName = localStorage.getItem('suiteName');
      } */
    }

  ngOnInit() {
    this._setScreenWidth(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(300),
        takeUntil(this.unsubscriber$)
      ).subscribe((evt: any) => {
        this._setScreenWidth(evt.target.innerWidth);
      });
    if(!this.backupService.hasData) this.checkLicence(0)
  }
  
  private _setScreenWidth(width: number): void {
    this.screenWidth$.next(width);
    (this.screenWidth$.value > 760) ? this.mobile = false : this.mobile = true;
    (this.screenWidth$.value > 992) ? this.tablet = false : this.tablet = true;
  }
  
  async requestBackupService()
  {
    this.loading = true;    
    await this.backupService.requestBackupService();
    this.loading = false;   
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }

  validateAcronis(action: string){
    if(action == 'password'){
      this.backupService.hasPassword = true;
      this.checkLicence(1)
    }
    if(action == 'download'){
      this.backupService.clientDownloaded = true;
      this.checkLicence(2)
    }
  }

  downloadCAC(){
    window.open('https://eu-cloud.acronis.com/login', "_blank");
    this.backupService.canSkipDownload = true;
  }

  open(name: string, desc: string, icon: string) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.desc = desc;
    modalRef.componentInstance.icon = icon;
  }

  openAcronisHelpModal(){
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'help-modal'
    };
    const modalRef = this.modalService.open(AcronismodalComponent, ngbModalOptions);
    modalRef.result.then((data) => {
      // on close
      
    },
    (error) => {
      // on error/dismiss
      
    });
  }

  async checkLicence(step: number){
    this.loading = true;
    await this.userService.getActivationServices().then(
      result => {
        var tempData = result as any
        this.acronisData = tempData.find(e => e.serviceCode === 'CAC')
        if(this.acronisData != undefined){
          if(step == 1 && !this.backupService.hasPassword){
            if(step == this.acronisData.currentStep){
              this.messageService.add(this.translate.instant('WIZARD.ERROR_PASS_STEP'), "error")
            }
          }
          if(step == 2 && !this.backupService.clientDownloaded){
            if(step == this.acronisData.currentStep){
              this.messageService.add(this.translate.instant('WIZARD.ERROR_PASS_STEP'), "error")
            }
          }
          
          if(this.acronisData.currentStep >= 1) this.backupService.hasActivated = true;
          if(this.acronisData.currentStep >= 2) this.backupService.hasPassword = true;
          if(this.acronisData.currentStep >= 3) this.backupService.clientDownloaded = true;
          if(this.backupService.clientDownloaded && step == 2) document.getElementById('openRegisterModal').click();
        }
        
        this.loading = false
    });
  }
}
