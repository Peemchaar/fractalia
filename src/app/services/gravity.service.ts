import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from './message.service';
import { environment } from 'src/environments/environment';
import { GravityEndpoint } from '../models/gravityEndpoint';
import { GravityInstallationLinks } from '../models/gravityInstallationLinks';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';
import * as Chart from 'chart.js';
import { GravityThreat } from '../models/gravityThreat';

@Injectable({
  providedIn: 'root'
})
export class GravityService {

  public serviceId: number;
  public serviceName: string;
  public serviceCode: string;
  public serviceIcon: string;
  public serviceDesc: string;
  public longDesc: string;
  public status = 0;
  public endpoints: GravityEndpoint[] = [];
  public maxEndpoints: number = 0;
  public installationLinks: GravityInstallationLinks = new GravityInstallationLinks();
  public totalAlertsRevised: number;
  public totalAlertsBlocked: number;
  public threats: GravityThreat[] = [];
  public canSkipDownload: boolean = false;
  public clientDownloaded: boolean = false;

  public revisedChartLabels: Label[] = [this.translate.instant('COMP_GRAVITY.CLEAN'), this.translate.instant('COMP_GRAVITY.BORRADOS'), this.translate.instant('COMP_GRAVITY.EXCLUIDOS'), this.translate.instant('COMP_GRAVITY.CUARENTENA')];
  public revisedChartData = [];
  public revisedDoughnutChartData: MultiDataSet = [this.revisedChartData];
  public revisedChartType: ChartType = 'doughnut';
  public revisedDoughnutColors: any[] = [{ backgroundColor: ["#00B1EA", "#8B8F98", "#FF9138", "#FF0101"] }];

  public blockedChartLabels: Label[] = [this.translate.instant('COMP_GRAVITY.MALICIOUS_WEBSITES'), this.translate.instant('COMP_GRAVITY.PHISHING_ATTACKS'), this.translate.instant('COMP_GRAVITY.MALWARE_ATTACKS')];
  public blockedChartData = [];
  public blockedDoughnutChartData: MultiDataSet = [this.blockedChartData];
  public blockedChartType: ChartType = 'doughnut';
  public blockedDoughnutColors: any[] = [{ backgroundColor: ["#8B8F98", "#FFED48", "#00B1EA"] }];
  
  constructor(private http: HttpClient,
    private messageService: MessageService,
    private translate: TranslateService) {
      Chart.defaults.global.tooltips.enabled = false;
      Chart.defaults.global.animation.duration = 2000;
      Chart.defaults.global.legend.display = false
    }

  public async GetConfig() {
    return this.http.get<number>(environment.apiEndpoint + "api/gravity/config").toPromise().then(result => {
      this.maxEndpoints = result;
    });
  }
  public async GetGravityEndpoints() {
    return this.http.get<GravityEndpoint[]>(environment.apiEndpoint + "api/gravity/endpoints").toPromise().then(result => {
      this.endpoints = result;
      if(this.endpoints.length > 0)
        this.status = 2;
      else
      {
        this.revisedChartData = [];
        this.blockedChartData = [];
      }

      // if (this.revisedChartData.length > 0)
      //   this.revisedChartData = [];
      // this.totalAlertsRevised = 32;
      // this.revisedChartData.push(10);
      // this.revisedChartData.push(9);
      // this.revisedChartData.push(9);
      // this.revisedChartData.push(4);

      return result;
    });
  }
  public async GetThreats() {
    return this.http.get<GravityThreat[]>(environment.apiEndpoint + "api/gravity/threats").toPromise().then(result => {
      this.threats = result;
    });
  }
  public async GetInstallationLinks() {
    return this.http.get<GravityInstallationLinks>(environment.apiEndpoint + "api/gravity/installationlinks").toPromise().then(result => {
      this.installationLinks = result;
      if(this.installationLinks.packageName != null)
        this.status = 1;
      return result;
    });
  }
  public async CreateGravityCompany() {
    return this.http.get<boolean>(environment.apiEndpoint + "api/gravity/create_company").toPromise().then(result => {
      return result;
    });
  }
  public async DeleteGravityEndpoint(endpointId:string)
  {
    return this.http.delete<boolean>(environment.apiEndpoint + "api/gravity/delete_endpoint?endpointId=" + endpointId).toPromise();
  }
}
