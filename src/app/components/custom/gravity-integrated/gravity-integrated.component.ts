import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as Chart from 'chart.js';
import { Service } from 'src/app/models/service';
import { GravityService } from 'src/app/services/gravity.service';
import { MessageService } from 'src/app/services/message.service';
import { ServicesService } from 'src/app/services/services.service';
import { TruncateService } from 'src/app/services/truncate.service';
import { UserService } from 'src/app/services/user.service';
import { GravityEndpoint } from 'src/app/models/gravityEndpoint';
import { BaseChartDirective } from 'ng2-charts';
import { environment } from 'src/environments/environment';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '../infomodal/infomodal.component';

@Component({
  selector: 'app-gravity-integrated',
  templateUrl: './gravity-integrated.component.html',
  styleUrls: ['./gravity-integrated.component.scss']
})
export class GravityIntegratedComponent implements OnInit {

  @Input() serviceName: string;
  @Input() serviceIcon: string;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  loading = true;
  creatingAccount = false;
  loadingDelete = false;
  modalRef: NgbModalRef;
  public staticContentUrl = environment.STATIC_CONTENT;
  public service: Service = new Service;
  public showMessage: boolean = false;
  public errorMessage: string = "";
  public deleteEndpointId: string = "";
  public deleteEndpointName: string = "";
  public showDeleteForm: boolean = false;
  public endpointSelected: GravityEndpoint = new GravityEndpoint();

  // public barData: number[] = [];
  // public barChartLabels = [];
  // public barChartType = 'doughnutChartType';
  // public barChartLegend = false;
  // public barChartData = [];
  // public barChartOptions;

  constructor(
    public serviceService: ServicesService,
    public route: Router,
    public gravityService: GravityService,
    public truncateService: TruncateService,
    public messageService: MessageService,
    public translate: TranslateService,
    public modalService: NgbModal,
    public userService: UserService) {
    this.service = this.serviceService.userServices.find(x => x.typeCode === "GRA");
    // console.log(this.service);
    this.loadData();

  }

  ngOnInit(): void {
  }

  async loadData() {
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

              this.loading = false;
            }
          );
        }
        else
          this.loading = false;
      }
    );

  }

  createCompany() {
    if(this.userService.currentUserValue.email != null)
    {
      this.loading = true;
      this.creatingAccount = true;
      this.gravityService.CreateGravityCompany().then(
        result => {
          if (result) {
            this.messageService.add(this.translate.instant('COMP_GRAVITY.MESSAGE_CREATE_OK'), "ok");
            this.loadData();
          }
          else
            this.messageService.add(this.translate.instant('COMP_GRAVITY.MESSAGE_CREATE_ERROR'), "error");
          this.loading = false;
          this.creatingAccount = false;
        }
      );
    }
    else
    {
      const modalRef = this.modalService.open(InfoModalComponent);
      modalRef.componentInstance.message = this.translate.instant('EMAIL_REQUIRED');
    }
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

  openServicePage() {
    let currentService = {
      id: this.service.id,
      name: this.service.name,
      code: this.service.code,
      icon: this.service.icon,
      desc: this.service.desc,
      longDesc: this.service.longDesc
    }
    localStorage.setItem('currentService', JSON.stringify(currentService));
    this.route.navigate(['/gravity']);
    return;
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



}
