import { Component, ViewEncapsulation } from '@angular/core';
import { Service } from 'src/app/models/service';
import { Subscription } from 'rxjs';
import { ServicesService } from 'src/app/services/services.service';
import { ChatService } from 'src/app/services/chat.service';
import { ChatDataService} from 'src/app/services/chat-data.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { PartnerService } from 'src/app/services/partner.service';
import { Generic } from 'src/app/models/generic';
import { FormService } from 'src/app/services/form.service';
import { DownloadService } from 'src/app/services/download.service';
import { LicenceService } from 'src/app/services/licence.service';
import { ExternalLicenseService } from 'src/app/services/externallicense.service';
import { InformationService } from 'src/app/services/information.service';
import { TruncateService } from 'src/app/services/truncate.service';
import { ModalComponent } from '../modal/modal.component';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BackupService } from 'src/app/services/backup.service';
import { MonitoredCardsService } from 'src/app/services/monitored-cards.service';
import { MonitoredIdentitiesService } from 'src/app/services/monitored-identities.service';
import { AppInstallerService } from 'src/app/services/app-installer.service';
import { TranslateService } from '@ngx-translate/core';
import { ProtectionService } from 'src/app/services/protection.service';
import { ServiceTypeService } from 'src/app/services/service-type.service';
import { PentestingService } from 'src/app/services/pentesting.service';
import { FractelService } from 'src/app/services/fractel.service';
import { Office365Service } from 'src/app/services/office365.service';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { CertificateComponent } from './../certificate/certificate.component';
import { ExpertConnectionComponent } from './../expert-connection/expert-connection.component';
import { InternetComponent } from './../internet/internet.component';
import { DigitalLifeComponent } from './../digital-life/digital-life.component';
import { LanguageService } from 'src/app/services/language.service';
import { CallmebackComponent } from 'src/app/components/custom/callmeback/callmeback.component';
import { LocalService } from 'src/app/services/local.service';

registerLocaleData(es);

