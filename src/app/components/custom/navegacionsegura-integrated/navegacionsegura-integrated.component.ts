import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CiberalarmaDevice } from 'src/app/models/ciberalarmaDevice';
import { CiberalarmaService } from 'src/app/services/ciberalarma.service';
import { MessageService } from 'src/app/services/message.service';
import { SuiteService } from 'src/app/services/suite.service';
import { UserService } from 'src/app/services/user.service';

import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';
import * as Chart from 'chart.js';

declare var $: any;
@Component({
  selector: 'app-navegacionsegura-integrated',
  templateUrl: './navegacionsegura-integrated.component.html',
  styleUrls: ['./navegacionsegura-integrated.component.scss']
})
export class NavegacionseguraIntegratedComponent implements OnInit {

  @Input() serviceName: string;
  @Input() serviceIcon: string;
  public last5DaysDate = new Date().setDate(new Date().getDate() - 5);
  public ciberalarmaNewNavigation = new CiberalarmaDevice();
  loading = false;
  loadingNew = false;
  loadingDelete = false;
  loadingCreate = false;
  errorSo = false;
  errorName = false;
  errorEmail = false;
  deleteDeviceName: string = "Nombre";
  deleteDeviceId: number = 0;

  public barData: number[] = [];
  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartLegend = false;
  public barChartData = [];
  public barChartOptions;

  public get messageService(): MessageService {
    return this._messageService;
  }
  public set messageService(value: MessageService) {
    this._messageService = value;
  }

