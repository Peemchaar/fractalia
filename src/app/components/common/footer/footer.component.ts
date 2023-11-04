import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { PartnerService } from 'src/app/services/partner.service';
import { LanguageService } from 'src/app/services/language.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CallmebackComponent } from 'src/app/components/custom/callmeback/callmeback.component';
import { CallComponent } from './../../common/call/call.component';

//TEST

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent implements OnInit {

  constructor(public userService: UserService,
    public partnerService: PartnerService,
    private modalService: NgbModal,
    public languageService: LanguageService) { }
    public termLink : string = "Términos y condiciones"

    ngOnInit() {
      if(this.languageService.lan==="es-ES"){
        this.termLink = "Términos y condiciones";
      }
      else if(this.languageService.lan==="pt-BR"){
        this.termLink = "Termos e condições do serviço";
      }
    }

    abrirC2C(){
      let ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        size:'sm',
        windowClass:"dialpad"
      };
      const modalRef = this.modalService.open(CallComponent, ngbModalOptions);
        modalRef.componentInstance.name = "Call";
        modalRef.componentInstance.icon = "icon-call-me-back"
    }
    abrirCMB(){
      const modalRef = this.modalService.open(CallmebackComponent);
      modalRef.componentInstance.name = "Call me back";
      modalRef.componentInstance.icon = "icon-call-me-back";

    }
}
