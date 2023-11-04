import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceService } from 'src/app/services/licence.service';
import { PartnerService } from 'src/app/services/partner.service';
import { ProtectionService } from 'src/app/services/protection.service';
import { ServiceTypeService } from 'src/app/services/service-type.service';
import { UserService } from 'src/app/services/user.service';
import { LocalService } from 'src/app/services/local.service';
import { environment } from 'src/environments/environment';

declare var $: any;
@Component({
  selector: 'app-protection',
  templateUrl: './protection.component.html',
  styleUrls: ['./protection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProtectionComponent implements OnInit {

  public licence: string = "";
  public loading: boolean = false;
  public staticContentUrl = environment.STATIC_CONTENT;
  constructor(
    public protectionService: ProtectionService,
    public licenceService: LicenceService,
    public partnerService: PartnerService,
    public serviceTypeService: ServiceTypeService,
    public userService: UserService,
    public router: Router,
    private localService: LocalService) { }
  async ngOnInit() {
    if (this.protectionService.serviceId) {
      if (this.getLocalStorage('currentService') == null) {
        this.router.navigate(['/']);
        return;
      }
      else { // If refresh
        let service = this.getLocalStorage('currentService');
        this.protectionService.serviceId = service.id;
        this.protectionService.serviceName = service.name;
        this.protectionService.serviceIcon = service.icon;
        this.protectionService.serviceDesc = service.desc;
        this.protectionService.longDesc = service.longDesc;
        this.userService.selSuiteName = localStorage.getItem('suiteName');
        let partnerSuiteId = localStorage.getItem('partnerSuiteId');
        this.checkLicence(Number(partnerSuiteId), Number(service.id), this.partnerService.partner.languageId);
      }
    }
    else {
      let service = this.getLocalStorage('currentService');
      this.protectionService.serviceId = service.id;
      this.protectionService.serviceName = service.name;
      this.protectionService.serviceIcon = service.icon;
      this.protectionService.serviceDesc = service.desc;
      this.protectionService.longDesc = service.longDesc;
      this.userService.selSuiteName = localStorage.getItem('suiteName');
      let partnerSuiteId = localStorage.getItem('partnerSuiteId');
      this.checkLicence(Number(partnerSuiteId), Number(service.id), this.partnerService.partner.languageId);
    }
    let partnerSuiteId = Number(localStorage.getItem('partnerSuiteId'));
    await this.serviceTypeService.loadServiceTypes();
    let serviceTypeId = this.serviceTypeService.types.find(x => x.code == "CPR").id; //Ciberseguridad - Protection
    this.protectionService.getProtectionStatus(partnerSuiteId, serviceTypeId);
    this.protectionService.getProtectionDeviceData(partnerSuiteId, serviceTypeId);
    this.protectionService.getProtectionDevicesAnalyzed(partnerSuiteId, serviceTypeId);
    this.protectionService.getProtectionDesktopDevices(partnerSuiteId, serviceTypeId);
    this.protectionService.getProtectionMobileDevices(partnerSuiteId, serviceTypeId);
  }

  async checkLicence(partnerSuiteId: number, serviceId: number, languageId: number) {
    await this.serviceTypeService.loadServiceTypes();
    let serviceTypeId = this.serviceTypeService.types.find(x => x.code == "CPR").id; //Ciberseguridad - Protection
    await this.licenceService.getUserLicence(partnerSuiteId, serviceId, languageId, serviceTypeId);
    this.licence = this.licenceService.globalLicence;
  }

  async setUserLicence() {
    this.loading = !this.loading;
    let partnerSuiteId = localStorage.getItem('partnerSuiteId');
    await this.licenceService.setUserLicencePR(Number(partnerSuiteId), this.partnerService.partner.languageId.toString(), this.protectionService.serviceId.toString());
    this.loading = !this.loading;
    this.licence = this.licenceService.globalLicence;
    if (this.licence) {
      $('#divPopupLicence').show();
    }
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }
}
