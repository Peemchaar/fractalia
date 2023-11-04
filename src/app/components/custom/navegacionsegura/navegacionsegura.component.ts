import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CiberalarmaService } from 'src/app/services/ciberalarma.service';
import { LocalService } from 'src/app/services/local.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '../infomodal/infomodal.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navegacionsegura',
  templateUrl: './navegacionsegura.component.html',
  styleUrls: ['./navegacionsegura.component.scss']
})
export class NavegacionseguraComponent {

  loading = false;
  error = false;
  urlSsoCiberalarma = "";
  modalRef: NgbModalRef;
  public staticContentUrl = environment.STATIC_CONTENT;
  constructor(public ciberalarmaService: CiberalarmaService,
    private router: Router,
    public modalService: NgbModal,
    private localService: LocalService,
    public translate: TranslateService,
    public userService: UserService) {
    if (this.getLocalStorage('currentService') == null) 
    {
      this.router.navigate(['/']);
      return;
    }
    else
    {
      let service = this.getLocalStorage('currentService');
      ciberalarmaService.serviceId = service.id;
      ciberalarmaService.serviceCode = service.code;
      ciberalarmaService.serviceName = service.name;
      ciberalarmaService.serviceIcon = service.icon;
      ciberalarmaService.serviceDesc = service.desc;
      ciberalarmaService.longDesc = service.longDesc;      
    }
    this.error = false;
  }

  async accessCiberalarma() {
    if(this.userService.currentUserValue.email != null)
    {
      this.loading = true;
      this.ciberalarmaService.AccessCiberalarma().then(result => {
        // console.log(result);
        if(result != "")
          window.open(result, "_blank");
        else
          this.error = true;
        this.loading = false;
      });
    }
    else
    {
      const modalRef = this.modalService.open(InfoModalComponent);
      modalRef.componentInstance.message = this.translate.instant('EMAIL_REQUIRED');
    }
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }

}
