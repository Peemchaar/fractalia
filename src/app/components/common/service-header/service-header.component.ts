import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { PartnerService } from 'src/app/services/partner.service';
import { LanguageService } from 'src/app/services/language.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { ModalComponent } from 'src/app/components/custom/modal/modal.component';

@Component({
  selector: 'app-service-header',
  templateUrl: './service-header.component.html',
  styleUrls: ['./service-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ServiceHeaderComponent implements OnInit {
  @Input() serviceName: string;
  @Input() serviceLongDesc: string;
  @Input() serviceDesc: string;
  @Input() serviceIcon: string;

  
  constructor(public userService: UserService,
    public partnerService: PartnerService,
    private modalService: NgbModal,
    public languageService: LanguageService) { }


    ngOnInit() {

    }

    open() {
      const modalRef = this.modalService.open(ModalComponent);
      modalRef.componentInstance.name = this.serviceName;
      modalRef.componentInstance.desc = this.serviceLongDesc;
      modalRef.componentInstance.icon = this.serviceIcon;
    }
}
