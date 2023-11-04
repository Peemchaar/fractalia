import { Component, ViewEncapsulation } from '@angular/core';
import { ExternalLicenseService } from 'src/app/services/externallicense.service';
import { UserService } from 'src/app/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { TruncateService } from 'src/app/services/truncate.service';
import { LocalService } from 'src/app/services/local.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-externallicense',
  templateUrl: './externallicense.component.html',
  styleUrls: ['./externallicense.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExternalLicenseComponent {

  public externalLicenseCode: string = "";
  loading = false;
  public staticContentUrl = environment.STATIC_CONTENT;
  constructor(public externalLicenseService: ExternalLicenseService,
    public userService: UserService,
    public truncateService: TruncateService,
    private router: Router,
    public translate: TranslateService,
    private localService: LocalService) { 
      if(externalLicenseService.serviceName) 
      {
        if(this.getLocalStorage('currentService') == null){
          this.router.navigate(['/']);
          return;
        }
        else{ // If refresh
          let service = this.getLocalStorage('currentService');
          let suiteColor = localStorage.getItem('suiteColor');
          let suiteGradColor = localStorage.getItem('suiteGradColor');
          userService.selSuiteColor = suiteColor;
          userService.selSuiteGradColor = suiteGradColor;
          externalLicenseService.serviceId = service.id;          
          externalLicenseService.serviceName = service.name;
          externalLicenseService.serviceIcon = service.icon;
          externalLicenseService.serviceDesc= service.desc;
          externalLicenseService.longDesc= service.longDesc; 
          externalLicenseService.serviceCode = service.code;
          this.checkExternalLicense(externalLicenseService.serviceCode); 
        }
      }
      else 
      {
        let service = this.getLocalStorage('currentService');
        let suiteColor = localStorage.getItem('suiteColor');
        let suiteGradColor = localStorage.getItem('suiteGradColor');
        userService.selSuiteColor = suiteColor;
        userService.selSuiteGradColor = suiteGradColor;
        externalLicenseService.serviceId = service.id;          
        externalLicenseService.serviceName = service.name;
        externalLicenseService.serviceIcon = service.icon;
        externalLicenseService.serviceDesc= service.desc;
        externalLicenseService.longDesc= service.longDesc;  
        externalLicenseService.serviceCode = service.code;
        this.checkExternalLicense(externalLicenseService.serviceCode); 
      }
    }

  async checkExternalLicense(serviceCode: string)
  {
    await this.externalLicenseService.getUserExternalLicenseData(serviceCode);
    this.externalLicenseCode = this.externalLicenseService.externalLicenseCode === null ? this.translate.instant('ANTIVIRUS.NO_LICENSE') : this.externalLicenseService.externalLicenseCode;
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }
}
