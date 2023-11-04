import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { InformationService } from 'src/app/services/information.service';
import { Router } from '@angular/router';
import { TruncateService } from 'src/app/services/truncate.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InformationComponent implements OnInit {

  constructor(
    public userService: UserService,
    public informationService: InformationService,
    public truncateService: TruncateService,
    private router: Router,
    private localService: LocalService) { 
      if(informationService.serviceId == undefined)
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
          informationService.serviceId = service.id;          
          informationService.serviceName = service.name;
          informationService.serviceIcon = service.icon;
          informationService.serviceDesc= truncateService.removeHTML(service.desc);    
          informationService.longDesc= service.longDesc;   
        }
      }
    }

  ngOnInit() {
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }

}
