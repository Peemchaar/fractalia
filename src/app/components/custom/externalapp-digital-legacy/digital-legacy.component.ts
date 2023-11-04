import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ExternalDigitalLegacyRequest } from 'src/app/models/externalDigitalLegacyRequest';
import { ExternalappDigitalLegacyService } from 'src/app/services/externalapp-digital-legacy.service';
import { UserService } from 'src/app/services/user.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-digital-legacy',
  templateUrl: './digital-legacy.component.html',
  styleUrls: ['./digital-legacy.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DigitalLegacyComponent implements OnInit {

  loading = false;
  public digitalLegacyReq: ExternalDigitalLegacyRequest = new ExternalDigitalLegacyRequest;
  public isRequested = false;
  constructor(
    public externalAppLegacyService: ExternalappDigitalLegacyService,
    private router: Router,
    public translate: TranslateService,
    public userService: UserService,
    private localService: LocalService) {
    if (externalAppLegacyService.serviceId) {
      if (this.getLocalStorage('currentService') == null) {
        this.router.navigate(['/']);
        return;
      }
      else { // If refresh
        let service = this.getLocalStorage('currentService');
        externalAppLegacyService.serviceId = service.id;
        externalAppLegacyService.serviceName = service.name;
        externalAppLegacyService.serviceIcon = service.icon;
        externalAppLegacyService.serviceDesc = service.desc;
        externalAppLegacyService.longDesc = service.longDesc;
        externalAppLegacyService.serviceType = localStorage.getItem('serviceType');
      }
    }
    else {
      let service = this.getLocalStorage('currentService');
      externalAppLegacyService.serviceId = service.id;
      externalAppLegacyService.serviceName = service.name;
      externalAppLegacyService.serviceIcon = service.icon;
      externalAppLegacyService.serviceDesc = service.desc;
      externalAppLegacyService.longDesc = service.longDesc;
      externalAppLegacyService.serviceType = localStorage.getItem('serviceType');
    }
  }

  ngOnInit(): void {
    this.checkIsRequested();
  }

  async onSubmit() {
    this.loading = true;  
    if (this.externalAppLegacyService.serviceType === "ELD") this.digitalLegacyReq.digitalLegacy = true;
    else if (this.externalAppLegacyService.serviceType === "EVD") this.digitalLegacyReq.digitalLife = true;    
    else if (this.externalAppLegacyService.serviceType === "ETD") this.digitalLegacyReq.digitalTestament = true;
    await this.externalAppLegacyService.postDigitalLegacy(this.digitalLegacyReq);
    this.checkIsRequested();
    this.loading = false;
  }

  public checkIsRequested(){
    if (this.userService.currentUserValue.hasExtDigitalLegacyRequested && this.externalAppLegacyService.serviceType === "ELD") this.isRequested = true;
    if (this.userService.currentUserValue.hasExtDigitalLifeRequested && this.externalAppLegacyService.serviceType === "EVD") this.isRequested = true;    
    if (this.userService.currentUserValue.hasExtDigitalTestamentRequested && this.externalAppLegacyService.serviceType === "ETD") this.isRequested = true;
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }
}
