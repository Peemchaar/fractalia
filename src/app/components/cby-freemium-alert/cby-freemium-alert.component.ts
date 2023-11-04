import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cby-freemium-alert',
  templateUrl: './cby-freemium-alert.component.html',
  styleUrls: ['./cby-freemium-alert.component.scss']
})
export class CbyFreemiumAlertComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
  ) {

   }

  ngOnInit() {
  }

}
