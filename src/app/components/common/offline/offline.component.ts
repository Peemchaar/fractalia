import { Component, ViewEncapsulation } from '@angular/core';
import { PartnerService } from 'src/app/services/partner.service';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OfflineComponent {

  public backgroundImage: string;
  constructor(public partnerService: PartnerService) { }

  ngAfterContentInit(){
    if(this.partnerService.partner.login != null && this.partnerService.partner.login != ""){
      this.backgroundImage = 'url(' + this.partnerService.partner.login + ')';
    }
    else{ // Get default
      this.backgroundImage = '';
    }
  }

}
