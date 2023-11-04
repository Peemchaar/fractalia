import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as Chart from 'chart.js';
import { GravityService } from 'src/app/services/gravity.service';
import { GravityEndpoint } from 'src/app/models/gravityEndpoint';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from 'src/app/services/message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gravity',
  templateUrl: './gravity.component.html',
  styleUrls: ['./gravity.component.scss']
})
export class GravityComponent implements OnInit {

  loading = false;
  error = false;
  public staticContentUrl = environment.STATIC_CONTENT;
  public barData: number[] = [];
  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartLegend = false;
  public barChartData = [];
  public barChartOptions;
  public endpointSelected: GravityEndpoint = new GravityEndpoint();

  public deleteEndpointId: string = "";
  public deleteEndpointName: string = "";
  public showDeleteForm: boolean = false;
  public loadingDelete = false;

  constructor(
    public gravityService: GravityService,
    public userService: UserService,
    public messageService: MessageService,
    private router: Router,
    public translate: TranslateService) {
    if (localStorage.getItem('currentService') == null) {
      this.router.navigate(['/']);
      return;
    }
    else {
      let service = JSON.parse(localStorage.getItem('currentService'));
    }
    this.error = false;

    this.loadData();

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
    if (this.gravityService.serviceId) {
      if (localStorage.getItem('currentService') == null) {
        this.router.navigate(['/']);
        return;
      }
      else { // If refresh
        let service = JSON.parse(localStorage.getItem('currentService'));
        this.gravityService.serviceId = service.id;
        this.gravityService.serviceName = service.name;
        this.gravityService.serviceIcon = service.icon;
        this.gravityService.serviceDesc = service.desc;
        this.gravityService.longDesc = service.longDesc;
        this.userService.selSuiteName = localStorage.getItem('suiteName');
      }
    }
    else {
      let service = JSON.parse(localStorage.getItem('currentService'));
      this.gravityService.serviceId = service.id;
      this.gravityService.serviceName = service.name;
      this.gravityService.serviceIcon = service.icon;
      this.gravityService.serviceDesc = service.desc;
      this.gravityService.longDesc = service.longDesc;
      this.userService.selSuiteName = localStorage.getItem('suiteName');
    }
  }

  async loadData() {
    this.gravityService.GetThreats();
    await this.gravityService.GetInstallationLinks().then(
      result => {
        if (result.packageName != null) {
          this.gravityService.GetGravityEndpoints().then(
            result => {
              if (this.gravityService.endpoints.length > 0)
                this.endpointSelected = this.gravityService.endpoints[0];

              if (this.gravityService.revisedChartData.length > 0)
                this.gravityService.revisedChartData = [];
              this.gravityService.totalAlertsRevised = this.endpointSelected.revisedCleaned + this.endpointSelected.revisedErased + this.endpointSelected.revisedExcluded + this.endpointSelected.revisedQuarantined;
              this.gravityService.revisedChartData.push(this.endpointSelected.revisedCleaned);
              this.gravityService.revisedChartData.push(this.endpointSelected.revisedErased);
              this.gravityService.revisedChartData.push(this.endpointSelected.revisedExcluded);
              this.gravityService.revisedChartData.push(this.endpointSelected.revisedQuarantined);
              this.gravityService.revisedDoughnutChartData = [this.gravityService.revisedChartData];

              if (this.gravityService.blockedChartData.length > 0)
                this.gravityService.blockedChartData = [];
              this.gravityService.totalAlertsBlocked = this.endpointSelected.blockedWebs + this.endpointSelected.blockedPhising + this.endpointSelected.blockedMalware;
              this.gravityService.blockedChartData.push(this.endpointSelected.blockedWebs);
              this.gravityService.blockedChartData.push(this.endpointSelected.blockedPhising);
              this.gravityService.blockedChartData.push(this.endpointSelected.blockedMalware);
              this.gravityService.blockedDoughnutChartData = [this.gravityService.blockedChartData];

              this.gravityService.GetConfig();
              this.loading = false;
            }
          );
        }
        else
        this.loading = false;
      }
    );

  }

  gravityEndpointchanged(value) {
    this.endpointSelected = this.gravityService.endpoints.find(x => x.id == value);
    // console.log(this.endpointSelected);
    if (this.gravityService.revisedChartData.length > 0)
      this.gravityService.revisedChartData = [];

    this.gravityService.totalAlertsRevised = this.endpointSelected.revisedCleaned + this.endpointSelected.revisedErased + this.endpointSelected.revisedExcluded + this.endpointSelected.revisedQuarantined;
    this.gravityService.revisedChartData.push(this.endpointSelected.revisedCleaned);
    this.gravityService.revisedChartData.push(this.endpointSelected.revisedErased);
    this.gravityService.revisedChartData.push(this.endpointSelected.revisedExcluded);
    this.gravityService.revisedChartData.push(this.endpointSelected.revisedQuarantined);
    this.gravityService.revisedDoughnutChartData = [this.gravityService.revisedChartData];

    if (this.gravityService.blockedChartData.length > 0)
      this.gravityService.blockedChartData = [];
    this.gravityService.totalAlertsBlocked = this.endpointSelected.blockedWebs + this.endpointSelected.blockedPhising + this.endpointSelected.blockedMalware;
    this.gravityService.blockedChartData.push(this.endpointSelected.blockedWebs);
    this.gravityService.blockedChartData.push(this.endpointSelected.blockedPhising);
    this.gravityService.blockedChartData.push(this.endpointSelected.blockedMalware);
    this.gravityService.blockedDoughnutChartData = [this.gravityService.blockedChartData];

  }

  openDeleteModal(endpointId: string) {
    var endpointSelected = this.gravityService.endpoints.find(x => x.id == endpointId);
    if (endpointSelected != null) {
      this.deleteEndpointId = endpointSelected.id;
      this.deleteEndpointName = endpointSelected.name;
      this.showDeleteForm = true;
    }
    else
      this.messageService.add(this.translate.instant('COMP_GRAVITY.REMOVE_FORM.RESULT_ERROR'), "error");
  }

  deleteGravityEndpoint() {
    this.loadingDelete = true;
    var endpointSelected = this.gravityService.endpoints.find(x => x.id == this.deleteEndpointId);
    if (endpointSelected != null) {
      this.gravityService.DeleteGravityEndpoint(this.deleteEndpointId).then(
        result => {
          this.loadingDelete = false;
          if (result) {
            this.loadData();
            this.messageService.add(this.translate.instant('COMP_GRAVITY.REMOVE_FORM.RESULT_OK'), "ok");
            this.showDeleteForm = false;
          }
          else {
            this.messageService.add(this.translate.instant('COMP_GRAVITY.REMOVE_FORM.RESULT_ERROR'), "error");
          }
        })
    }
    else {
      this.loadingDelete = false;
      this.messageService.add(this.translate.instant('COMP_GRAVITY.REMOVE_FORM.RESULT_ERROR'), "error");
    }
  }

}
