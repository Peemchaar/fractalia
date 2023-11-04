import { AfterViewInit, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceService } from 'src/app/services/licence.service';
import { MessageService } from 'src/app/services/message.service';
import { PartnerService } from 'src/app/services/partner.service';
import { TranslateService } from '@ngx-translate/core';
import { TruncateService } from 'src/app/services/truncate.service';
import { UserService } from 'src/app/services/user.service';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';
import * as Chart from 'chart.js';
import { BitdefendermspService } from 'src/app/services/bitdefendermsp.service';
import { User } from 'src/app/models/user';
import { AppConstants } from 'src/app/shared/app.constans';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BitdefendermodalComponent } from '../bitdefendermodal/bitdefendermodal.component';
import { LocalService } from 'src/app/services/local.service';
import { ModalComponent } from '../modal/modal.component';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MspmodalComponent } from '../automatic-activation/help-modal/msp-modal/mspmodal.component';
import { SuiteService } from 'src/app/services/suite.service';

@Component({
  selector: 'app-bitdefendermsp',
  templateUrl: './bitdefendermsp.component.html',
  styleUrls: ['./bitdefendermsp.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BitdefendermspComponent implements OnInit, AfterViewInit{
  @Input() serviceCard?: boolean = false;
  public staticContentUrl = environment.STATIC_CONTENT;
  public enrol_url: string = "";
  public state:number = 0;
  public isSSO:boolean = false;
  public deviceTotal:number;
  public deviceInstall:number;
  loading = false;
  public partnerSuiteId:string;

  public chartLabels: Label[] = [];
  public chartData = [];
  public doughnutChartData: MultiDataSet = [this.chartData];
  public chartType: ChartType = 'doughnut';
  public doughnutColors: any[] = [{ backgroundColor: ["#1bb77a","#b1b1b1"] }];

  public barData: number[] = [];
  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartLegend = false;
  public barChartData = [];
  public barChartOptions;
  public user:User;
  public bitDefenderMspConst;
  public license: '';
  public isBMS: boolean = true;
  public qrImage = '';
  public qrAlt = '';
  public isMobile = false;
  public osValue = -1;

  public globalLoading: boolean = false;
  public mobile: boolean = false;
  public tablet: boolean = false;
  screenWidth$: BehaviorSubject<number> = new BehaviorSubject(null);
  private readonly unsubscriber$: Subject<any> = new Subject();

  constructor(public licenseService: LicenceService,
    public userService: UserService,
    public truncateService: TruncateService,
    private router: Router,
    private partnerService: PartnerService,
    private suiteService: SuiteService,
    private messageService: MessageService,
    private translate: TranslateService,
    public bitdefendermspService: BitdefendermspService,
    public modalService: NgbModal,
    private localService: LocalService) {

    this.user = Object.assign({}, this.userService.currentUserValue);
    this.user.partnerName
    this.bitDefenderMspConst = AppConstants.BitDefenderMspConst;

    Chart.defaults.global.tooltips.enabled = false;
    Chart.defaults.global.animation.duration = 2000;
    Chart.defaults.global.legend.display = false;

    this.barChartOptions = {
      responsive: true,
      scales: {
        xAxes: [{
          ticks: {
            callback: function (value) {
              if (value.length > 10)
                return value.substr(0, 10) + "..."; //truncate
              else
                return value

            },
          }
        }],
        yAxes: [{
        }]
      },
      tooltips: {
        enabled: true,
        mode: 'label',
        callbacks: {
          title: function (tooltipItems, data) {
            var idx = tooltipItems[0].index;

            if (tooltipItems[0].value == 0.5) {
              tooltipItems[0].value = 0
            }

            var days = translate.instant('CYBERSECURITY.PROTECTION.DAY')
            tooltipItems[0].value += ' ' + days
            return data.labels[idx];
          }
        }
      }
    };

    if (licenseService.serviceName) {
      if (this.getLocalStorage('currentService') == null) {
        this.router.navigate(['/']);
        return;
      }
      else { // If refresh
        let suiteColor = this.suiteService.suites[0].color.toString()
        let suiteGradColor = this.suiteService.suites[0].gradColor.toString()
        this.partnerSuiteId = this.suiteService.suites[0].id.toString()
        let service = this.getLocalStorage('currentService');
        userService.selSuiteColor = suiteColor;
        userService.selSuiteGradColor = suiteGradColor;
        licenseService.serviceId = service.id;
        licenseService.serviceName = service.name;
        licenseService.serviceIcon = service.icon;
        licenseService.serviceDesc = service.desc;
        licenseService.longDesc = service.longDesc;
        licenseService.code = service.code;
        this.checkLicence(this.partnerSuiteId);
      }
    }
    else { // If refresh
      let suiteColor = this.suiteService.suites[0].color.toString()
      let suiteGradColor = this.suiteService.suites[0].gradColor.toString()
      this.partnerSuiteId = this.suiteService.suites[0].id.toString()
      let service = this.getLocalStorage('currentService');
      userService.selSuiteColor = suiteColor;
      userService.selSuiteGradColor = suiteGradColor;
      this.checkLicence(this.partnerSuiteId);
    }
  }

  ngOnInit(){
    //this.globalLoading = true;
    this.user = Object.assign({}, this.userService.currentUserValue);
    if(this.getLocalStorage('bmsData') != null ){
      let service = this.getLocalStorage('bmsData');
      this.bitdefendermspService.serviceId = service.id;
      this.bitdefendermspService.serviceName = service.name;
      this.bitdefendermspService.serviceIcon = service.icon;
      this.bitdefendermspService.serviceDesc = service.desc;
      this.bitdefendermspService.longDesc = service.longDesc;
    }else{
      this.router.navigate(['/']);
    }
    //this.globalLoading = false;
    this._setScreenWidth(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(300),
        takeUntil(this.unsubscriber$)
      ).subscribe((evt: any) => {
        this._setScreenWidth(evt.target.innerWidth);

      });
  }

  ngAfterViewInit(){
    this.checkLicence(this.partnerSuiteId);
  }

  private _setScreenWidth(width: number): void {
    this.screenWidth$.next(width);
    (this.screenWidth$.value > 760) ? this.mobile = false : this.mobile = true;
    (this.screenWidth$.value > 992) ? this.tablet = false : this.tablet = true;
  }

  async checkLicence(partnerSuiteId: string, step?:number) {

    if(!partnerSuiteId && !this.suiteService.suites[0].id) return;
    this.loading = !this.loading;
    await this.bitdefendermspService.getUserLicenceMsp(this.suiteService.suites[0].id.toString()).then(() =>{
      const bitdenderResponse = this.bitdefendermspService.bitdefenderResponse;
      const state = bitdenderResponse.state;
      this.isSSO = bitdenderResponse.isSSO>0;
      if(bitdenderResponse.state=="request")
        this.state=0;
      else if(bitdenderResponse.state=="pending"){
        if(step && step == 2){
          this.messageService.add(this.translate.instant('WIZARD.ERROR_PASS_STEP'), "error");
        }else{
          this.state=1;
          this.enrol_url= bitdenderResponse.enrolUrl.value;
        }
      }
      else if(bitdenderResponse.state=="active"){
        if(step && step == 3){
          this.messageService.add(this.translate.instant('WIZARD.ERROR_PASS_STEP'), "error");
        }else{
          this.state=2;
        }
      }
      else if(bitdenderResponse.state=="activeDevice"){
        this.state=3;
        this.barData = [];
        this.barChartData = [];

      if(bitdenderResponse.subscriptions!=null && bitdenderResponse.subscriptions[0]!=null)
      {
        const aSubsId = bitdenderResponse.subscriptions[0].productId.split("-");
        const nDevicexProducto = aSubsId.find(x=>x.includes("device")).replace("device","");
        this.deviceTotal = +nDevicexProducto;
        this.deviceInstall = bitdenderResponse.devices.length;
        this.chartData.push(this.deviceInstall);
        this.chartData.push(this.deviceTotal-this.deviceInstall);

      }
      for(let device of bitdenderResponse.devices)
      {
        // if(device.hasOwnProperty('taskScan')){
        if(device.taskScan!=null){
          this.barData.push(device.taskScan.days);
        }
        else this.barData.push(0);
        this.barChartLabels.push(device.displayName);

      }
      this.barChartData = [{ data: this.barData }];
      }
      else if(bitdenderResponse.state=="error"){
        this.state=0;
        this.messageService.add(this.translate.instant('COMP_BITDEFENDERMSP.ERROR_SERVICE'), "error")
      }
      this.loading = !this.loading;
     });
  }

  async setUserLicenceMSP() {
    this.loading = true;
    localStorage.setItem('partnerSuiteId', this.userService.selSuiteId.toString())
    let partnerSuiteId = localStorage.getItem('partnerSuiteId');
    let lang:string = this.user.languageCode;
    lang = lang.replace('-','_');
    if(this.bitDefenderMspConst.languages.indexOf(lang)>-1){
      await this.bitdefendermspService.setUserLicenceMSP(partnerSuiteId,lang , this.partnerService.partner.code).then(result=>{
        this.loading = false;
        if(result.subscriberId && result.enrolUrl){
          if(result.enrolUrl!=null && result.enrolUrl.value==""){
            this.state = 1;
            this.isSSO = true;
          }
          else{
            this.enrol_url= result.enrolUrl.value;
            this.state = 1;
          }
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
      this.loading = false;
    }

  }
  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  loadBitdefenderPopup(serviceId?: number, serviceTypeCode?: string) {
/*     let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    const modalRef = this.modalService.open(BitdefendermodalComponent, ngbModalOptions);
    modalRef.componentInstance.isBMS = serviceTypeCode === 'BMS' */

    window.open("https://central.bitdefender.com/dashboard", "_blank");
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

  public openBMSTab(){
    window.open(this.enrol_url, '_blank')
  }

  openBMSPage(){
    window.open(this.bitdefendermspService.access_central_url, '_blank')
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
}
