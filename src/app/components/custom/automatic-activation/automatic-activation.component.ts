import { Result } from '../../../models/result';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PartnerService } from 'src/app/services/partner.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UserValidator } from 'src/app/validators/user.validator';
import { LanguageService } from 'src/app/services/language.service';
import { ImageUtils } from 'src/app/utils/ImageUtils';
import { LocalService } from 'src/app/services/local.service';
import { environment } from 'src/environments/environment';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { debounceTime, first, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { MonitoredIdentity } from 'src/app/models/monitoredIdentity';
import { WizardStep } from 'src/app/models/wizardStep';
import { MonitoredIdentitiesService } from 'src/app/services/monitored-identities.service';
import { AttacksimulatorService } from 'src/app/services/attacksimulator.service';
import { ElearningService } from 'src/app/services/elearning.service';
import { AppConstants } from 'src/app/shared/app.constans';
import { BitdefendermspService } from 'src/app/services/bitdefendermsp.service';
import { MessageService } from 'src/app/services/message.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BitdefendermodalComponent } from '../bitdefendermodal/bitdefendermodal.component';
import { GravityService } from 'src/app/services/gravity.service';
import { GravityEndpoint } from 'src/app/models/gravityEndpoint';
import { BackupService } from 'src/app/services/backup.service';
import { MspmodalComponent } from './help-modal/msp-modal/mspmodal.component';
import { AcronismodalComponent } from './help-modal/acronis-modal/acronismodal.component';



declare var $ : any;

@Component({
  selector: 'app-automatic-activation',
  templateUrl: './automatic-activation.component.html',
  styleUrls: ['./automatic-activation.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AutomaticActivationComponent implements OnInit {
  public staticContentUrl = environment.STATIC_CONTENT;
  public user: User;
  public loading_page = true;
  public loading = false;
  public loadingPassword = false;
  public submitted = false;
  public updateError = false;
  public terms = false;
  public image: string = `${this.staticContentUrl}img/add-foto.png` ;
  public globalLoading: boolean = true;
  public mobile: boolean = false;
  public tablet: boolean = false;
  keepSession: boolean = true;
  public showMessage: boolean = false;
  public message: string = "";
  public loginType: number;
  public currentStep: number = 0;
  public currentService: string ='';
  public currentIndex: number = 0;
  public totalSteps: number = 0;
  public barLabel: string = "";
  public successpass: boolean = false;
  public slastPreviousAccessDate: string;
  public actualProgress: string = `0%`;
  public stepsData: WizardStep = new WizardStep;
  public bitDefenderMspConst;
  public MSPenrolUrl: string;
  public showResume: boolean = false;
  public resumed: boolean = false;
  public completeProfile = false;
  public allreadyActivated = false;
  public loginUrl: string;
  public installable: boolean = false;
  public advancing: boolean = false;
  public bmsPassTabOpen: boolean = false;
  public pendingInstall: boolean = false;
  public bmsEnd: boolean = false;
  public graEnd: boolean = false;
  public cacEnd: boolean = false;
  public bmsGreen: boolean = false;
  public graGreen: boolean = false;
  public cacGreen: boolean = false;
  public endpointSelected: GravityEndpoint = new GravityEndpoint();
  public validatingGRA: boolean = false;
  public isSSOBMS:boolean = false;

  private readonly unsubscriber$: Subject<any> = new Subject();
  screenWidth$: BehaviorSubject<number> = new BehaviorSubject(null);

  constructor(
    public partnerService: PartnerService,
    public backupService: BackupService,
    public monitoredIdentitiesService: MonitoredIdentitiesService,
    public attacksimulatorService: AttacksimulatorService,
    public userService: UserService,
    private router: Router,
    public modalService: NgbModal,
    private messageService: MessageService,
    private translate: TranslateService,
    public bitdefendermspService: BitdefendermspService,
    public sanitizer: DomSanitizer,
    public languageService: LanguageService,
    public elearningService: ElearningService,
    public gravityService: GravityService,
    private localService: LocalService) {
      this.loading_page = true;
      this.barLabel = this.translate.instant("CONTRASENA_MESSAGE");
      this.user = Object.assign({}, this.userService.currentUserValue);
      this.terms = this.user.checkTermsAcceptDate;
      this.loginType = this.partnerService.partner.loginType;
      this.bitDefenderMspConst = AppConstants.BitDefenderMspConst;
      if (this.userService.selSuiteId == undefined) {
        this.router.navigate(["/"]);
        return;
      }
    }

  ngOnInit() {
    this.bitdefendermspService.clientDownloaded = false;
    this.gravityService.clientDownloaded = false;
    this.backupService.clientDownloaded = false;
    (localStorage.getItem('skipWizard') != null)? this.resumed = true : this.resumed = false;

    if (this.userService.selSuiteId)
      localStorage.setItem('partnerSuiteId',this.userService.selSuiteId.toString())
    else {
      this.userService.selSuiteId = Number(localStorage.getItem('partnerSuiteId'));
    }
    this.getStepsData()
    this._setScreenWidth(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(300),
        takeUntil(this.unsubscriber$)
      ).subscribe((evt: any) => {
        this._setScreenWidth(evt.target.innerWidth);

      });
    this.user = Object.assign({}, this.userService.currentUserValue);
    if (!this.user.checkTermsAcceptDate && this.getLocalStorage('tmpUser')) {
      this.user = Object.assign({}, this.getLocalStorage('tmpUser'));
      this.completeProfile = true;
      localStorage.removeItem('tmpUser')
    }

    if(!this.user.partnerName){
      this.loadPartner();
    }
    this.loading_page = false;
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  progressCalc(current, total){
    var progress = Math.round((current * 100)/total)
    this.actualProgress = `${progress}%`
  }

  async loadPartner(){
    await this.partnerService.getPartner(this.user.partnerId).then(res => {
      if(res.name){
        var tempUser = new User;
        tempUser = Object.assign({}, this.userService.currentUserValue);
        tempUser.partnerName = res.name
        this.userService.updateCurrentUser(tempUser)
        this.user = Object.assign({}, this.userService.currentUserValue);
      }
    });
  }
  closeResumed(){
    
    if(this.stepsData[this.currentIndex].totalSteps > 1 && this.stepsData[this.currentIndex].serviceCode == this.currentService){
      this.advancing = true;
      this.resumed = false;
      setTimeout(()=>{
        this.advancing = false;
      }, 100);
    }else{
      this.submitStep()
    }

  }

  installableService(service: string){
    switch(service){
      case 'BMS':{
        return (this.bitdefendermspService.clientDownloaded && this.bmsEnd && !this.bmsGreen)? true : false
      }
      case 'GRA':{
        return (this.gravityService.clientDownloaded && this.graEnd && !this.graGreen)? true : false
      }
      case 'CAC':{
        return (this.backupService.clientDownloaded && this.cacEnd && !this.cacGreen)? true : false
      }
      default: return false
    }
  }


  checkTerms(e: any) {
    this.terms = e.target.checked;
  }

  private _setScreenWidth(width: number): void {
    this.screenWidth$.next(width);
    (this.screenWidth$.value > 760) ? this.mobile = false : this.mobile = true;
    (this.screenWidth$.value > 992) ? this.tablet = false : this.tablet = true;
  }

  async getStepsData(){
    await this.userService.getActivationServices().then(
      result => {
        this.currentService = '';
        var tempData = result as any
        tempData.sort((a,b) => a.order - b.order);
        this.stepsData = tempData
        var installableServices = 0
        for (let i = 0; i < tempData.length; i++) {
          this.totalSteps += this.stepsData[i].totalSteps
          this.currentStep += this.stepsData[i].currentStep
          if(this.stepsData[i].finalized == false && this.currentService === ''){
            this.currentService = this.stepsData[i].serviceCode
            // resume wizard in last activated screen if there is one finalized
            if(this.stepsData[i].totalSteps >= 1 && this.stepsData[i].currentStep == 0){
              (tempData.length > 1 && i > 0)? this.currentIndex = i-1 : this.currentIndex = i
            }
            if(this.stepsData[i].totalSteps > 1 && this.stepsData[i].currentStep > 0){
              this.currentIndex = i
            }

          }
          if(this.stepsData[i].finalized == true ){
            this.resumed = true
            if(this.stepsData[i].serviceCode == 'BMS'){
              this.bmsGreen = true;
            }
            if(this.stepsData[i].serviceCode == 'GRA'){
              this.graGreen = true;
            }
            if(this.stepsData[i].serviceCode == 'CAC'){
              this.cacGreen = true;
            }
          }
          if(this.stepsData[i].currentStep > 0){
            this.resumed = true
          }

          (this.stepsData[i].serviceCode == 'BMS' || this.stepsData[i].serviceCode == 'GRA' || this.stepsData[i].serviceCode == 'CAC')? installableServices += 1:null;
          if(this.stepsData[i].serviceCode == 'BMS'){
            (this.stepsData[i].currentStep == 2)? this.bitdefendermspService.canSkipDownload = true : this.bitdefendermspService.canSkipDownload = false;
          }
          if(this.stepsData[i].serviceCode == 'GRA'){
            (this.stepsData[i].currentStep == 1)? this.gravityService.canSkipDownload = true : this.gravityService.canSkipDownload = false;
          }
          if(this.stepsData[i].serviceCode == 'CAC'){
            (this.stepsData[i].currentStep == 2)? this.backupService.canSkipDownload = true : this.backupService.canSkipDownload = false;
          }

        }

        if(installableServices > 0 && this.resumed == true){
          (this.totalSteps - this.currentStep == 1)? this.pendingInstall = true : this.pendingInstall = false;
        }

        // calculate progress before add static steps
        this.progressCalc(this.currentStep, this.totalSteps)
         //aditional steps (first and last screens)
        this.currentStep += 1
        this.totalSteps += 2

        if(this.currentService == 'BMS' && tempData[this.currentIndex].totalSteps >= 1){
          this.checkLicence()
        }
        if(this.currentService == 'GRA' && tempData[this.currentIndex].serviceCode == "GRA" && tempData[this.currentIndex].totalSteps >= 1){
          this.loadGravityData();
        }
        this.globalLoading = false;

      }
    )
  }

  async renewStepsData(service?: string){
    this.loading = true;
    if(service){
      if(service == 'BMS'){
        this.bitdefendermspService.canSkipDownload? this.renewStepsData()  :
          this.bitdefendermspService.clientDownloaded? this.renewStepsData() :
            this.messageService.add(this.translate.instant('WIZARD.ERROR_PASS_STEP'), "error") , this.loading = false;
      }
      if(service == 'GRA'){
        this.gravityService.canSkipDownload? this.renewStepsData()  :
          this.gravityService.clientDownloaded? this.renewStepsData() :
            this.messageService.add(this.translate.instant('WIZARD.ERROR_PASS_STEP'), "error") , this.loading = false;
      }
      if(service == "CAC"){
        this.backupService.canSkipDownload? this.renewStepsData()  :
          this.backupService.clientDownloaded? this.renewStepsData() :
            this.messageService.add(this.translate.instant('WIZARD.ERROR_PASS_STEP'), "error") , this.loading = false;
      }
    }else{

      this.advancing = true
      await this.userService.getActivationServices().then(
        result => {
          var tempData = result as any
          tempData.sort((a,b) => a.order - b.order);
          var tempStepCount = 0
          for (let i = 0; i < tempData.length; i++) {
            if(this.currentService == tempData[i].serviceCode){
              if(this.currentService == 'BMS'){
                if(tempData[i].finalized == true){
                  this.bmsGreen = true;
                }
                if(this.bitdefendermspService.canSkipDownload && tempData[i].currentStep == 2){
                  this.bitdefendermspService.clientDownloaded = true;
                  tempData[i].currentStep = tempData[i].totalSteps
                  tempData[i].finalized = true
                  this.bmsEnd = true
                }
                else if(this.bitdefendermspService.clientDownloaded){
                  tempData[i].currentStep = tempData[i].totalSteps
                  tempData[i].finalized = true
                  this.bmsEnd = true
                }
                if(tempData[i].currentStep >= 1){
                  this.currentIndex = i
                }
              }
              if(this.currentService == 'GRA'){
                if(tempData[i].finalized == true){
                  this.graGreen = true;
                }
                if(this.gravityService.canSkipDownload && tempData[i].currentStep == 1 && this.validatingGRA){
                  this.gravityService.clientDownloaded = true;
                  tempData[i].currentStep = tempData[i].totalSteps
                  tempData[i].finalized = true
                  this.graEnd = true
                }
                else if(this.gravityService.clientDownloaded){
                  tempData[i].currentStep = tempData[i].totalSteps
                  tempData[i].finalized = true
                  this.graEnd = true
                }
                if(tempData[i].currentStep == 1){
                  this.currentIndex = i
                }
              }
              if(this.currentService == 'CAC'){
                if(tempData[i].currentStep >= 1){
                  this.currentIndex = i
                }

                if(tempData[i].finalized == true){
                  this.cacGreen = true;
                }
                if(this.backupService.canSkipDownload ){
                  this.backupService.clientDownloaded = true;
                  tempData[i].currentStep = tempData[i].totalSteps
                  tempData[i].finalized = true
                  this.cacEnd = true
                }
                else if(this.backupService.clientDownloaded){
                  tempData[i].currentStep = tempData[i].totalSteps
                  tempData[i].finalized = true
                  this.cacEnd = true
                }

              }

              if(tempData[i].currentStep == tempData[i].totalSteps){
                this.currentService = ''
                if(tempData.length == i+1){
                  this.currentIndex = i
                }
              }
              if(this.stepsData[i].currentStep < tempData[i].currentStep){
                this.stepsData[i] = tempData[i]
              }
            }
            if(tempData[i].finalized == false && this.currentService === ''){
              this.currentService = tempData[i].serviceCode
              //set screen to the last step activated
              this.currentIndex = i-1
            }
            tempStepCount += this.stepsData[i].currentStep
          }
          this.currentStep = tempStepCount;
          // calculate progress before add static steps
          this.progressCalc(this.currentStep, this.totalSteps-2)
          //aditional steps (first screen)
          this.currentStep += 1
          this.resumed = false;
          this.loading = false;
          setTimeout(()=>{
            this.advancing = false;
          }, 100);
        }
      )
    }
  }

  downloadGravity(){
    this.gravityService.clientDownloaded = true;
  }

  async validateBMS(){
    this.loading = true
    await this.userService.getActivationServices().then(
      result => {
        var tempData = result as any
        tempData.sort((a,b) => a.order - b.order);
        for (let i = 0; i < tempData.length; i++) {
          if(this.currentService == tempData[i].serviceCode){
            if(this.currentService == 'BMS'){
              if(tempData[i].currentStep == 2){
                 // calculate progress before add static steps
                this.stepsData[i] = tempData[i]
                this.currentStep += 1
                this.progressCalc(this.currentStep, this.totalSteps-2)

              }else{
                this.messageService.add(this.translate.instant('WIZARD.ERROR_PASS_STEP'), "error");
              }
            }
          }
        }
        this.loading = false;
      }
    )
  }

  async validateGravity(pass?){
    if(pass){
      this.loading = true
      await this.userService.getActivationServices().then(
        result => {
          var tempData = result as any
          tempData.sort((a,b) => a.order - b.order);
          for (let i = 0; i < tempData.length; i++) {
            if(tempData[i].serviceCode == "GRA"){
              if(tempData[i].currentStep == 2){
                this.loading = false;
                this.renewStepsData();
              }else{
                this.loading = false;
                this.messageService.add(this.translate.instant('WIZARD.ERROR_PASS_STEP'), "error") , this.loading = false;
              }
            }
          }
        }
      )
    }else if(this.stepsData[this.currentIndex].serviceCode != 'GRA' && this.stepsData[this.currentIndex+1].serviceCode == 'GRA'){
      if(this.stepsData[this.currentIndex+1].currentStep == 0){
        this.createGravity()
      }else{
        this.renewStepsData()
        this.loadGravityData();
      }
    }else if(this.stepsData[this.currentIndex].serviceCode == 'GRA' && this.stepsData[this.currentIndex].currentStep == 0){
      this.createGravity();
    }

  }

  async validateAcronis(pass?){
    if(pass){
      this.loading = true;
      await this.userService.getActivationServices().then(
        result => {
          var tempData = result as any
          tempData.sort((a,b) => a.order - b.order);
          for (let i = 0; i < tempData.length; i++) {
            if(tempData[i].serviceCode == "CAC"){
              if(tempData[i].currentStep == 2){
                this.loading = false;
                this.stepsData[i] = tempData[i]
                this.currentStep += 1
                this.progressCalc(this.currentStep, this.totalSteps-2)
              }else{
                this.loading = false;
                this.stepsData[i].currentStep += 1
                this.currentStep += 1
                this.progressCalc(this.currentStep, this.totalSteps-2)
                //this.messageService.add(this.translate.instant('WIZARD.ERROR_PASS_STEP'), "error") , this.loading = false;
              }
            }
          }
        }
      )
    }else if(this.stepsData[this.currentIndex].serviceCode != 'CAC' && this.stepsData[this.currentIndex+1].serviceCode == 'CAC'){
      if(this.stepsData[this.currentIndex+1].currentStep == 0){
        this.requestBackupService()
      }else{
        this.advancing = true;
        this.currentIndex += 1
        setTimeout(()=>{                           
          this.advancing = false;
        }, 100);
      }
    }else if(this.stepsData[this.currentIndex].serviceCode == 'CAC' && this.stepsData[this.currentIndex].currentStep == 0){
      this.requestBackupService();
    }
  }

  public submitStep(){
    switch(this.currentService){
      case 'CII':{
        this.activateRoboIdentidad();
        break;
      }
      case 'ATS':{
        this.activateAttackSimulator();
        break;
      }
      case 'ELE':{
        this.activateELearning();
        break;
      }
      case 'BMS':{
        this.activateBitDefender();
      }
      case 'GRA':{
        this.validateGravity();
      }
      case 'CAC':{
        this.validateAcronis();
      }
      default: {
        this.checkLastStep();
        break;
      }
    }
  }

  async requestBackupService()
  {
    this.loading = true;
    await this.backupService.requestBackupService().then(res => {
      this.loading = false;
      this.renewStepsData();
    });

  }

  finishWizard(){
    localStorage.setItem('skipWizard', 'false')
    this.router.navigate(['/services'])
  }

  checkLastStep(){
    if(this.currentStep == (this.totalSteps-1)){
      this.advancing = true;
      this.currentService = "";
      this.currentIndex = 0;
      this.currentStep += 1
      setTimeout(()=>{
        this.advancing = false;
      }, 100);
    }
  }

  checkGravity(){
    this.validatingGRA = true;
    this.renewStepsData('GRA');
  }
  async activateRoboIdentidad(){
    this.loading = true
    var monitoredIdentity = new MonitoredIdentity();
    monitoredIdentity.identity = this.user.email.trim()
    if (this.userService.selSuiteId)
      monitoredIdentity.partnerSuiteId = this.userService.selSuiteId;
    else {
      monitoredIdentity.partnerSuiteId = Number(localStorage.getItem('partnerSuiteId'));
    }
    localStorage.setItem('partnerSuiteId', monitoredIdentity.partnerSuiteId.toString());
    this.monitoredIdentitiesService.addMonitoredIdentity([monitoredIdentity]).then(
      result => {
        this.loading = false;
        this.renewStepsData()
    });
  }


  async activateELearning(){
    // llamado a la API para activar e-learning
    this.loading = true;
    this.elearningService.activationSimple().then(
      result => {
        this.loading = false;
        this.renewStepsData()
      }
    );
  }

  async activateAttackSimulator(){
    // llamado a la API para activar attack simulator
    this.attacksimulatorService.CreateAttackSimulatorFamily().then(
      result => {
        this.loading = false;
        this.renewStepsData()
    })

  }


  async validateUserStatus(){
    await this.userService.getusertokendata(this.userService.activationToken).then(
      result => {
        this.user = Object.assign({}, result as User);
        if (this.user.checkTermsAcceptDate == true){
          this.allreadyActivated = true;
          this.loginUrl = window.location.href.toString().split('#')[0]
        }else{
          this.allreadyActivated = false;
        }
      },
      err => {
        console.log("Error: ", err)
      });
  }



  createGravity() {
    this.loading = true;
    this.gravityService.CreateGravityCompany().then(
      result => {
        if (result) {
          this.messageService.add(this.translate.instant('COMP_GRAVITY.MESSAGE_CREATE_OK'), "ok");
          this.renewStepsData()
          this.loadGravityData();
        }
        else
          this.messageService.add(this.translate.instant('COMP_GRAVITY.MESSAGE_CREATE_ERROR'), "error");
        this.loading = false;
      }
    );
  }

  async loadGravityData() {
    this.loading = true;
    await this.gravityService.GetInstallationLinks().then(
      result => {
        if (result.packageName != null) {
          this.gravityService.GetGravityEndpoints().then(
            result => {
              if (this.gravityService.endpoints.length > 0)
                this.endpointSelected = this.gravityService.endpoints[0];

              if (this.gravityService.revisedChartData.length > 0)
                this.gravityService.revisedChartData = [];
              this.gravityService.totalAlertsRevised = this.endpointSelected.revisedCleaned + this.endpointSelected.revisedErased + this.endpointSelected.revisedExcluded + this.endpointSelected.revisedQuarantined;
              this.gravityService.revisedChartData.push(this.endpointSelected.revisedCleaned);
              this.gravityService.revisedChartData.push(this.endpointSelected.revisedErased);
              this.gravityService.revisedChartData.push(this.endpointSelected.revisedExcluded);
              this.gravityService.revisedChartData.push(this.endpointSelected.revisedQuarantined);
              this.gravityService.revisedDoughnutChartData = [this.gravityService.revisedChartData];

              if (this.gravityService.blockedChartData.length > 0)
                this.gravityService.blockedChartData = [];
              this.gravityService.totalAlertsBlocked = this.endpointSelected.blockedWebs + this.endpointSelected.blockedPhising + this.endpointSelected.blockedMalware;
              this.gravityService.blockedChartData.push(this.endpointSelected.blockedWebs);
              this.gravityService.blockedChartData.push(this.endpointSelected.blockedPhising);
              this.gravityService.blockedChartData.push(this.endpointSelected.blockedMalware);
              this.gravityService.blockedDoughnutChartData = [this.gravityService.blockedChartData];

              this.loading = false;

            }
          );
        }
        else
          this.loading = false;
      }
    );
  }
  gravityEndpointchanged(value) {
    this.endpointSelected = this.gravityService.endpoints.find(x => x.id == value);
    if (this.gravityService.revisedChartData.length > 0)
      this.gravityService.revisedChartData = [];
    this.gravityService.totalAlertsRevised = this.endpointSelected.revisedCleaned + this.endpointSelected.revisedErased + this.endpointSelected.revisedExcluded + this.endpointSelected.revisedQuarantined;
    this.gravityService.revisedChartData.push(this.endpointSelected.revisedCleaned);
    this.gravityService.revisedChartData.push(this.endpointSelected.revisedErased);
    this.gravityService.revisedChartData.push(this.endpointSelected.revisedExcluded);
    this.gravityService.revisedChartData.push(this.endpointSelected.revisedQuarantined);
    this.gravityService.revisedDoughnutChartData = [this.gravityService.revisedChartData];

    if (this.gravityService.blockedChartData.length > 0)
      this.gravityService.blockedChartData = [];
    this.gravityService.totalAlertsBlocked = this.endpointSelected.blockedWebs + this.endpointSelected.blockedPhising + this.endpointSelected.blockedMalware;
    this.gravityService.blockedChartData.push(this.endpointSelected.blockedWebs);
    this.gravityService.blockedChartData.push(this.endpointSelected.blockedPhising);
    this.gravityService.blockedChartData.push(this.endpointSelected.blockedMalware);
    this.gravityService.blockedDoughnutChartData = [this.gravityService.blockedChartData];
  }

  downloadCAC(){
    window.open('https://eu-cloud.acronis.com/login', "_blank");
    this.backupService.canSkipDownload = true;
  }

  async activateBitDefender() {
    this.loading = !this.loading;
    localStorage.setItem('partnerSuiteId', this.userService.selSuiteId.toString())
    let partnerSuiteId = localStorage.getItem('partnerSuiteId');
    let lang:string = this.user.languageCode;
    lang = lang.replace('-','_');
    if(this.bitDefenderMspConst.languages.indexOf(lang)>-1){
      await this.bitdefendermspService.setUserLicenceMSP(partnerSuiteId,lang , this.partnerService.partner.code).then(result=>{
        this.loading = !this.loading;
        if(result.subscriberId && result.enrolUrl){
          this.MSPenrolUrl = result.enrolUrl.value
          this.renewStepsData()
        }
        else{
          if(result.message!=null && result.message.length>0){
            this.messageService.add(this.translate.instant(result.message), "error");
          }
          else{
            this.messageService.add(this.translate.instant('NOT_LICENSE'), "error")
          }
        }
      });
    }
    else{
      this.messageService.add(this.translate.instant('COMP_BITDEFENDERMSP.ERROR_LANGUAGE'), "error");
      this.loading = !this.loading;
    }
  }

  async checkLicence(validate?) {
    this.loading = true

    await this.bitdefendermspService.getUserLicenceMsp(localStorage.getItem('partnerSuiteId')).then(() =>{
      const bitdenderResponse = this.bitdefendermspService.bitdefenderResponse;
      this.loading = false
      this.isSSOBMS = bitdenderResponse.isSSO>0;
      if(bitdenderResponse.state=="pending"){
        this.MSPenrolUrl= bitdenderResponse.enrolUrl.value;
      }
      (validate)? this.validateBMS() : null
    })
  }

  public openBMSTab(){
    try{
      window.open(this.MSPenrolUrl, '_blank')
      this.bmsPassTabOpen = true;
    }catch{
      this.bmsPassTabOpen = false;
    }

  }

  isValidString(str: string) {
    return str !== null && str !== undefined && typeof str === "string" && str.length > 0;
  }


  async onSubmit() {

  }


  closeWizard(){
    document.getElementById('closeModal').click();
    if (this.currentStep < this.totalSteps){
      localStorage.setItem('skipWizard', 'true')
    }
    setTimeout(()=>{
      this.router.navigate(['/services']);
    }, 200);

  }

  public setAcceptCookies() {
    if (localStorage.getItem('acceptCookies') == null) {
      localStorage.setItem('acceptCookies', JSON.stringify(true));
      //$('#cajacookies').hide();
    }
  }

  getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }


  loadBitdefenderPopup() {
  /*     let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    const modalRef = this.modalService.open(BitdefendermodalComponent, ngbModalOptions);
    modalRef.componentInstance.isBMS = 'BMS'
    modalRef.result.then((data) => {
      // on close
      this.renewStepsData('BMS')

    },
    (error) => {
      // on error/dismiss
      this.renewStepsData('BMS')
    }); */

    window.open("https://central.bitdefender.com/dashboard", "_blank");
    this.bitdefendermspService.canSkipDownload = true;
  }

  openBmsHelpModal(){
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'help-modal'
    };
    const modalRef = this.modalService.open(MspmodalComponent, ngbModalOptions);
    modalRef.result.then((data) => {
      // on close
      
    },
    (error) => {
      // on error/dismiss
      
    });
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


  checkpass(success: boolean) {
    this.successpass = success;
  }

  saveTempProfile() {
    this.setLocalStorage('tmpUser', this.user);
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);
  }

  setLocalStorage(key, data) {
      this.localService.setJsonValue(key, data);
  }

  openBMSPage(){
    window.open(this.bitdefendermspService.access_central_url, '_blank')
  }
}








