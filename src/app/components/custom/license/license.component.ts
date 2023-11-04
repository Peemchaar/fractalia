import { Component, ViewEncapsulation } from '@angular/core';
import { LicenceService } from 'src/app/services/licence.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { TruncateService } from 'src/app/services/truncate.service';
import { PartnerService } from 'src/app/services/partner.service';
import { ServicesService } from 'src/app/services/services.service';
import { LocalService } from 'src/app/services/local.service';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LicenseComponent {
  public staticContentUrl = environment.STATIC_CONTENT;
  public licence: string = "";
  loading = false;

  constructor(public licenseService: LicenceService,
    public userService: UserService,
    public truncateService: TruncateService,
    private router: Router,
    private partnerService: PartnerService,
    private servicesService: ServicesService,
    private localService: LocalService) {

    if (licenseService.serviceName) {
      if (this.getLocalStorage('currentService') == null) {
        this.router.navigate(['/']);
        return;
      }
      else { // If refresh
        let service = this.getLocalStorage('currentService');
        let suiteColor = localStorage.getItem('suiteColor');
        let suiteGradColor = localStorage.getItem('suiteGradColor');
        let partnerSuiteId = localStorage.getItem('partnerSuiteId');
        userService.selSuiteColor = suiteColor;
        userService.selSuiteGradColor = suiteGradColor;
        licenseService.serviceId = service.id;
        licenseService.serviceName = service.name;
        licenseService.serviceIcon = service.icon;
        licenseService.serviceDesc = service.desc;
        licenseService.longDesc = service.longDesc;
        licenseService.code = service.code;
        this.checkLicence(Number(partnerSuiteId), Number(service.id), this.partnerService.partner.languageId);
      }
    }
    else { // If refresh
      let service = this.getLocalStorage('currentService');
      let suiteColor = localStorage.getItem('suiteColor');
      let suiteGradColor = localStorage.getItem('suiteGradColor');
      let partnerSuiteId = localStorage.getItem('partnerSuiteId');
      userService.selSuiteColor = suiteColor;
      userService.selSuiteGradColor = suiteGradColor;
      licenseService.serviceId = service.id;
      licenseService.serviceName = service.name;
      licenseService.serviceIcon = service.icon;
      licenseService.serviceDesc = service.desc;
      licenseService.longDesc = service.longDesc;
      licenseService.code = service.code;
      this.checkLicence(Number(partnerSuiteId), Number(service.id), this.partnerService.partner.languageId);
    }
  }

  async checkLicence(partnerSuiteId: number, serviceId: number, languageId: number) {
    this.loading = !this.loading;
    await this.licenseService.getUserLicence(partnerSuiteId, serviceId, languageId, 3);
    this.licence = this.licenseService.globalLicence;
    this.loading = !this.loading;
  }

  async setUserLicence() {
    this.loading = !this.loading;
    let partnerSuiteId = localStorage.getItem('partnerSuiteId');
    await this.licenseService.setUserLicence(Number(partnerSuiteId), this.partnerService.partner.languageId.toString(), this.licenseService.serviceId.toString());
    this.loading = !this.loading;
    this.licence = this.licenseService.globalLicence;
    if(this.licence){
      $('#divPopupLicence').show();
    }
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }
}
