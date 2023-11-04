import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-desactiveservicemodal',
  templateUrl: './desactiveservicemodal.component.html',
  styleUrls: ['./desactiveservicemodal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DesactiveservicemodalComponent implements OnInit {

  @Input() message: string;
  
  constructor(public activeModal: NgbActiveModal) { 
    }

  ngOnInit(): void {
  }

}
