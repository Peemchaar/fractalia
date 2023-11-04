import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AgentData } from 'src/app/models/agentData';
import { UserService } from 'src/app/services/user.service';
import { DownloadService } from 'src/app/services/download.service';
import { Router } from '@angular/router';
import { TruncateService } from 'src/app/services/truncate.service';
import { PartnerService } from 'src/app/services/partner.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AgentComponent {


  agentData: AgentData = new AgentData();

  constructor(public downloadService: DownloadService,
    public userService: UserService,
    public truncateService: TruncateService,
    private router: Router,
    private partnerService:PartnerService,
    private localService: LocalService) { 

      if(downloadService.serviceId)
      {
        if(this.getLocalStorage('currentService') == null){
          this.router.navigate(['/']);
          return;
        }
        else{ // If refresh
          let suiteColor = localStorage.getItem('suiteColor');
          let suiteGradColor = localStorage.getItem('suiteGradColor');
          let service = this.getLocalStorage('currentService');
          userService.selSuiteColor = suiteColor;
          userService.selSuiteGradColor = suiteGradColor;
          downloadService.serviceId = service.id;          
          downloadService.serviceName = service.name;
          downloadService.serviceIcon = service.icon;
          downloadService.serviceDesc= service.desc;   
          downloadService.longDesc= service.longDesc; 
        }
      }
      else 
      {
        let suiteColor = localStorage.getItem('suiteColor');
        let suiteGradColor = localStorage.getItem('suiteGradColor');
        let service = this.getLocalStorage('currentService');
        userService.selSuiteColor = suiteColor;
        userService.selSuiteGradColor = suiteGradColor;
        downloadService.serviceId = service.id;          
        downloadService.serviceName = service.name;
        downloadService.serviceIcon = service.icon;
        downloadService.serviceDesc= service.desc;   
        downloadService.longDesc= service.longDesc;  
      }

      this.loadDownload();
  }

  async loadDownload() {
    await this.downloadService.getDownload(this.partnerService.partner.languageId);
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
}

}
