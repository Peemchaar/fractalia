import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './infomodal.component.html',
  styleUrls: ['./infomodal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InfoModalComponent implements OnInit {

  @Input() message: string;
  
  constructor(public activeModal: NgbActiveModal) { 
    }

  ngOnInit() {
  }

}
