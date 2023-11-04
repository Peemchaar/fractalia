import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { FractelService } from 'src/app/services/fractel.service';
import { environment } from 'src/environments/environment';
import { LanguageService } from 'src/app/services/language.service';
import { LocalService } from 'src/app/services/local.service';



@Component({
  selector: 'app-lan-analyzer',
  templateUrl: './lan-analyzer.component.html',
  styleUrls: ['./lan-analyzer.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class LanAnalyzerComponent implements OnInit {

  constructor(
    public userService: UserService,
    public languageService: LanguageService,
    private router: Router,
    private messageService: MessageService,
    private translate: TranslateService,
    public fractelService: FractelService,
    public route: ActivatedRoute,
    private localService: LocalService
  ) { }

  public loading: boolean = false;
  public hasLicense: boolean;
  public isReport: boolean;
  public reportData: any;
  public report_warning: number;
  public report_danger: number;
  public appEndpoint: string;


  ngOnInit() {

    if (this.fractelService != null)
      this.fractelService.getFractelData(this.userService.currentUserValue.id);

    switch (this.languageService.lan) {
      case "es-ES": 
      case "gl-ES": 
      case "eu-ES": 
        this.appEndpoint = environment.apiEndpoint + environment.fractelPath + "Fractel_es.exe"; break;
      case "ca-ES": 
        this.appEndpoint = environment.apiEndpoint + environment.fractelPath + "Fractel_cat.exe"; break;
      case "pt-BR": 
      case "pt-PT":
        this.appEndpoint = environment.apiEndpoint + environment.fractelPath + "Fractel_pt.exe"; break;
      case "en-GB": 
      default: 
        this.appEndpoint = environment.apiEndpoint + environment.fractelPath + "Fractel_en.exe"; break;
    }

    if (this.fractelService.serviceId) {
      if (this.getLocalStorage('currentService') == null) {
        this.router.navigate(['/']);
        return;
      }
      else { // If refresh
        let service = this.getLocalStorage('currentService');
        this.fractelService.serviceId = service.id;
        this.fractelService.serviceName = service.name;
        this.fractelService.serviceIcon = service.icon;
        this.fractelService.serviceDesc = service.desc;
        this.fractelService.longDesc = service.longDesc;
        this.userService.selSuiteName = localStorage.getItem('suiteName');
      }
    }
    else {
      let service = this.getLocalStorage('currentService');
      this.fractelService.serviceId = service.id;
      this.fractelService.serviceName = service.name;
      this.fractelService.serviceIcon = service.icon;
      this.fractelService.serviceDesc = service.desc;
      this.fractelService.longDesc = service.longDesc;
      this.userService.selSuiteName = localStorage.getItem('suiteName');
    }

    this.hasLicense = false;
    this.isReport = false;
    this.report_danger = 0;
    this.report_warning = 0;
    if (this.userService.currentUserValue.licenseFractel) {
      this.requestFractelData();
      this.hasLicense = true;

    } else {

      this.hasLicense = false;
    }
  }

  ngAfterViewInit() {
    this.route.params.subscribe(val => {
      var param = this.route.snapshot.paramMap.get('param');
      var showReport = param.toLocaleLowerCase() == 'true';
      if (showReport) {
        if (this.fractelService.FractelDatas && this.fractelService.FractelDatas.length > 0)
        this.setLocalStorage('lastFractelItem', this.fractelService.FractelDatas[0].uuid)
        this.requestFractelReport(this.getLocalStorage('lastFractelItem'));
      }
      else if (typeof param === 'string')
        document.getElementById(param).scrollIntoView();
    });
  }

  requestFractelService() {
    this.fractelService.getFractelLicense(this.userService.currentUserValue.id).then(result => {
      if (result == "") {
        this.messageService.add(this.translate.instant('FRACTEL.ERROR'), "error");
      } else {
        this.userService.currentUserValue.licenseFractel = result.toString();
        this.setLocalStorage('currentUser', this.userService.currentUserValue);
      }
    });
  }

  async requestFractelData() {
    await this.fractelService.getFractelData(this.userService.currentUserValue.id)
  }

  requestFractelReport(uuid) {
    window.scrollTo(0, 0);
    this.fractelService.getFractelReport(uuid).then(result => {
      if (result == null) {
        this.messageService.add(this.translate.instant('FRACTEL.ERROR'), "error");
      } else {

        var datos = JSON.stringify(result);
        this.reportData = JSON.parse(datos);
        //console.log(this.reportData);
        this.isReport = true;
        //Cálculo del estado global del informe detallado
        if (this.reportData.memorY_USED_PERCENT > 90)
          this.report_danger++;
        else if (this.reportData.memorY_USED_PERCENT > 80)
          this.report_warning++;

        if (this.reportData.hD_USED_PERCENT > 90)
          this.report_danger++;
        else if (this.reportData.hD_USED_PERCENT > 80)
          this.report_warning++;

        this.reportData.neT_TRACEROUTE_TEXT_Translated = this.translate.instant('CYBERSECURITY.FRACTEL.'+this.reportData.neT_TRACEROUTE_TEXT);
        // Empleados 16 segundos usando 50 hilos y detectadas 3 IPs.
        var DISCOVER_TIMECOST = this.reportData.neT_DISCOVER_TIMECOST.split(",");
        this.reportData.neT_DISCOVER_TIMECOST_Translated = this.translate.instant('CYBERSECURITY.FRACTEL.NET_DISCOVER_TIMECOST').replace("{{SECONDS}}",DISCOVER_TIMECOST[0]).replace("{{THREADS}}",DISCOVER_TIMECOST[1]).replace("{{IPS}}",DISCOVER_TIMECOST[2]);
        
        this.reportData.firewalL_STATE_TEXT_Translated = this.translate.instant('CYBERSECURITY.FRACTEL.'+this.reportData.firewalL_STATE_TEXT);

        this.reportData.avirus.statE_TEXT_Translated = this.translate.instant('CYBERSECURITY.FRACTEL.'+this.reportData.avirus.statE_TEXT);
      }
    });
  }

  closeReport() {
    window.scrollTo(0, 0);
    this.isReport = false;
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }
  
  setLocalStorage(key, data) {
    this.localService.setJsonValue(key, data);
  }
}
