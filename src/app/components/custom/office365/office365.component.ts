import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceService } from 'src/app/services/licence.service';
import { Office365Service } from 'src/app/services/office365.service';
import { PartnerService } from 'src/app/services/partner.service';
import { LocalService } from 'src/app/services/local.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component';

declare var $: any;

@Component({
  selector: 'app-office365',
  templateUrl: './office365.component.html',
  styleUrls: ['./office365.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Office365Component {
  public staticContentUrl = environment.STATIC_CONTENT;
  public licence: string = "";
  loading = true;
  activated = false;
  tempDes = "<div class=\"row mr-0 ml-0\"><div class=\"col-md-12 col-sm-12 prod-col\"><p class=\"prod-text\">Para comenzar a sacar el máximo partido a Orange Office 365, completa las opciones del siguiente formulario y a continuación selecciona 'Enviar'.</p></div></div>";
  tempSubDes = "<div class=\"row mr-0 ml-0\"><div class=\"col-md-12 col-sm-12 prod-col\"><div class=\"mt-3\"><ul><li class=\"prod-text\"><b>Alta:</b> Seleccione esta opción si es la 1ª vez que activa el servicio con Orange Office 365.</li><li class=\"prod-text\"><b>Portabilidad:</b> Seleccione esta opción si desea activar el servicio con Orange Office 365 pero ya tienes licencia con otro proveedor.</li></ul></div></div></div>"
  tempIcon = "myicons-office365"
  tempTittle = "Activar suscripción"
  tempInputs = [  
    {
      name: "subscription",
      type: "select",
      label: "Datos del solicitante*:",
      options: [
        {
          des: "Alta",
          value: "01"
        },
        {
          des: "Portabilidad",
          value: "02"
        }
      ]
    }
  ];
  
  tempButtons = [
    {
      name: "Enviar",
      action : "submit",
      type: "btn btn-primary"
    },
    {
      name: "Cancelar",
      action: "",
      type: "btn btn-outline-modal"
    }
  ];
  constructor(public licenseService: LicenceService,
    public office365Service: Office365Service,
    private router: Router,
    private modalService: NgbModal,
    private partnerService: PartnerService,
    private localService: LocalService) {
    if (this.getLocalStorage('currentService') == null) {
      this.router.navigate(['/']);
      return;
    }
    else {
      let service = this.getLocalStorage('currentService');
      licenseService.serviceId = service.id;
      licenseService.serviceName = service.name;
      licenseService.serviceIcon = service.icon;
      licenseService.serviceDesc = service.desc;
      licenseService.longDesc = service.longDesc;
      this.checkOffice365Activate();
    }
  }


  async checkOffice365Activate() {
    this.office365Service.GetUserOffice365Licence().then(result => {
      this.activated = this.office365Service.activated;
      this.loading = false;
    });
  }

  async activateOffice365() {
    this.loading = true;
    this.office365Service.SetUserOffice365Licence().then(result => {
      this.activated = this.office365Service.activated;
      this.loading = false;
    });
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);
  }

  private subscribeOffice(option){

  }

  open() {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.name = this.tempTittle;
    modalRef.componentInstance.desc = this.tempDes;
    modalRef.componentInstance.subDesc = this.tempSubDes;
    modalRef.componentInstance.icon = this.tempIcon;
    modalRef.componentInstance.formInputs = this.tempInputs;
    modalRef.componentInstance.buttons = this.tempButtons;
    modalRef.componentInstance.submitted.subscribe(res => this.subscribeOffice(res));
    
  }

}
