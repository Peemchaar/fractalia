import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Injectable, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from './message.service';
import { environment } from 'src/environments/environment';
import { ElearningSso } from '../models/elearningSso';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../components/custom/modal/modal.component';
import { ServicesService } from './services.service';

@Component({
    selector: 'ngbd-modal-content',
    template: `
      <div class="modal-header">
        <h5><i class="{{iconService}}"></i> {{nameService}}</h5>
      </div>
      <hr>
      <div class="modal-body">
        <h6 class="modal-title">{{title}}</h6>
        <br>
        <p>{{message}}</p>
      </div>
      <hr>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" tabindex="-1" (click)="activeModal.close(true)">{{buttonTrue}}</button>
        <button type="button" class="btn btn-outline-dark" tabindex="-1" (click)="activeModal.close(false)">{{buttonFalse}}</button>
      </div>
    `
})
export class NgbdModalContent {
    @Input() iconService;
    @Input() nameService;
    @Input() title;
    @Input() message;
    @Input() buttonTrue;
    @Input() buttonFalse;
  
    constructor(public activeModal: NgbActiveModal) {}
}

@Injectable({
    providedIn: 'root'
})
export class ElearningService {

    public elearningSso: ElearningSso;

    constructor(private http: HttpClient,
        private messageService: MessageService,
        private modalService: NgbModal,
        private serviceService: ServicesService,
        private translate: TranslateService) { }

    public async OpenSso() {
        return this.http.get<ElearningSso>(environment.apiEndpoint + "api/elearning/get_ssourl").toPromise().then(async result => {
            if (result) {
                if(!result.error)
                {
                    this.elearningSso = result;
                    // console.log(this.elearningSso);
                    var elearningUrl = this.elearningSso.url + "?email=" + encodeURIComponent(this.elearningSso.email) + "&token=" + this.elearningSso.token;
                    if(result.userCreatedNow)
                    {
                        // Crear popup con mensaje de que el alta puede tardar unos minutos
                        var serviceELE = this.serviceService.userServices.find(x=>x.typeCode == "ELE");
                        const modalRef = this.modalService.open(NgbdModalContent);
                        modalRef.componentInstance.iconService = serviceELE.icon;
                        modalRef.componentInstance.nameService = serviceELE.name;
                        modalRef.componentInstance.title = this.translate.instant('CYBERSECURITY.ELEARNING.TITLE');
                        modalRef.componentInstance.message = this.translate.instant('CYBERSECURITY.ELEARNING.MESSAGE');
                        modalRef.componentInstance.buttonTrue = this.translate.instant('CYBERSECURITY.ELEARNING.BUTTON_TRUE');
                        modalRef.componentInstance.buttonFalse = this.translate.instant('CYBERSECURITY.ELEARNING.BUTTON_FALSE');
                        modalRef.result.then((userResponse) => {
                            if(userResponse)
                                window.open(elearningUrl , '_blank');
                          });
                    }
                    else
                    {
                        await new Promise(f => setTimeout(f, 1000));
                        window.open(elearningUrl , '_blank');
                    }
                }
                else {
                    this.messageService.add(this.translate.instant('CYBERSECURITY.ELEARNING.ERROR'), "error");
                }
            }
            else {
                this.messageService.add(this.translate.instant('CYBERSECURITY.ELEARNING.ERROR'), "error");
            }
        });
    }

    public async activationSimple(){
        return this.http.get<ElearningSso>(environment.apiEndpoint + "api/elearning/get_ssourl").toPromise();
    }
}
