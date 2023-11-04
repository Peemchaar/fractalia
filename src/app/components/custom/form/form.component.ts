import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PartnerService } from 'src/app/services/partner.service';
import { FormService } from 'src/app/services/form.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormComponent implements OnInit {

  fields: FormData[];
  payLoad;

  constructor(public partnerService: PartnerService,
    public formService: FormService,
    public userService: UserService) { 
   }

  async ngOnInit() {
    await this.formService.getFormFields(this.formService.serviceId).then(result => {this.fields = result});
  }
}
