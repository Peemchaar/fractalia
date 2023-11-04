import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ChartType } from 'chart.js';
import { DatePipe } from '@angular/common'
import { CyberscoringCompanyInfo } from 'src/app/models/cyberscoring/cyberscoringCompanyInfo';
import { CyberscoringSector } from 'src/app/models/cyberscoring/cyberscoringSector';
import { CyberscoringService } from 'src/app/services/cyberscoring.service';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';
import { PartnerService } from 'src/app/services/partner.service';
import { UserValidator } from 'src/app/validators/user.validator';
import { DomainValidator } from 'src/app/validators/domain.validator';
import { LocalService } from 'src/app/services/local.service';
import { ModalComponent } from '../modal/modal.component';
import { environment } from 'src/environments/environment';
import { FamilyUser } from 'src/app/models/familyUser';
import { CbyFreemiumAlertComponent } from '../../cby-freemium-alert/cby-freemium-alert.component';

@Component({
  selector: 'app-cyberscoring',
  templateUrl: './cyberscoring.component.html',
  styleUrls: ['./cyberscoring.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CyberscoringComponent implements OnInit {
  @Input() serviceCard?: boolean = false;
  @ViewChild('email') email: ElementRef;
  @ViewChild('domain') domain: ElementRef;
  public staticContentUrl = environment.STATIC_CONTENT;
  public sectors: CyberscoringSector[] = [];
  public loading = false;
  public globalLoading = false;
  public data: CyberscoringCompanyInfo = new CyberscoringCompanyInfo();
  public showMessage: boolean = false;
  public errorDomain: boolean = false;
  public errorBusinessName: boolean = false;
  public errorCnae: boolean = false;
  public errorNoDomain: boolean = false;
  public message: string = "";
  public readonlyFields = false;
  public success: boolean = false
  public hasHistory: boolean = false;
  public analyzing: boolean = false;
  public sector: string;
  public lastDate: Date;
  public nextDate: Date;
  public isMinDate: boolean = false;
  public terms = false;
  public canValidate = false;
  public lastReport: string;
  public editModal: boolean = false;
  public cantEdit: boolean = false;
  public freemiun: boolean = true;
  public freeModal: boolean = false;
  public poor = "< 700";
  public fair = "> 700";
  public good = "> 900";


  // Gauge chart
  public gaugeType = "semi";
  public lastScore = -1;
  public gaugeMax = 1000;
  public gaugeMin = 0;
  public gaugeMessage = 0;

  public thresholdConfig = {
    '0': { color: '#EB1919' },
    '700': { color: '#FFC507' },
    '800': { color: '#FFC507' },
    '900': { color: '#14BD44' },
    '1000': { color: '#14BD44' }
  };

  public markerConfig = {
    "0": { color: '#EB1919', size: 8, label: '0', type: 'line'},
    "100": { color: '#EB1919', size: 4, type: 'line'},
    "200": { color: '#EB1919', size: 4, type: 'line'},
    "300": { color: '#EB1919', size: 4, type: 'line'},
    "400": { color: '#EB1919', size: 4, type: 'line'},
    "500": { color: '#EB1919', size: 8, type: 'line'},
    "600": { color: '#EB1919', size: 4, type: 'line'},
    "700": { color: '#FFC507', size: 4, type: 'line'},
    "800": { color: '#FFC507', size: 4, type: 'line'},
    "900": { color: '#14BD44', size: 4, type: 'line'},
    "1000": { color: '#14BD44', size: 8, label: '1000', type: 'line'}
  }
  public gaugeLabel = '';

  // Historical chart
  public chartDataset: Array<any> = [];
  public chartType: ChartType = 'line';
  public chartColor: any[] = [{ backgroundColor: ["#ff0062"] }];

  public chartOptions = {
    scales: {
      xAxes: [{
        ticks: {
          callback: function (value) {
            return value
          },
        }
      }],

      yAxes: [{
        ticks: {
           steps : 10,
           stepValue : 100,
           max : 1000,
           min: 0
         }
     }]
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: true,
      mode: 'label',
      callbacks: {
        title: function (tooltipItems, data) {
          var idx = tooltipItems[0].index;
          return data.labels[idx];
        }
      }
    }
  };

  public chartLabels: Array<any> = [];

  constructor(public cyberscoringService: CyberscoringService,
    public router: Router,
    public userService: UserService,
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public translate: TranslateService,
    public messageService: MessageService,
    public partnerService: PartnerService,
    public datepipe: DatePipe,
    private localService: LocalService) { }

  async ngOnInit() {
    this.globalLoading = true;
    if(this.getLocalStorage('cyberscoringData') != null ){
      let service = this.getLocalStorage('cyberscoringData');
      this.cyberscoringService.serviceId = service.id;
      this.cyberscoringService.serviceName = service.name;
      this.cyberscoringService.serviceIcon = service.icon;
      this.cyberscoringService.serviceDesc = service.desc;
      this.cyberscoringService.longDesc = service.longDesc;
    }else{
      if (this.cyberscoringService.serviceName) {

        if (this.getLocalStorage('currentService') == null) {
          this.router.navigate(['/']);
          return;
        }
        else { // If refresh
          let service = this.getLocalStorage('currentService');
          this.cyberscoringService.serviceId = service.id;
          this.cyberscoringService.serviceName = service.name;
          this.cyberscoringService.serviceIcon = service.icon;
          this.cyberscoringService.serviceDesc = service.desc;
          this.cyberscoringService.longDesc = service.longDesc;
        }
      }else {
        let service = this.getLocalStorage('currentService');
        if (!service) {
          this.router.navigate(['/']);
          return;
        }
        this.cyberscoringService.serviceId = service.id;
        this.cyberscoringService.serviceName = service.name;
        this.cyberscoringService.serviceIcon = service.icon;
        this.cyberscoringService.serviceDesc = service.desc;
        this.cyberscoringService.longDesc = service.longDesc;
      }
    }


    await this.cyberscoringService.getSectors().then((res) => {
      res.forEach(element => {
        this.sectors.push(element);
        this.sectors.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      });
      this.getCompanyData();
    })



  }

  getCompanyData(){
    this.cyberscoringService.getCompany().then(res => {
      this.globalLoading = false;
      if (res) {
        this.data = res;
        (this.data.product == 0)? this.freemiun = true : this.freemiun = false;
        (this.data.status == 1 || this.data.nextStatus == 1)? this.analyzing = true : this.analyzing = false;
        console.log('fremium', this.freemiun)
        if (this.data.historicalRating.length > 0) {
          this.hasHistory = true;
          this.sector = this.sectors.find(x => x.id === this.data.cnae).name
          var data: any[] = [];
          data = this.data.historicalRating.map(e => {
            return this.datepipe.transform(new Date(e.endDate), 'yyyy-MM-dd');
          })
          this.chartLabels = data;
          this.nextDate = new Date(this.data.nextAnalysisDate);
          this.isMinDate = '0001-01-01T00:00:00' === this.data.nextAnalysisDate;
          this.lastDate = new Date(this.data.historicalRating[this.data.historicalRating.length - 1].endDate);
          this.lastReport = this.data.reports[this.data.reports.length - 1].pdfLink;
          data = this.data.historicalRating.map(e => {
            return e.score;
          })
          this.chartDataset.push({ data: data, label: "Rating" })

          this.lastScore = this.data.historicalRating[this.data.historicalRating.length - 1].score;

          this.translate.get('HELLO').toPromise().then((e) => {
            switch (true) {
              case this.lastScore >= 900:
                // this.gaugeLabel = this.translate.instant('CYBERSCORING.EXCELLENT');
                this.gaugeLabel = this.translate.instant('CYBERSCORING.GOOD');
                this.gaugeMessage = 3;
                break;
              case this.lastScore >= 700:
                // this.gaugeLabel = this.translate.instant('CYBERSCORING.GOOD');
                this.gaugeLabel = this.translate.instant('CYBERSCORING.FAIR');
                this.gaugeMessage = 2
                break;
              case this.lastScore >= 600:
                // this.gaugeLabel = this.translate.instant('CYBERSCORING.FAIR');
                this.gaugeLabel = this.translate.instant('CYBERSCORING.POOR');
                this.gaugeMessage = 1
                break;
              case this.lastScore >= 300:
                this.gaugeLabel = this.translate.instant('CYBERSCORING.POOR');
                this.gaugeMessage = 1
                break;
              default:
                // this.gaugeLabel = this.translate.instant('CYBERSCORING.FIRE');
                this.gaugeLabel = this.translate.instant('CYBERSCORING.POOR');
                this.gaugeMessage = 1
                break;
            }
          }
          )
        }
        //this.readonlyFields = this.data.alreadyCreated;
      }
    })
  }

  async createCompany() {
    this.showMessage = false;
    this.loading = true;
    // validating all domains
    this.data.domains = this.data.domains;
    this.data.domains.forEach((element) => {
      if (!DomainValidator.checkIsValidDomain(element)) {
        this.message = this.translate.instant('CYBERSCORING.DOMAIN_ERROR');
        this.showMessage = true;
        this.loading = false;
      }
    })
    if (this.showMessage) return;

    // validating email
    // if (UserValidator.validEmail(this.data.emails) == null) {
    //   this.message = this.translate.instant('MULTIUSER.VALIDATION4'); this.showMessage = true; this.loading = false; return;
    // }
    (await this.cyberscoringService.createCompany(this.data)).subscribe((response) => {
      if (response.status === 200) {
        this.messageService.add(this.translate.instant('CYBERSCORING.CREATECOMPANY_OK'), "ok");
        this.loading = false;
        this.readonlyFields = true;
        this.success = true;
        this.getCompanyData();
      }
      else {
        this.messageService.add(this.translate.instant('CYBERSCORING.CREATECOMPANY_ERROR'), "error");
        this.message = this.translate.instant('CYBERSCORING.CREATECOMPANY_ERROR');
        this.showMessage = true;
        this.loading = false;
      }
    })
  }
  editMode(){
    this.cantEdit = false;
    if(this.data.nextStatus == 0){
      this.readonlyFields = false;
      this.editModal = true;
      this.toggleValidate()
      // this.data.businessName = this.data.nextBusinessName;
      // this.data.cnae = this.data.nextCnae;
      // this.data.domains = this.data.nextDomains;
    }else{
      this.cantEdit = true;
    }
  }

  toggleFreeModal(){
    this.freeModal = true;
  }

  toggleValidate(){
    this.canValidate = !this.canValidate;
    this.success = false
  }

  goToReports () {
    document.getElementById('header-list').scrollIntoView();
  }

  goCyberscoring(){
    if(this.freemiun){
      this.modalService.open(CbyFreemiumAlertComponent);
    } else {
      this.router.navigate(['/cyberscoring'])
    }
  }

  onFocusOutBusiness(event: any){
    const val = event.target.value
    val == "" ? this.errorBusinessName = true : this.errorBusinessName = false;
  }
  onFocusOutCnae(event: any){
    const val = event.target.value
    val == -1 ? this.errorCnae = true : this.errorCnae = false;
  }
  onFocusOutDomain(edit: boolean){
    if(edit == true){
      if (this.data.nextDomains.length == 0){
        this.errorNoDomain = true;
      }else{
        this.errorNoDomain = false;
      }
    }else{
      if (this.data.domains.length == 0){
        this.errorNoDomain = true;
      }else{
        this.errorNoDomain = false;
      }
    }

  }

  AddEmail(email) {
    this.message = "";
    this.showMessage = false;
    if(email != "")
    {
      if (UserValidator.validEmail(email) != null && this.data.emails.indexOf(email) == -1) {
        this.data.emails.push(email);
        this.email.nativeElement.value = '';
      }
      else {
        this.message = this.translate.instant('CYBERSCORING.EMAIL_ERROR');
        this.showMessage = true;
      }
    }
  }
  AddDomain(domain) {
    this.message = "";
    this.errorDomain = false;
    this.errorNoDomain = false;
    if(domain != "")
    {
      if (DomainValidator.checkIsValidDomain(domain) && this.data.domains.indexOf(domain) == -1) {
        this.editModal? this.data.nextDomains.push(domain) : this.data.domains.push(domain);
        this.domain.nativeElement.value = '';
      }
      else {

        this.message = this.translate.instant('CYBERSCORING.DOMAIN_ERROR');
        this.errorDomain = true;
      }
    }
  }
  DeleteDomain(domain) {
    this.message = "";
    this.showMessage = false;
    if(domain != "")
    {
      if(this.editModal){
        if(this.data.nextDomains.includes(domain))
        this.data.nextDomains.splice(this.data.nextDomains.indexOf(domain),1);
      }else{
        if(this.data.domains.includes(domain))
        this.data.domains.splice(this.data.domains.indexOf(domain),1);
      }

    }
  }
  DeleteEmail(email) {
    this.message = "";
    this.showMessage = false;
    if(email != "")
    {
      if(this.data.emails.includes(email))
        this.data.emails.splice(this.data.emails.indexOf(email));
    }
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);
  }


  async getLastReport(id?){
    if(this.freemiun) {
      this.modalService.open(CbyFreemiumAlertComponent);
    } else{
      if(id){
        await this.userService.getCyberScoringPdf(id.toString()).then(res =>{
          this.downloadPdfFile(res, 'Report')
        })
      }else{
        await this.userService.getCyberScoringPdf(this.data.cyberscoringId.toString()).then(res =>{
          this.downloadPdfFile(res, 'Report')
        })
      }
    }
  }

  checkTerms(e: any) {
    this.terms = e.target.checked;
  }

  downloadPdfFile(bas64Data: string, fileName: string) {
    const buffer = this.base64ToArrayBuffer(bas64Data);
    const blob = new Blob([buffer], { type: 'application/pdf' });
    if (navigator.msSaveOrOpenBlob) {
      return navigator.msSaveOrOpenBlob(blob, `${fileName}.pdf`);
    }
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    window.open(link.href, '_blank');
  }

  base64ToArrayBuffer(base64) {
    const binaryString = atob(base64)
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }

    return bytes;
  }

  open(name: string, desc: string, icon: string) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.desc = desc;
    modalRef.componentInstance.icon = icon;
  }
}
