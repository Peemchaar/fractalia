import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Callmeback } from 'src/app/models/callmeback';
import { FormService } from 'src/app/services/form.service';
import { UserValidator } from 'src/app/validators/user.validator';
import { MessageService } from 'src/app/services/message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-callmeback',
  templateUrl: './callmeback.component.html',
  styleUrls: ['./callmeback.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CallmebackComponent implements OnInit, OnDestroy {

  @Input() name: string;
  @Input() icon: string;

  public data: Callmeback = new Callmeback;
  loading = false;
  postError = false;
  submitted = false;
  public showMessage: boolean = false;
  public message: string = "";

  constructor(
    public activeModal: NgbActiveModal,
    public userService: UserService,
    public formService: FormService,
    private router: Router,
    private messageService: MessageService,
    private translate: TranslateService) {
      
    }

  ngOnInit() {
    // console.log("ngOnInit");
    // console.log(this.userService.currentUserValue);
    if(this.formService.formCallmeback && this.formService.formCallmeback.message)
    {
      // console.log("Cargamos de Service");
      this.data = this.formService.formCallmeback;
    }
    else if(this.userService.currentUserValue)
    {
      // console.log("Cargamos datos del usuario");
      this.data.name = this.userService.currentUserValue.name;
      this.data.surname = this.userService.currentUserValue.surname;
      this.data.email = this.userService.currentUserValue.email;
      this.data.phone = this.userService.currentUserValue.phone;
      this.data.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  }
  public ngOnDestroy(): void {
    // console.log("ngOnDestroy");
    this.formService.formCallmeback = this.data;
  }
  onSubmit() {
    // console.log("onSubmit");
    this.showMessage = false 
    // if (this.data.phone != null && this.data.phone.length > 0) {
    //   if (UserValidator.validPhone(this.data.phone) == null) {
    //     this.message = this.translate.instant('MULTIUSER.VALIDATION11'); this.showMessage = true; this.loading = false; return;
    //   }
    // }
    if (UserValidator.validEmail(this.data.email) == null) {
      this.message = this.translate.instant('MULTIUSER.VALIDATION4'); this.showMessage = true; this.loading = false; return;
    }

    this.postError = false;
    this.submitted = true;
    this.loading = true;
    this.translate.get('FORM_ENVIANDO').subscribe(res => this.messageService.add(res, "ok"));
    this.formService.postCallmeback(this.data).then(result => {
      this.loading = false;
      this.translate.get('FORM_ENVIADO').subscribe(res => this.messageService.add(res, "ok"));
      this.activeModal.close();
    }, error => {
      this.translate.get('ERROR_ENVIO_FORM').subscribe(res => {
        this.messageService.add(res, "error"); this.postError = true;
        this.loading = false;
      });
    });
  }

}
