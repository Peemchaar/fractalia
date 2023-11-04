import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { PartnerService } from 'src/app/services/partner.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/message.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResetpasswordComponent implements OnInit {
  public staticContentUrl = environment.STATIC_CONTENT;
  public loading = false;
  submitted = false;
  returnUrl: string;
  public backgroundImage: string;
  public registerFormStep = 0;
  emailFromGroup: FormGroup;
  public parsedParams: any;
  public login: string = "";
  public emailSent = false;
  private email = "email"

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    public partnerService: PartnerService,
    private messageService: MessageService,
    private translate: TranslateService,
    private router: Router) {
  }
  ngOnInit() {
    if (this.partnerService.partner.loginType === 5) {
      this.emailFromGroup = this.formBuilder.group({
        eid: ["", Validators.required]
      });
    }
    else {
      this.emailFromGroup = this.formBuilder.group({
        email: ["", [Validators.required, Validators.email]]
      });
    }

  }

  get inputResetPassword() {
    return this.emailFromGroup.get('email')
  }

  get eidResetPassword() {
    return this.emailFromGroup.get('eid')
  }

  onSubmitFrmPass(frm: any) {
    this.userService.recoverPassword(frm.value.email, this.partnerService.partner.id.toString(), frm.value.eid).then(result => {
      if (result == true) {
        this.emailSent = true;
        document.getElementById("CloseDeletePopup").click();
        this.translate.get('RECOVER_PASSWORD.OK').subscribe(res => this.messageService.add(res, "ok"));
      }
      else {
        this.userService.noActive = true;
        this.userService.email = frm.value.email;
        this.router.navigate(['/recoverpassword'])
        this.translate.get('RECOVER_PASSWORD.FAIL').subscribe(res => this.messageService.add(res, "error"));
      }
    });
  }
  goLoginPage() {
    this.router.navigate(['']);
  }
}

