import { User } from 'src/app/models/user';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BitDefenderMspResponse } from '../models/bitDefenderMspResponse';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';
import * as Chart from 'chart.js';
import { AppConstants } from 'src/app/shared/app.constans';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class BitdefendermspService {

  public bitdefenderResponse: BitDefenderMspResponse;
  public devicesRisk = [];
  public hasBitDefenderMspDevices = false;
  public nDevicexProducto: number = 0;
  public nDeviceInstall: number = 0;
  public nDeviceAnalitics: number = 0;
  public nDeviceMobile: number = 0;
  public nDeviceDesktop: number = 0;
  public sumFilesUnresolved: number = 0;
  public sumRisk: number = 0;
  public chartLabels: Label[] = ["Alto", "Correctos"];
  public chartData = [];
  public doughnutChartData: MultiDataSet = [this.chartData];
  public chartType: ChartType = 'doughnut';
  public doughnutColors: any[] = [{ backgroundColor: ["#1bb77a", "#ff0062"] }];
  private bitDefenderMspConst;
  public access_central_url:string;
  public clientDownloaded: boolean;
  public canSkipDownload: boolean;
  private user : User;

  public serviceId: number;
  public serviceName: string;
  public serviceIcon: string;
  public serviceDesc: string;
  public longDesc: string;

  constructor(private http: HttpClient,
    private userService: UserService) {
    Chart.defaults.global.tooltips.enabled = false;
    Chart.defaults.global.animation.duration = 2000;
    Chart.defaults.global.legend.display = false;
    this.bitDefenderMspConst = AppConstants.BitDefenderMspConst;
  }

  public async getUserLicenceMsp(partnerSuiteId: string) {
    let params = new HttpParams();
    params = params.set('partnerSuiteId', partnerSuiteId);
    return this.http.get<BitDefenderMspResponse>(environment.apiEndpoint + "api/licence/msp/subscriberid", { params }).toPromise().then(response => {
      this.Acces_central();
      this.bitdefenderResponse = response;
      (this.bitdefenderResponse.devices != null && this.bitdefenderResponse.devices.length > 0)? this.hasBitDefenderMspDevices = true : this.hasBitDefenderMspDevices = false;
      if (this.chartData.length > 0)
        this.chartData = []
      if (this.hasBitDefenderMspDevices) {
        this.devicesRisk = [];
        this.nDeviceAnalitics = 0;
        this.sumFilesUnresolved = 0;
        this.sumRisk = 0;

        this.nDeviceInstall = this.bitdefenderResponse.devices.length;
        this.nDeviceDesktop = this.bitdefenderResponse.devices.filter(x => x.type == 'computer').length
        this.nDeviceMobile = this.bitdefenderResponse.devices.filter(x => x.type == 'phone' || x.type == 'tablet').length
        const aSubsId = this.bitdefenderResponse.subscriptions[0].productId.split("-");
        this.nDevicexProducto = +aSubsId.find(x => x.includes("device")).replace("device", "");
        let isScan = false, j = 0, isScanFooter = false;

        for (let device of this.bitdefenderResponse.devices) {
          if (device.tasks != null && device.tasks.length > 0) {
            isScan = false;
            isScanFooter = false;
            device.scanned = 0;
            device.resolved = 0;
            device.unresolved = 0;
            for (let task of device.tasks) {
              if (task.risk > 0 || task.filesUnresolved > 0) {
                device.isrisk = true;

                if (!this.devicesRisk.some(x => x == device)) {
                  this.devicesRisk.push(device)
                }
                this.sumFilesUnresolved += task.filesUnresolved;
                this.sumRisk += task.risk;
              }
              if (!isScan && /scan/.test(task.taskName)) {
                isScan = true;
                this.nDeviceAnalitics++;
                device.taskScan = task;
              }
              // else { device.taskScan=null;}

              if (!isScanFooter && (task.taskName == "scan" || task.taskName == "quick_scan")) {
                isScanFooter = true;
                device.lastScan = task.dt;
                device.scanned = task.scannedItems;
                device.resolved = task.filesResolved;
                device.unresolved = task.filesUnresolved;
              }

            }
          }
        }
        this.chartData.push(this.nDeviceInstall - this.devicesRisk.length);
        this.chartData.push(this.devicesRisk.length);
      }
    });
  }

  public async setUserLicenceMSP(partnerSuiteId: string, lang: string, partnercode: string) {
    let params = new HttpParams();
    params = params.set('partnerSuiteId', partnerSuiteId);
    params = params.set('lang', lang);
    params = params.set('partnercode', partnercode);
    return this.http.get<BitDefenderMspResponse>(environment.apiEndpoint + "api/licence/msp/subscriber", { params }).toPromise();
  }

  Acces_central(){
    this.user = Object.assign({}, this.userService.currentUserValue);
    let lang:string =  this.user.languageCode;
    lang = lang.replace('-','_');
    if(this.bitDefenderMspConst.languages.indexOf(lang)<0)
      lang="es_ES";
    const url =  "https://login.bitdefender.com/central/login.html?redirect_url=https:%2F%2Fcentral.bitdefender.com%2Fdashboard&lang="+lang+"&ref=&partner_id=com.bitdefender&user=" + encodeURIComponent(this.user.email);
    this.access_central_url  = url;
  }
}