  constructor(
    public ciberalarmaService: CiberalarmaService,
    private formBuilder: FormBuilder,
    public userService: UserService,
    private _messageService: MessageService,
    public translate: TranslateService,
    public suiteService: SuiteService,) { 

    Chart.defaults.global.tooltips.enabled = false;
    Chart.defaults.global.animation.duration = 2000;
    Chart.defaults.global.legend.display = false;

    this.barChartOptions = {
      responsive: true,
      scales: {
        xAxes: [{
          ticks: {
            callback: function (value) {
              return value.substr(0, 10); //truncate
            },
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      tooltips: {
        enabled: true,
        mode: 'label',
        callbacks: {
          title: function (tooltipItems, data) {
            // var idx = tooltipItems[0].index;
            // var blocks = translate.instant('CYBERALARM.NAVEGACIONSEGURA.LOCKED');
            // tooltipItems[0].value += ' ' + blocks;
            // return data.labels[idx];
            return translate.instant('CYBERALARM.NAVEGACIONSEGURA.LOCKED');
          }
        }
      }
    }
  }

  ngOnInit(): void {
    this.ciberalarmaService.GetMaxNavLicenses();
    this.ciberalarmaService.GetMaxGeoLicenses();
    this.ciberalarmaService.GetNavigationConfig().then(
      result => {
        if(result.userId != null)
        {
          this.ciberalarmaService.GetDevices();
          this.ciberalarmaService.GetNavigationStats().then(
            result => {
              for(let requestByDay of this.ciberalarmaService.ciberalarmaNavigationStats.requestByDays)
              {
                this.barData.push(requestByDay.blocks);
                this.barChartLabels.push(requestByDay.date);
              }
              this.barChartData = [{ data: this.barData }];
            }
          );
        }
      }
    );
    
  }

  closeModal(){
    document.getElementById('CloseDeletePopup').click()
  }

  calculateDiff(dateSent)
  {
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));
  }

  getNumDevicesNavigation()
  {
    return this.ciberalarmaService.devices.filter(x => x.navegationServiceLicence).length;
  }

  updateNavigationConfig()
  {
    this.loading = true;
    this.ciberalarmaService.UpdateNavigationConfig().then(
      result => {
        this.loading = false;
        if (result) {
          $('#frmConfigurateDevice').modal('hide')
          this.messageService.add(this.translate.instant('CYBERALARM.NAVEGACIONSEGURA.CONFIGURACION_RESULT_OK'), "ok");
        }
        else {
          $('#frmConfigurateDevice').modal('hide')
          this.messageService.add(this.translate.instant('CYBERALARM.NAVEGACIONSEGURA.CONFIGURACION_RESULT_KO'), "error");
        }
      })
  }

  onChangeDevice(deviceId: number)
  {
    this.ciberalarmaNewNavigation.deviceId = deviceId;
    if(this.ciberalarmaNewNavigation.deviceId != -1)
    {
      var deviceSelected = this.ciberalarmaService.devices.find(x => x.deviceId == this.ciberalarmaNewNavigation.deviceId);
      this.ciberalarmaNewNavigation.name = deviceSelected.name;
      this.ciberalarmaNewNavigation.so = deviceSelected.so;
      this.ciberalarmaNewNavigation.email = deviceSelected.email;
    }
    else
    {
      this.ciberalarmaNewNavigation.name = "";
      this.ciberalarmaNewNavigation.so = "";
      this.ciberalarmaNewNavigation.email = "";
    }
  }

  newNavigationDevice()
  {
    this.loadingNew = true;
    var error = false;
    if(this.ciberalarmaNewNavigation.deviceId == -1)
    {
      var soArray: Array<string> = ['android', 'ios', 'windows', 'mac'];
      if(!soArray.includes(this.ciberalarmaNewNavigation.so))
      {
        this.errorSo = true;
        error = true;
      }
      if(this.ciberalarmaNewNavigation.name == null || this.ciberalarmaNewNavigation.name == "")
      {
        this.errorName = true;
        error = true;
      }
      if(this.ciberalarmaNewNavigation.email == null || this.ciberalarmaNewNavigation.email == "")
      {
        this.errorEmail = true;
        error = true;
      }  
    }
    else
    {
      if(this.ciberalarmaNewNavigation.email == null || this.ciberalarmaNewNavigation.email == "")
      {
        this.errorEmail = true;
        error = true;
      }
      else
      {  
        var deviceSelected = this.ciberalarmaService.devices.find(x => x.deviceId == this.ciberalarmaNewNavigation.deviceId);
        if(deviceSelected != null)
        {
          this.ciberalarmaNewNavigation.name = deviceSelected.name;
          this.ciberalarmaNewNavigation.so = deviceSelected.so;
        }
        else
          error = true;
      }
    }
    if(!error)
    {
      this.ciberalarmaService.NewNavigationDevice(this.ciberalarmaNewNavigation).then(
        result => {
          this.loadingNew = false;
          if (result) {
            this.ciberalarmaService.GetDevices();
            this.messageService.add(this.translate.instant('CYBERALARM.NAVEGACIONSEGURA.ADD_FORM.RESULT_OK'), "ok");
            $('#frmAddDevice').modal('hide')
          }
          else {
            $('#frmAddDevice').modal('hide')
            this.messageService.add(this.translate.instant('CYBERALARM.NAVEGACIONSEGURA.ADD_FORM.RESULT_ERROR'), "error");
          }
        })
    }
    else
      this.loadingNew = false;
  }

  openDeleteModal(deviceId: number)
  {
    var deviceSelected = this.ciberalarmaService.devices.find(x => x.deviceId == deviceId);
    if(deviceSelected != null)
    {
      this.deleteDeviceId = deviceSelected.deviceId;
      this.deleteDeviceName = deviceSelected.name;
      $('#frmRemoveDevice').modal('show')
      
    }
    else
      this.messageService.add(this.translate.instant('CYBERALARM.NAVEGACIONSEGURA.REMOVE_FORM.RESULT_ERROR'), "error");
  }

  deleteNavigationDevice()
  {
    this.loadingDelete = false;
    var deviceSelected = this.ciberalarmaService.devices.find(x => x.deviceId == this.deleteDeviceId);
    if(deviceSelected != null)
    {
      this.ciberalarmaService.DeleteNavigationDevice(this.deleteDeviceId).then(
        result => {
          this.loadingDelete = false;
          if (result) {
            this.ciberalarmaService.GetDevices();
            this.messageService.add(this.translate.instant('CYBERALARM.NAVEGACIONSEGURA.REMOVE_FORM.RESULT_OK'), "ok");
            $('#frmRemoveDevice').modal('hide')
          }
          else {
            this.messageService.add(this.translate.instant('CYBERALARM.NAVEGACIONSEGURA.REMOVE_FORM.RESULT_ERROR'), "error");
            $('#frmRemoveDevice').modal('hide')
          }
        })
    }
    else
    {
      this.loadingDelete = false;
      this.messageService.add(this.translate.instant('CYBERALARM.NAVEGACIONSEGURA.REMOVE_FORM.RESULT_ERROR'), "error");
    }
  }

  createUser()
  {
    this.loadingCreate = true;
    this.ciberalarmaService.CreateUsers().then(
      result => {
        this.loadingCreate = false;
        if (result) {
          this.ciberalarmaService.GetDevices();
          this.messageService.add(this.translate.instant('CYBERALARM.NAVEGACIONSEGURA.CREATE_FORM.RESULT_OK'), "ok");
          this.closeModal()
        }
        else {
          this.messageService.add(this.translate.instant('CYBERALARM.NAVEGACIONSEGURA.CREATE_FORM.RESULT_ERROR'), "error");
          this.closeModal()
        }
    })
  }
}
