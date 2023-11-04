import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PartnerService } from 'src/app/services/partner.service';

@Component({
  selector: 'app-modal',
  templateUrl: './deleteusermodal.component.html',
  styleUrls: ['./deleteusermodal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeleteUserModalComponent implements OnInit {

  @Input() usuario: string;
  
  constructor(public activeModal: NgbActiveModal,
    public partnerService: PartnerService) { 
    }

  ngOnInit() {
  }

}
