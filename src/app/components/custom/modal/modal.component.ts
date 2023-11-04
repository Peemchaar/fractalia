import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PartnerService } from 'src/app/services/partner.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit {

  @Input() name: string;
  @Input() desc: string;
  @Input() imageUrl: string;
  @Input() icon: string;
  @Input() translate?: boolean = false;
  @Input() subDesc? : any;
  @Input() formInputs? : any;
  @Input() buttons? : string;
  
  @Output() readonly submitted = new EventEmitter();
  dynamicForm: FormGroup;
  public accessLink = "";
  modalDisable: boolean = true;
  loading: boolean = false;
  
  constructor(public activeModal: NgbActiveModal,
    public partnerService: PartnerService) { 
    }

  ngOnInit() {
    this.formInputs? this.initForm() : null;
  }

  private initForm(){
    var tempInputs = {}
    this.formInputs.forEach((input: { name: string | number; }) => {
      tempInputs[input.name] = new FormControl('')

    });
    this.dynamicForm = new FormGroup(tempInputs)
    this.dynamicForm.valueChanges.subscribe(x => {
      this.dynamicForm.valid? this.modalDisable = false : this.modalDisable = true;
    })
  }

  private btnAction(action: any){
    action === ""? this.activeModal.dismiss('Cross click') : this.modalDisable == false? this.sendData() : null;
  }

  private sendData(){
    this.submitted.emit(this.dynamicForm.getRawValue())
    this.loading = true;
  }


}
