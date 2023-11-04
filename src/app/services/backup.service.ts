import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from './message.service';

import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { TranslateService } from '@ngx-translate/core';
import { externalAppAcronisData } from '../models/externalAppAcronis';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';
import * as Chart from 'chart.js';
import { BytesValidator } from '../validators/bytes.validator';

import { LocalService } from 'src/app/services/local.service';

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  public serviceId: number;
  public serviceName: string;
  public serviceIcon: string;
  public serviceDesc: string;
  public longDesc: string;
  public loading: Boolean = false;
  public chatRequest: boolean = false;
  public backupPercent: number = 0;
  public canSkipDownload: boolean = false;
  public clientDownloaded: boolean = false;
  public hasPassword: boolean = false;
  public hasActivated: boolean = false;

  data: externalAppAcronisData = new externalAppAcronisData();
  hasData: boolean = false;
  chartLabels: Label[];
  public chartData = [];

  public doughnutChartData: MultiDataSet = [
    this.chartData
  ];
  chartType: ChartType = 'doughnut';

  public doughnutColors: any[] = [
    { backgroundColor: ["#0053aa", "#7dc0f2"] }];

  constructor(private http: HttpClient,
    private userService: UserService,
    private messageService: MessageService,
    private translate: TranslateService,
    private localService: LocalService) {

    this.chartLabels = [this.translate.instant('USED'), this.translate.instant('AVAILABLE')];
    Chart.defaults.global.tooltips.enabled = false;
    Chart.defaults.global.animation.duration = 2000;    
    Chart.defaults.global.legend.display = false
  }

  public async requestBackupService() {
    return this.http.get<number>(environment.apiEndpoint + "api/acronis").toPromise().then(
      result => {
        if (result == 0) {
          this.messageService.add(this.translate.instant('BACKUP.ERROR'), "error");
        } else if (result == -1) {
          this.messageService.add(this.translate.instant('EMAIL_INCORRECTO'), "error")
        }
        else {
          this.userService.currentUserValue.hasAcronisRequested = result;
          this.setLocalStorage('currentUser', this.userService.currentUserValue);
          this.hasActivated = true
          this.messageService.add(this.translate.instant('BACKUP.OK'), "ok")
        }
      });
  }

  public async getBackupData() {
    return this.http.get<externalAppAcronisData>(environment.apiEndpoint + "api/acronis/data").toPromise().then((result) => {
      if (result) {
        if (this.hasData)
          this.chartData = []
        this.hasData = true;
        this.data = result;

        let spaceFree = Number.parseInt(this.data.spaceAssigned) - Number.parseInt(this.data.spaceUsed)        
        this.chartData.push(this.data.spaceUsed)
        this.chartData.push(spaceFree)
        
        var bytesSpaceAssigned: number = +this.data.spaceAssigned;
        var bytesSpaceUsed: number = +this.data.spaceUsed;
        if(bytesSpaceUsed > 0){
          this.backupPercent = ((bytesSpaceUsed*100)/bytesSpaceAssigned);
        }

        this.data.spaceAssigned = BytesValidator.GetSpaceWithDecimals(this.data.spaceAssigned)
        this.data.spaceUsed = BytesValidator.GetSpaceWithDecimals(this.data.spaceUsed)

        this.loading = false;
      }
    })
  }

  setLocalStorage(key, data) {
    this.localService.setJsonValue(key, data);
  }
}
