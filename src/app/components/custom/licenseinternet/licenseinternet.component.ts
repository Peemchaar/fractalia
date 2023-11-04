import { Component, ViewEncapsulation } from '@angular/core';
import { LicenceService } from 'src/app/services/licence.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { TruncateService } from 'src/app/services/truncate.service';
import { PartnerService } from 'src/app/services/partner.service';
import { ServicesService } from 'src/app/services/services.service';
import { ServiceTypeService } from 'src/app/services/service-type.service';
import { LocalService } from 'src/app/services/local.service';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-licenseinternet',
  templateUrl: './licenseinternet.component.html',
  styleUrls: ['./licenseinternet.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LicenseinternetComponent {
  public staticContentUrl = environment.STATIC_CONTENT;
  public licence: string = "";
  public originalCode: string = "";
  loading = false;

  constructor(public licenseService: LicenceService,
    public userService: UserService,
    public truncateService: TruncateService,
    private router: Router,
    private partnerService: PartnerService,
    private servicesService: ServicesService,
    public serviceTypeService: ServiceTypeService,
    private localService: LocalService) {
  }
  async ngOnInit() {
    if (this.licenseService.serviceName) {
      if (this.getLocalStorage('currentService') == null) {
        this.router.navigate(['/']);
        return;
      }
      else { // If refresh
        let service = this.getLocalStorage('currentService');
        let suiteColor = localStorage.getItem('suiteColor');
        let suiteGradColor = localStorage.getItem('suiteGradColor');
        let partnerSuiteId = localStorage.getItem('partnerSuiteId');
        this.userService.selSuiteColor = suiteColor;
        this.userService.selSuiteGradColor = suiteGradColor;
        this.licenseService.serviceId = service.id;
        this.licenseService.serviceName = service.name;
        this.licenseService.serviceIcon = service.icon;
        this.licenseService.serviceDesc = service.desc;
        this.licenseService.longDesc = service.longDesc;
        this.licenseService.code = service.code;
        this.checkLicence(Number(partnerSuiteId), Number(service.id), this.partnerService.partner.languageId);
        this.originalCode = this.servicesService.userServices.find(x => x.id == service.id).originalCode;
        if (!this.originalCode)
          this.originalCode = this.licenseService.code
      }
    }
    else { // If refresh
      let service = this.getLocalStorage('currentService');
      let suiteColor = localStorage.getItem('suiteColor');
      let suiteGradColor = localStorage.getItem('suiteGradColor');
      let partnerSuiteId = localStorage.getItem('partnerSuiteId');
      this.userService.selSuiteColor = suiteColor;
      this.userService.selSuiteGradColor = suiteGradColor;
      this.licenseService.serviceId = service.id;
      this.licenseService.serviceName = service.name;
      this.licenseService.serviceIcon = service.icon;
      this.licenseService.serviceDesc = service.desc;
      this.licenseService.longDesc = service.longDesc;
      this.licenseService.code = service.code;
      this.checkLicence(Number(partnerSuiteId), Number(service.id), this.partnerService.partner.languageId);
      if (!this.originalCode)
        this.originalCode = this.licenseService.code
      this.originalCode = this.servicesService.userServices.find(x => x.id == service.id).originalCode;
    }
  }

  async checkLicence(partnerSuiteId: number, serviceId: number, languageId: number) {
    this.loading = !this.loading;
    await this.serviceTypeService.loadServiceTypes();
    let serviceTypeId = this.serviceTypeService.types.find(x => x.code == "BIS").id;
    await this.licenseService.getUserLicence(partnerSuiteId, serviceId, languageId, serviceTypeId);
    this.licence = this.licenseService.globalLicence;
    this.loading = !this.loading;
  }

  async setUserLicenceIS() {
    this.loading = !this.loading;
    let partnerSuiteId = localStorage.getItem('partnerSuiteId');
    await this.licenseService.setUserLicenceIS(Number(partnerSuiteId), this.partnerService.partner.languageId.toString(), this.licenseService.serviceId.toString());
    this.loading = !this.loading;
    this.licence = this.licenseService.globalLicence;
    if (this.licence) {
      $('#divPopupLicence').show();
    }
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }
}