import { ExternalappDigitalLegacyService } from 'src/app/services/externalapp-digital-legacy.service';
import { User } from '../../../models/user';
import { ChatmodalComponent } from '../chatmodal/chatmodal.component';
import { Tag } from 'src/app/models/tag';
import { TagLan } from 'src/app/models/tagLan';
import { BitdefendermspService } from 'src/app/services/bitdefendermsp.service';
import { BitdefendermodalComponent } from '../bitdefendermodal/bitdefendermodal.component';
import { CiberalarmaService } from 'src/app/services/ciberalarma.service';
import { DashboardUserService } from 'src/app/services/dashboard-user.service';
import { TranxferService } from 'src/app/services/tranxfer.service';
import { EmailsimulatorformComponent } from '../emailsimulatorform/emailsimulatorform.component';
import { MessageService } from 'src/app/services/message.service';
import { InfoModalComponent } from '../infomodal/infomodal.component';
import { CallComponent } from './../../common/call/call.component';
import { environment } from 'src/environments/environment';
import { ElearningService } from 'src/app/services/elearning.service';
import { DigitalContactComponent } from '../digitalcontact/digitalcontact.component';
import { SurveyService } from 'src/app/services/survey.service';
import { WizardStep } from 'src/app/models/wizardStep';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ServicesComponent {

  public staticContentUrl = environment.STATIC_CONTENT;
  public categories: Generic[];
  public selCategory = 0;
  currentServicesSubscription: Subscription;
  currentServices: Service[];
  modalRef: NgbModalRef;
  public backColor = "";
  public showDownloadText = false
  public showSafariAdvice = false
  public showChromeAdvice = false
  public showDownloadButton = false
  public slastPreviousAccessDate: string;
  public tagsUser: Tag[];
  public tagSelecteds: TagLan[] = [];
  public idCategorySOE = 0;
  public loading = true;
  public loadingTranxfer = false;
  public currentUser: User;
  public currentUserSubscription: Subscription;
  public tranxferstate = 0; //0 sin activar. 1. activado
  public tranxferUrl = "";
  public iterations = 0;

  public showJumbotronBackupItem = false;
  public showJumbotronBitdefenderItem = false;
  public showJumbotronFractelItem = false;
  public showJumbotronAcunetixItem = false;
  public showJumbotronCardsItem = false;
  public showJumbotronIdentitiesItem = false;
  public totalProtected: number;
  public loadingElearning = false;
  public acronisData: WizardStep = new WizardStep;
  constructor(public serviceService: ServicesService,
    public chatService: ChatService,
    public chatDataService: ChatDataService,
    public downloadService: DownloadService,
    public route: Router,
    public userService: UserService,
    public partnerService: PartnerService,
    public formService: FormService,
    public licenseService: LicenceService,
    public externalLicenseService: ExternalLicenseService,
    public informationService: InformationService,
    public backupService: BackupService,
    public monitoredCardsService: MonitoredCardsService,
    public monitoredIdentitiesService: MonitoredIdentitiesService,
    public protectionService: ProtectionService,
    public serviceTypeService: ServiceTypeService,
    public externalAppLegacyService: ExternalappDigitalLegacyService,
    public truncateService: TruncateService,
    public modalService: NgbModal,
    public appInstallerService: AppInstallerService,
    public pentestingService: PentestingService,
    private translate: TranslateService,
    public messageService: MessageService,
    public fractelService: FractelService,
    public bitdefendermspService: BitdefendermspService,
    public surveyService: SurveyService,
    public ciberalarmaService: CiberalarmaService,
    public languageService: LanguageService,
    public dashboardUserService: DashboardUserService,
    public tranxferService: TranxferService,
    public office365Service: Office365Service,
    private localService: LocalService,
    public elearningService: ElearningService
  ) {
    this.currentUserSubscription = this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    localStorage.removeItem('currentService');
    if (this.userService.selSuiteId == undefined) {
      this.route.navigate(["/"]);
      return;
    }

    let categorySelected = localStorage.getItem('categorySelected');
    if (categorySelected != null) {
      this.selCategory = parseInt(categorySelected);
    }
    this.loadData();
  }
  ngAfterContentInit() {
    this.slastPreviousAccessDate = this.userService.currentUserValue.lastPreviousAccessDate.toString().indexOf("Z") >= 0 ?
      this.userService.currentUserValue.lastPreviousAccessDate.toString() : this.userService.currentUserValue.lastPreviousAccessDate.toString() + 'Z';

    this.appInstallerService.showInstallBox() // Chrome - edge
    // Download banner configuration
    if ((this.appInstallerService.isWindows() || this.appInstallerService.isAndroid())
      && this.appInstallerService.isChrome() && !this.appInstallerService.isStandalone()) {

      this.showDownloadText = true;
      this.showDownloadButton = true;
    }

    if (this.appInstallerService.isIos() && this.appInstallerService.isSafari() && !this.appInstallerService.isStandalone()) { // iOs Safari

      this.showSafariAdvice = true;
      this.appInstallerService.showDownloadBox = true;
    }

    if ((this.appInstallerService.isWindows() || this.appInstallerService.isAndroid())
      && !this.appInstallerService.isChrome() && !this.appInstallerService.isStandalone()) { // Windows/Android and no chrome
      this.appInstallerService.showDownloadBox = true;
      this.showChromeAdvice = true;
    }

  }

  async loadData() {
    this.loading = true
    await this.userService.getActivationServices().then(
      result => {
        this.loading = false
        var tempData = result as any
        this.acronisData = tempData.find(e => e.serviceCode === 'CAC')
        if(localStorage.getItem("skipWizard") == null){
          if(tempData.length > 0){
            for (let i = 0; i < tempData.length; i++) {
              if(tempData[i].finalized == false){
                this.route.navigate(['/auto-activation']);
              }
            }
          }
        }
      }
    )

    await this.serviceService.getUserCategories();


    //menu lateral
    await this.serviceService.getUserServicesMenu();
    await this.serviceService.getUserServicesDashboard();

    if (!this.serviceService.userServices) await this.serviceService.getUserServices();
    await this.dashboardUserService.getUserDashboard();

    if (this.serviceService.userServices.findIndex(e => e.typeCode === 'CAC') >= 0) // Load acronis data
    {
      this.showJumbotronBackupItem = true;
      
      if(this.acronisData != undefined){
        if(this.acronisData.finalized == true) await this.backupService.getBackupData();  
      }else{
        await this.backupService.getBackupData();
      }
      let backupData = this.serviceService.userServices.find(e => e.typeCode === 'CAC')
      this.backupService.serviceId = backupData.id
      this.backupService.serviceName = backupData.name
      this.backupService.serviceIcon = backupData.icon
      this.backupService.serviceDesc = backupData.desc
      this.backupService.longDesc = backupData.longDesc
    }

    if (this.serviceService.userServices.findIndex(e => e.typeCode === 'CYB') >= 0) // Load cyberscoring data
    {
      this.serviceService.userServices.forEach(element => {
        if(element.typeCode === 'CYB'){
          this.setLocalStorage('cyberscoringData', element);
        }
      });
    }

    if (this.serviceService.userServices.findIndex(e => e.typeCode === 'CCB') >= 0) // Load Survey data
    {
      let surveyData = this.serviceService.userServices.find(e => e.typeCode === 'CCB')
      this.surveyService.serviceId = surveyData.id
      this.surveyService.serviceName = surveyData.name
      this.surveyService.serviceIcon = surveyData.icon
      this.surveyService.serviceDesc = surveyData.desc
      this.surveyService.longDesc = surveyData.longDesc
    }

    if (this.serviceService.userServices.findIndex(e => e.typeCode === 'CFR') >= 0) // Load Fractel
    {
      this.showJumbotronFractelItem = true;
      await this.fractelService.getFractelData(this.userService.currentUserValue.id);
    }
    if (this.serviceService.userServices.findIndex(e => e.typeCode === 'CPR') >= 0) // Load bitdefender data
    {
      this.showJumbotronBitdefenderItem = true;
      let partnerSuiteId = Number(this.userService.selSuiteId.toString());
      await this.serviceTypeService.loadServiceTypes();
      let serviceTypeId = this.serviceTypeService.types.find(x => x.code == "CPR").id; //Ciberseguridad - Protectio
      await this.protectionService.getProtectionStatus(partnerSuiteId, serviceTypeId);
      await this.protectionService.getProtectionDeviceData(partnerSuiteId, serviceTypeId);
      await this.protectionService.getProtectionDesktopDevices(partnerSuiteId, serviceTypeId);
      await this.protectionService.getProtectionMobileDevices(partnerSuiteId, serviceTypeId);
      this.totalProtected = this.protectionService.desktopDevices.length + this.protectionService.mobileDevices.length
      this.licenseService.getUserLicence(this.userService.selSuiteId, this.serviceService.userServices.find(e => e.typeCode === 'CPR').id,
        this.partnerService.partner.languageId, serviceTypeId)
    }

    if (this.serviceService.userServices.findIndex(e => e.typeCode === 'ACU') >= 0) // Load Acunetix
    {
      this.showJumbotronAcunetixItem = true;
      let partnerSuiteId = Number(this.userService.selSuiteId.toString());
      await this.pentestingService.getPentesting(partnerSuiteId);
      this.pentestingService.loadPentestingDataView();
    }
    if (this.serviceService.userServices.findIndex(e => e.typeCode === 'BMS') >= 0) {
      await this.bitdefendermspService.getUserLicenceMsp(this.userService.selSuiteId.toString());
      this.serviceService.userServices.forEach(element => {
        if(element.typeCode === 'BMS'){
          this.setLocalStorage('bmsData', element);
        }
      });

    }
    if (this.serviceService.userServices.findIndex(e => e.typeCode === 'CII') >= 0) {
      this.showJumbotronIdentitiesItem = true;
      await this.monitoredIdentitiesService.getMonitoredIdentitiesByUser();
      this.monitoredIdentitiesService.canAddIdentities = Number(localStorage.getItem('maxIdentitiesByUser')) <= this.monitoredIdentitiesService.identities.length
      this.serviceService.userServices.forEach(element => {
        if(element.typeCode === 'CII'){
          this.setLocalStorage('identitiesData', element);
        }
      });
    }
    if (this.serviceService.userServices.findIndex(e => e.typeCode === 'TNX') >= 0) // Load Tranxfer data
    {

      await this.tranxferService.GetUserStatusTranxfer(this.currentUser.id).then(
        result => {
          //this.loading = false;
          if (result != "") {
            this.tranxferstate = 1;
            this.tranxferUrl = result;
            // console.log(this.tranxferUrl)
          } else {
            this.tranxferstate = 0;
          }

        }
      )

    }
    if (this.serviceService.userServices.findIndex(e => e.typeCode === 'CIT') >= 0) {
      this.showJumbotronCardsItem = true;
      await this.monitoredCardsService.getMonitoredCardsByUser();
      this.monitoredCardsService.canAddCards = Number(localStorage.getItem('maxCardsByUser')) <= this.monitoredCardsService.cards.length
      let cardsData = this.serviceService.userServices.find(e => e.typeCode === 'CIT')
      this.monitoredCardsService.serviceId = cardsData.id
      this.monitoredCardsService.serviceName = cardsData.name
      this.monitoredCardsService.serviceIcon = cardsData.icon
      this.monitoredCardsService.serviceDesc = cardsData.desc
      this.monitoredCardsService.longDesc = cardsData.longDesc
    }

    localStorage.setItem('suiteColor', this.userService.selSuiteColor);
    localStorage.setItem('suiteGradColor', this.userService.selSuiteGradColor);

    this.userService.currentUserValue.lastPreviousAccessDate
    if (!this.userService.currentUserValue.isAdminUserId) {
      this.serviceService.userServices = this.serviceService.userServices.filter(x => !x.denyEmployeeAccess);
    }

    this.idCategorySOE = this.serviceService.userCategories.find(x => x.code == 'SOE')?.id;
    this.loading = false

    if (this.serviceService.userTags.length > 0) {
      this.serviceService.userTags.forEach(val => this.tagSelecteds.push(Object.assign({}, val)));
      var tagTodos: TagLan = {
        tagId: 0,
        name: this.translate.instant('TAG_ALL'),
        isChecked: true
      };
      this.tagSelecteds.unshift(tagTodos);
    }

  }

  async loadService(id: number, type: string, name: string, icon: string, desc: string, code: string, longDesc: string, chatRequest: boolean, param: string = null, loadLastItem: boolean = null) {
    let currentService = {
      id: id,
      name: name,
      code: code,
      icon: icon,
      desc: desc,
      longDesc: longDesc
    }

    this.setLocalStorage('currentService', currentService);
    localStorage.setItem('partnerSuiteId', this.userService.selSuiteId.toString());
    if (type == "BIT") {
      this.licenseService.serviceId = id;
      this.licenseService.serviceName = name;
      this.licenseService.serviceIcon = icon;
      this.licenseService.serviceDesc = this.truncateService.removeHTML(desc);
      this.licenseService.longDesc = longDesc;
      this.route.navigate(["/license"]);
    }
    if (type == "KAV") {
      this.externalLicenseService.serviceId = id;
      this.externalLicenseService.serviceCode = code;
      this.externalLicenseService.serviceName = name;
      this.externalLicenseService.serviceIcon = icon;
      this.externalLicenseService.serviceDesc = this.truncateService.removeHTML(desc);
      this.externalLicenseService.longDesc = longDesc;
      this.route.navigate(["/externallicense"]);
    }
    if (type == "CHT") {
      this.chatService.serviceId = id;
      this.chatService.serviceName = name;
      this.chatService.serviceIcon = icon;
      this.chatService.serviceDesc = this.truncateService.removeHTML(desc);
      this.chatService.longDesc = longDesc;
      this.chatService.partnerSuiteId = this.userService.selSuiteId.toString();
      // this.route.navigate(["/chat"]);
      if(this.partnerService.browser != 'safari'){
        let ngbModalOptions: NgbModalOptions = {
          backdrop: 'static',
          keyboard: false
        };
        // console.log(ngbModalOptions);
        const modalRef = this.modalService.open(ChatmodalComponent, ngbModalOptions);
        modalRef.componentInstance.name = name;
        modalRef.componentInstance.icon = icon;
      }else{
        await this.chatDataService.loadChat(id, name).then(result => {
          this.checkURL()
        });

      }
    }
    else if (type == "AGN") {
      this.downloadService.serviceId = id;
      this.downloadService.serviceName = name;
      this.downloadService.serviceIcon = icon;
      this.downloadService.serviceDesc = this.truncateService.removeHTML(desc);
      this.downloadService.longDesc = longDesc;
      this.route.navigate(["/agent"]);
    }
    else if (type == "INF") {
      this.informationService.serviceId = id;
      this.informationService.serviceName = name;
      this.informationService.serviceIcon = icon;
      this.informationService.serviceDesc = this.truncateService.removeHTML(desc);
      this.informationService.longDesc = longDesc;
      this.route.navigate(["/info"]);
    }
    else if (type == "BAK" || type == "CAC") {
      this.backupService.serviceId = id;
      this.backupService.serviceName = name;
      this.backupService.serviceIcon = icon;
      this.backupService.serviceDesc = this.truncateService.removeHTML(desc);
      this.backupService.longDesc = longDesc;
      this.backupService.chatRequest = chatRequest;
      if (type == "BAK")
        this.route.navigate(["/backup"]);
      else {
        this.route.navigate(["/backup-ciber"]);
      }
    }
    else if (type == "CFR") {  //Ciberseguridad Fractel
      this.backupService.serviceId = id;
      this.backupService.serviceName = name;
      this.backupService.serviceIcon = icon;
      this.backupService.serviceDesc = this.truncateService.removeHTML(desc);
      this.backupService.longDesc = longDesc;
      this.backupService.chatRequest = chatRequest;
      if (param)
        this.route.navigate(["/lan-analyzer/" + param]);
      else
        this.route.navigate(["/lan-analyzer"]);
    }
    else if (type == "CPR") {
      this.protectionService.serviceId = id;
      this.protectionService.serviceName = name;
      this.protectionService.serviceIcon = icon;
      this.protectionService.serviceDesc = this.truncateService.removeHTML(desc);
      this.protectionService.longDesc = longDesc;
      this.route.navigate(["/protection"]);
    }
    else if (type == "FSK") {
      this.formService.serviceId = id;
      this.formService.serviceName = name;
      this.modalService.open(DigitalContactComponent);
    }
    else if (type == "FRC" || type == "FRD" || type == "FRI" || type == "FRV" || type == "FCP" || type == "ATS") {
      this.formService.serviceId = id;
      this.formService.serviceName = name;
      this.formService.serviceIcon = icon;
      this.formService.longDesc = longDesc;
      this.formService.serviceDesc = this.truncateService.removeHTML(desc);
      if (type == "FRC") {
        this.modalService.open(CertificateComponent);
      }
      else if (type == "FRV") {
        this.modalService.open(DigitalLifeComponent);
      }
      else if (type == "FRI") {
        this.modalService.open(InternetComponent);
      }
      else if (type == "FCP") {
        this.modalService.open(ExpertConnectionComponent);
      }
      else if (type == "ATS") {
        this.modalService.open(EmailsimulatorformComponent);
      }
    }
    else if (type == "CIT") {
      this.monitoredCardsService.serviceId = id;
      this.monitoredCardsService.serviceName = name;
      this.monitoredCardsService.serviceIcon = icon;
      this.monitoredCardsService.serviceDesc = this.truncateService.removeHTML(desc);
      this.monitoredCardsService.longDesc = longDesc;
      this.route.navigate(["/cyberalarm/monitored-cards"]);
    }
    else if (type == "CII") {
      this.monitoredIdentitiesService.serviceId = id;
      this.monitoredIdentitiesService.serviceName = name;
      this.monitoredIdentitiesService.serviceIcon = icon;
      this.monitoredIdentitiesService.serviceDesc = this.truncateService.removeHTML(desc);
      this.monitoredIdentitiesService.longDesc = longDesc;
      this.route.navigate(["/cyberalarm/monitored-identities"]);
    }
    else if (type == "EVD" || type == "ELD" || type == "ETD") {
      this.externalAppLegacyService.serviceId = id;
      this.externalAppLegacyService.serviceName = name;
      this.externalAppLegacyService.serviceIcon = icon;
      this.externalAppLegacyService.serviceDesc = this.truncateService.removeHTML(desc);
      this.externalAppLegacyService.longDesc = longDesc;
      this.externalAppLegacyService.serviceType = type;
      localStorage.setItem('serviceType', type);
      this.route.navigate(["/external-app/digital-legacy"]);
    }
    else if (type == "BIS") {
      this.licenseService.serviceId = id;
      this.licenseService.serviceName = name;
      this.licenseService.serviceIcon = icon;
      this.licenseService.serviceDesc = this.truncateService.removeHTML(desc);
      this.licenseService.longDesc = longDesc;
      this.route.navigate(["/licenseinternet"]);
    }
    else if (type == "ACU") {
      this.pentestingService.serviceId = id;
      this.pentestingService.serviceName = name;
      this.pentestingService.serviceIcon = icon;
      this.pentestingService.serviceDesc = this.truncateService.removeHTML(desc);
      this.pentestingService.longDesc = longDesc;
      if (param)
        this.route.navigate(["/pentesting/" + param]);
      else
        this.route.navigate(["/pentesting"]);
    }
    else if (type == "365") {
      this.licenseService.serviceId = id;
      this.licenseService.serviceName = name;
      this.licenseService.serviceIcon = icon;
      this.licenseService.serviceDesc = this.truncateService.removeHTML(desc);
      this.licenseService.longDesc = longDesc;
      var license = false
      await this.office365Service.GetUserOffice365Licence().then(
        result => {
          license = this.office365Service.activated
          if(license == false){
            var tempButtons = [
              {

                name: this.translate.instant('OFFICE365.ACTIVAR_BTN1'),
                action : "submit",
                type: "btn btn-primary"
              },
              {
                name: this.translate.instant('OFFICE365.ACTIVAR_BTN2'),
                action: "",
                type: "btn btn-outline-modal"
              }
            ];
            var tempInputs = [
              {
                name: "subscription",
                type: "select",
                label: "OFFICE365.ACTIVAR_LABEL1",
                options: [
                  {
                    des: "OFFICE365.ACTIVAR_OPTION1",
                    value: "true"
                  },
                  {
                    des: "OFFICE365.ACTIVAR_OPTION2",
                    value: "false"
                  }
                ]
              }
            ];

            const text1 = this.translate.instant('OFFICE365.ACTIVAR_TEXT1');
            const text2 = this.translate.instant('OFFICE365.ACTIVAR_TEXT2');
            const text3 = this.translate.instant('OFFICE365.ACTIVAR_TEXT3');
            const tempDes = `<div class=\"row mr-0 ml-0\"><div class=\"col-md-12 col-sm-12 prod-col\"><p class=\"prod-text\">${text1}</p></div></div>`;
            const tempSubDes = `<div class=\"row mr-0 ml-0\"><div class=\"col-md-12 col-sm-12 prod-col\"><div class=\"mt-3\"><ul><li class=\"prod-text\">${text2}</li><li class=\"prod-text\">${text3}</li></ul></div></div></div>`
            const tempIcon = "myicons-office365"
            const tempTittle = this.translate.instant('OFFICE365.ACTIVAR_TITULO');
            this.modalRef = this.modalService.open(ModalComponent);
            this.modalRef.componentInstance.name = tempTittle;
            this.modalRef.componentInstance.desc = tempDes;
            this.modalRef.componentInstance.subDesc = tempSubDes;
            this.modalRef.componentInstance.icon = tempIcon;
            this.modalRef.componentInstance.formInputs = tempInputs;
            this.modalRef.componentInstance.buttons = tempButtons;
            this.modalRef.componentInstance.submitted.subscribe(res => this.subscribeOffice(res));
          }else{
            window.open('https://login.microsoftonline.com/')
          }
      });

    }
    else if (type == "BMS") {
      this.licenseService.serviceId = id;
      this.licenseService.serviceName = name;
      this.licenseService.serviceIcon = icon;
      this.licenseService.serviceDesc = this.truncateService.removeHTML(desc);
      this.licenseService.longDesc = longDesc;
      this.route.navigate(["/bitdefendermsp"]);
    }
    else if (type == "CYB") {
      this.route.navigate(["/cyberscoring"]);
      //}else if (type == "TNX") {

      //this.tranxferstate = Number(this.tranxferService.GetUserStatusTranxfer(this.currentUser.id));
      //this.route.navigate(["/tranxfer"]);
    }
    else if (type == "CIB") {
      this.ciberalarmaService.serviceId = id;
      this.ciberalarmaService.serviceCode = code;
      this.ciberalarmaService.serviceName = name;
      this.ciberalarmaService.serviceIcon = icon;
      this.ciberalarmaService.serviceDesc = this.truncateService.removeHTML(desc);
      this.ciberalarmaService.longDesc = longDesc;
      if(code=="CSN")
        this.route.navigate(["/navegacionsegura"]);
      else if(code=="CSG")
        this.route.navigate(["/geolocalizacion"]);
    }
  }

  async checkURL(){
    const timer = ms => new Promise(res => setTimeout(res, ms))
    if(!this.chatDataService.url){
      if(this.iterations < 10){
        this.iterations += this.iterations;
        await timer(2000);
        this.checkURL();
      }else{
        console.log("ERROR: There is no Url to open chat")
      }
    }else{
      let windowObjectReference = window
      let windowFeatures = "popup, width=600, height=415, resizable=0, location=0, toolbar=0, status=0";
      windowObjectReference.open(this.chatDataService.url, "Startchat", windowFeatures)
    }
  }
  async subscribeOffice(option){
    await this.office365Service.SetUserOffice365Licence(option.subscription.value).then(
      result => {
        var activate = result
        this.modalRef.close()
        if (activate != ""){
          const checkImg = `${environment.STATIC_CONTENT}img/success.png`
          const text4 = this.translate.instant('OFFICE365.ACTIVAR_TEXT4');
          const tempIcon = "myicons-office365"
          const tempTittle = this.translate.instant('OFFICE365.ACTIVAR_TITULO');
          const button = [
            {
              name: this.translate.instant('OFFICE365.ACTIVAR_BTN3'),
              action: "",
              type: "btn btn-primary"
            }
          ];
          const desc = `<div class=\"row mr-0 ml-0\"><div class=\"col-md-12 col-sm-12 prod-col\"><img class=\"modal-img\" src=\"${checkImg}\"><p class=\"prod-text centered mt-5\">${text4}</p></div></div>`
          this.modalRef = this.modalService.open(ModalComponent);
          this.modalRef.componentInstance.icon = tempIcon;
          this.modalRef.componentInstance.name = tempTittle;
          this.modalRef.componentInstance.desc = desc;
          this.modalRef.componentInstance.buttons = button;
        }
    });
  }

  loadBitdefenderPopup(serviceId: number, serviceTypeCode: string) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    const modalRef = this.modalService.open(BitdefendermodalComponent, ngbModalOptions);
    modalRef.componentInstance.isBMS = serviceTypeCode === 'BMS'
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  goToAcronisPage() {
    window.open("https://eu-cloud.acronis.com/login", '_blank');
  }


  filterCategory = (service: Service) => {
    localStorage.setItem('categorySelected', this.selCategory.toString())
    if (service.categoryId == this.idCategorySOE) {
      var isCategory = (this.selCategory == 0 || service.categoryId == this.selCategory);
      var isTag = false;
      if (this.tagSelecteds.length > 0 && this.tagSelecteds.find(x => x.tagId == 0).isChecked)
        isTag = true;
      else if (this.tagSelecteds.length > 0) {
        service.tags.forEach(element => {
          if (this.tagSelecteds.find(x => x.tagId == element.tagId).isChecked)
            isTag = true;
        });
      }
      else
        isTag = true;
      return (isCategory && isTag);
    }
    else
      return (this.selCategory == 0 || service.categoryId == this.selCategory);
  }

  async activateTranxferUser() {
    if(this.userService.currentUserValue.email != null)
    {
    this.loadingTranxfer = true;
    // this.translate.get('TRANXFER.REQUEST_SERVICE').subscribe(res => this.messageService.add(res, "ok"));
    await this.tranxferService.ActivateUserTranxfer(this.currentUser.id, this.currentUser.name, this.currentUser.surname, this.currentUser.email, this.currentUser.languageCode).then(
      result => {
        this.loadingTranxfer = false;
        if (result != "") {
          this.translate.get('TRANXFER.REQUEST_OK').subscribe(res => this.messageService.add(res, "ok"));
          this.tranxferstate = 1;
          this.tranxferUrl = result;
        } else {
          this.translate.get('TRANXFER.REQUEST_ERROR').subscribe(res => { this.messageService.add(res, "error") });
          this.tranxferstate = 0;
        }
      }
      );
    }
    else
    {
      const modalRef = this.modalService.open(InfoModalComponent);
      modalRef.componentInstance.message = this.translate.instant('EMAIL_REQUIRED');
    }
  }

  goToTranxfer() {
    window.open(this.tranxferUrl, "_blank");
  }

  getDashboardServices() {
    let filteredServices = [];
    if (this.serviceService && this.serviceService.userServices) {
      filteredServices = this.serviceService.userServices.filter(x => ['CAC', 'CPR', 'ACU', 'CFR', 'BMS', 'GRA'].includes(x.typeCode)); // Monitored services
      if (this.serviceService.userServices.find(x => x.typeCode === "CHT")) {
        filteredServices.unshift(this.serviceService.userServices.find(x => x.typeCode === "CHT"));
      }
    }

    return filteredServices;
  }

  addNewCompanyUser() {
    if (this.currentUser.companyUser.pendingUsers < 1) {
      const modalRef = this.modalService.open(InfoModalComponent);
      modalRef.componentInstance.message = this.translate.instant('COMP_USER_LIST.VALIDATE_USER');
      return;
    }
    else {
      this.route.navigate(['/add-user', this.userService.currentUserValue.id]);
    }
  }

  open(name: string, desc: string, icon: string) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.desc = desc;
    modalRef.componentInstance.icon = icon;
  }

  checkProfile() {
    if (this.currentUser.isAdminUserId && this.currentUser.companyUser.maxLicense > 1) {
      this.route.navigate(['/user-list']);
      return;
    }
    else {
      this.route.navigate(['/profile']);
      return;
    }
  }

  scrollUp() {
    window.scroll(0, 0);
  }

  codeCategorySelected() {
    var code = "";
    if (this.selCategory != 0)
      var code = this.serviceService.userCategories.find(x => x.id == this.selCategory).code;
    return code;
  }

  onChangeTag($event) {
    // console.log($event.target.id);
    // console.log(JSON.stringify(this.tagSelecteds));
    var tagIdClicked = parseInt($event.target.id);
    if (tagIdClicked == 0) {
      if ($event.target.checked) {
        this.tagSelecteds.forEach(element => {
          if (element.tagId != 0)
            element.isChecked = false;
        });
      }
      this.tagSelecteds.find(x => x.tagId == 0).isChecked = true;
    }
    else {
      // console.log($event.target.checked);
      if ($event.target.checked) {
        this.tagSelecteds.find(x => x.tagId == tagIdClicked).isChecked = true;
        this.tagSelecteds.find(x => x.tagId == 0).isChecked = false;
      }
      else {
        this.tagSelecteds.find(x => x.tagId == tagIdClicked).isChecked = false;
        var seleccionados = 0;
        this.tagSelecteds.forEach(element => {
          if (element.tagId != 0 && element.isChecked)
            seleccionados++;
        });
        // console.log("seleccionados: "+seleccionados);
        if (seleccionados == 0)
          this.tagSelecteds.find(x => x.tagId == 0).isChecked = true;
      }
    }
    // console.log(JSON.stringify(this.tagSelecteds));
  }

  getTagsString(tagsService) {
    var tagsString = "";
    tagsService.forEach((element, index) => {
      tagsString += element.name;
      if (index < tagsService.length - 1)
        tagsString += ", ";
    });
    return tagsString;
  }

  getCategoryName(categoryId) {
    return this.serviceService.userCategories.find(x => x.id == categoryId).name;
  }
  getCategoryIcon(categoryId) {
    return this.serviceService.userCategories.find(x => x.id == categoryId).icon;
  }
  getLastFractel(lastFractel) {
    var today = new Date();
    var last = new Date(lastFractel);
    // To calculate the time difference of two dates
    var Difference_In_Time = today.getTime() - last.getTime();
    // To calculate the no. of days between two dates
    var Difference_In_Days = Math.ceil(Difference_In_Time / (1000 * 3600 * 24));
    if (Difference_In_Days > 0)
      // return "Han pasado "+Difference_In_Days+" días";
      return this.translate.instant('CYBERSECURITY.FRACTEL.ITS_BEEN') + " " + Difference_In_Days + " " + this.translate.instant('CYBERSECURITY.FRACTEL.DAYS');
    else
      return this.translate.instant('CYBERSECURITY.FRACTEL.TODAY');
  }
  getDaysPentesting(lastPentesting) {
    var daysConfig = 0;
    if (this.pentestingService.externalAppAcunetixList != null && this.pentestingService.externalAppAcunetixList[0].daysConfig != null)
      daysConfig = this.pentestingService.externalAppAcunetixList[0].daysConfig;

    var today = new Date();
    var last = new Date(lastPentesting);
    // To calculate the time difference of two dates
    var Difference_In_Time = today.getTime() - last.getTime();
    // To calculate the no. of days between two dates
    var Difference_In_Days = Math.floor(Difference_In_Time / (1000 * 3600 * 24));

    if (daysConfig > 0) {
      var nextPentesting = daysConfig - Difference_In_Days;
      if (nextPentesting > 0)
        return this.translate.instant('CYBERSECURITY.PENTESTING.WITHIN') + " " + nextPentesting + " " + this.translate.instant('CYBERSECURITY.PENTESTING.DAYS');
      else
        return this.translate.instant('CYBERSECURITY.PENTESTING.TODAY');
    }
    else
      return this.translate.instant('CYBERSECURITY.PENTESTING.NO_NEXT_TEST');
  }
  async abrirC2C() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size:'sm',
      windowClass:"dialpad"
    };
    const modalRef = this.modalService.open(CallComponent, ngbModalOptions);
      modalRef.componentInstance.name = "Call";
      modalRef.componentInstance.icon = "icon-call-me-back";
  }

  abrirCMB() {
    const modalRef = this.modalService.open(CallmebackComponent);
    modalRef.componentInstance.name = "Call me back";
    modalRef.componentInstance.icon = "icon-call-me-back";
  }

  setLocalStorage(key, data) {
    this.localService.setJsonValue(key, data);
  }

  openSSOElearning(){
    if(this.userService.currentUserValue.email != null)
    {
      this.loadingElearning = true;
      this.elearningService.OpenSso().then(
        result => {
          this.loadingElearning = false;
        }
      );
    }
    else
    {
      const modalRef = this.modalService.open(InfoModalComponent);
      modalRef.componentInstance.message = this.translate.instant('EMAIL_REQUIRED');
    }
  }

}
