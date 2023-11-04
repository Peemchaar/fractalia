import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as Chart from 'chart.js';
import { ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
import { environment } from 'src/environments/environment';
import { ExternalAppFractel } from '../models/externalAppFractel';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class FractelService {
  hasData: boolean = false;

  public serviceId: number;
  public serviceName: string;
  public serviceIcon: string;
  public serviceDesc: string;
  public longDesc: string;
  public FractelData: ExternalAppFractel;
  public FractelDatas: ExternalAppFractel[];
  public devicesHigh: boolean[];
  public devicesMedium: boolean[];
  public totalAnalizados: number;
  public danger: number = 0;
  public low: number = 0;
  public warning: number = 0;
  public hay_alerta_high: Boolean;
  public hay_alert_medium: Boolean;
  public ultima_fecha: Date;

  chartLabels: Label[];
  public chartData: any[] = [];

  public doughnutChartData: MultiDataSet = [
    this.chartData
  ];
  chartType: ChartType = 'doughnut';

  public doughnutColors: any[] = [
    { backgroundColor: ["#ff0062", "#fea953", "#1bb77a"] }];
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private translate: TranslateService) {
    Chart.defaults.global.tooltips.enabled = false;
    Chart.defaults.global.animation.duration = 2000;
    Chart.defaults.global.legend.display = false
    this.chartLabels = ["Altos", "Medios", "Correctos"];
  }

  public async getFractelLicense(id: number) {
    let params = new HttpParams();
    params = params.set('userID', id.toString());
    return this.http.get(environment.apiEndpoint + "api/user/requestlicensefractel", { params }).toPromise();
  }

  public async getFractelData(id: number) {
    let params = new HttpParams();
    params = params.set('userID', id.toString());
    return this.http.get(environment.apiEndpoint + "api/user/getfracteldata", { params }).toPromise().then(result => {
      if (result == null) {
        this.messageService.add(this.translate.instant('FRACTEL.ERROR'), "error");
      } else {
        this.FractelDatas = [];
        if (this.chartData.length > 0)
          this.chartData = []


        this.danger = 0;
        this.warning = 0;
        this.low = Object.entries(result).length;
        if (this.low > 0){
          this.hasData = true;
        }

        this.devicesHigh = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
        this.devicesMedium = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

        for (var n = 0; n < Object.entries(result).length; n++) {
          this.FractelDatas.push(<ExternalAppFractel>result[n]);

          this.FractelData = this.FractelDatas[n];
          

          //Analizamos uso de memoria y disco para definir alertas
          if (this.FractelData.memoryUsedPercent > 90) {
            this.danger++;
            this.devicesHigh[n] = true;
            this.low--;
          }else if (this.FractelData.hDiskUsedPercent > 90) {  
            this.danger++;
            this.devicesHigh[n] = true;
            this.low--;
          }else if (this.FractelData.memoryUsedPercent > 80) {
            this.warning++;
            this.devicesMedium[n] = true;
            this.low--;
          } else if (this.FractelData.hDiskUsedPercent > 80) {
            this.warning++;
            this.devicesMedium[n] = true;
            this.low--;
          }
        };
        this.totalAnalizados = this.FractelDatas.length;

        //Buscamos la última fecha
        for (let i = 0; i < this.FractelDatas.length; i++) {
          if (!this.ultima_fecha) {
            this.ultima_fecha = this.FractelDatas[i].createDate;
          } else {
            if (<Date>this.FractelDatas[i].createDate > <Date>this.ultima_fecha)
              this.ultima_fecha = this.FractelDatas[i].createDate;
          }
        }
        this.chartData.push(this.danger)
        this.chartData.push(this.warning)
        this.chartData.push(this.low)
      }
    }
    )
  }

  public async getFractelReport(uuid: string) {
    let params = new HttpParams();
    params = params.set('uuid', uuid);
    return this.http.get(environment.apiEndpoint + "api/user/getfractelreport", { params }).toPromise();
  }
}
