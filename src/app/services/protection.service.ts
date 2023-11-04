import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { DeviceData } from '../models/deviceData';
import { Device } from '../models/device';
import { DeviceAnalyzed } from '../models/deviceAnalyzed';
import { ServiceIcon } from '../models/serviceIcon';
import * as Chart from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ProtectionService {
  public serviceId: number;
  public serviceName: string;
  public serviceIcon: string;
  public serviceDesc: string;
  public longDesc: string;
  public loading: Boolean = false;
  public services: ServiceIcon[];

  public data: DeviceData = new DeviceData();
  public devicesAnalyzed: DeviceAnalyzed[];
  public desktopDevices: Device[];
  public mobileDevices: Device[];
  public status: number = -1;

  public chartLabels: Label[] = ["Alto", "Bajo"];
  public chartData = [];
  public doughnutChartData: MultiDataSet = [this.chartData];
  public chartType: ChartType = 'doughnut';
  public doughnutColors: any[] = [{ backgroundColor: ["#ff0062", "#1bb77a"] }];

  public barChartOptions;

  public barData: number[] = [];
  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartLegend = false;
  public barChartData = [];

  constructor(private http: HttpClient, private translate: TranslateService) {
    Chart.defaults.global.tooltips.enabled = false;
    Chart.defaults.global.animation.duration = 2000;
    Chart.defaults.global.legend.display = false

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
          ticks: {
            beginAtZero: true,
            stepSize: 10
          }
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
  }

  public async getProtectionStatus(partnerSuiteId: number, serviceTypeId: number) {
    let params = new HttpParams();
    params = params.set('partnerSuiteId', partnerSuiteId.toString());
    params = params.set('serviceTypeId', serviceTypeId.toString());
    return this.http.get<number>(environment.apiEndpoint + "api/bitdefender/status", { params }).toPromise().then(
      result => {
        this.status = result;
        this.loading = false;
      });
  }

  public async getProtectionDeviceData(partnerSuiteId: number, serviceTypeId: number) {
    let params = new HttpParams();
    params = params.set('partnerSuiteId', partnerSuiteId.toString());
    params = params.set('serviceTypeId', serviceTypeId.toString());
    return this.http.get<DeviceData>(environment.apiEndpoint + "api/bitdefender/data", { params }).toPromise().then((result) => {
      if (result) {
        this.data = result;
        this.chartData = [];
        this.chartData = [this.data.unresolved, this.data.resolved];
        this.doughnutChartData = [this.chartData];
        this.loading = false;
      }
    })
  }

  public async getProtectionDevicesAnalyzed(partnerSuiteId: number, serviceTypeId: number) {
    let params = new HttpParams();
    params = params.set('partnerSuiteId', partnerSuiteId.toString());
    params = params.set('serviceTypeId', serviceTypeId.toString());
    return this.http.get<DeviceAnalyzed[]>(environment.apiEndpoint + "api/bitdefender/devices/analyzed", { params }).toPromise().then((result) => {
      if (result) {
        this.devicesAnalyzed = result;
        this.barData = [];
        this.barChartData = [];
        this.barChartLabels = [];
        if (this.devicesAnalyzed.length > 0) {
          for (var i = 0; i < this.devicesAnalyzed.length; i++) {
            this.barData.push(this.devicesAnalyzed[i].days == 0 ? 0.5 : this.devicesAnalyzed[i].days);
            this.barChartLabels.push(this.devicesAnalyzed[i].name);
          }
          this.barChartData = [{ data: this.barData }];
        }
        this.barChartData = this.barChartData.slice();
        this.loading = false;
      }
    })
  }

  public async getProtectionDesktopDevices(partnerSuiteId: number, serviceTypeId: number) {
    let params = new HttpParams();
    params = params.set('partnerSuiteId', partnerSuiteId.toString());
    params = params.set('serviceTypeId', serviceTypeId.toString());
    return this.http.get<Device[]>(environment.apiEndpoint + "api/bitdefender/desktop/devices", { params }).toPromise().then((result) => {
      if (result) {
        this.desktopDevices = result;
        this.loading = false;
      }
    })
  }

  public async getProtectionMobileDevices(partnerSuiteId: number, serviceTypeId: number) {
    let params = new HttpParams();
    params = params.set('partnerSuiteId', partnerSuiteId.toString());
    params = params.set('serviceTypeId', serviceTypeId.toString());
    return this.http.get<Device[]>(environment.apiEndpoint + "api/bitdefender/mobile/devices", { params }).toPromise().then((result) => {
      if (result) {
        this.mobileDevices = result;
        this.loading = false;
      }
    })
  }

  public async getBitDefenderMspProducts(codeOrganization: string) {
    let params = new HttpParams();
    params = params.set('codeorganization', codeOrganization);
    return this.http.get<any[]>(environment.apiEndpoint + "api/bitdefender/msp/products", { params }).toPromise();
  }
}
