import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AttackSimulatorStats } from 'src/app/models/attackSimulatorStats';
import { AttacksimulatorService } from 'src/app/services/attacksimulator.service';
import { MessageService } from 'src/app/services/message.service';
import { MonitoredIdentitiesService } from 'src/app/services/monitored-identities.service';
import { UserService } from 'src/app/services/user.service';
import { UserValidator } from 'src/app/validators/user.validator';
import { environment } from 'src/environments/environment';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '../infomodal/infomodal.component';

declare var $ : any;

@Component({
  selector: 'app-attacksimulator-integrated',
  templateUrl: './attacksimulator-integrated.component.html',
  styleUrls: ['./attacksimulator-integrated.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AttacksimulatorIntegratedComponent implements OnInit {

  @Input() serviceName: string;
  @Input() serviceIcon: string;
  
  loading = false;
  modalRef: NgbModalRef;
  public showMessage: boolean = false;
  public errorMessage: string = "";
  public attacksimulatorStats = new AttackSimulatorStats();
  public staticContentUrl = environment.STATIC_CONTENT;
  constructor(
    public attacksimulatorService: AttacksimulatorService,
    private formBuilder: FormBuilder,
    public messageService: MessageService,
    public translate: TranslateService,
    public modalService: NgbModal,
    public userService: UserService) {
    
      this.loadData();
  
  }

  ngOnInit() {
    
  }

  async loadData() {
    
    await this.attacksimulatorService.GetAttackSimulatorStats().then(
      result => {
        this.loading = false;
        this.attacksimulatorStats  = this.attacksimulatorService.stats;
      }
    );
  }

  createUser() {
    this.loading = true;
    this.attacksimulatorService.CreateAttackSimulatorEndUser().then(
      result => {
        // alert(result);
        if(result)
        {
          this.messageService.add(this.translate.instant('COMP_ATTACKSIMULATOR.MESSAGE_CREATE_OK'), "ok");
          this.loadData();
        }
        else
          this.messageService.add(this.translate.instant('COMP_ATTACKSIMULATOR.MESSAGE_CREATE_ERROR'), "error");
        this.loading = false;
      }
    );
  }

  createFamily() {
    if(this.userService.currentUserValue.email != null)
    {
      this.loading = true;
      this.attacksimulatorService.CreateAttackSimulatorFamily().then(
        result => {
          // alert(result);
          if(result.status == 200)
          {
            this.messageService.add(this.translate.instant('COMP_ATTACKSIMULATOR.MESSAGE_CREATE_OK'), "ok");
            this.loadData();
          }
          else
            this.messageService.add(result.message, "error");
            // this.messageService.add(this.translate.instant('COMP_ATTACKSIMULATOR.MESSAGE_CREATE_ERROR'), "error");
          this.loading = false;
        }
      );
    }
    else
    {
      const modalRef = this.modalService.open(InfoModalComponent);
      modalRef.componentInstance.message = this.translate.instant('EMAIL_REQUIRED');
    }
  }
}
