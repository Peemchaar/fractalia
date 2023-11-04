import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RegisterCodeRequest } from 'src/app/models/registerCodeRequest';
import { MessageService } from 'src/app/services/message.service';
import { PartnerService } from 'src/app/services/partner.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit {

  code: string;
  public loading = false;
  public redirecting = false;
  returnUrl: string;
  public registerFormStep = 0;
  registerCodeForm: FormGroup;
  public userPlaceholder: string;

  constructor(
    public partnerService: PartnerService,
    private formBuilder: FormBuilder,
    public userService: UserService,
    private translate: TranslateService,
    private messageService: MessageService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.registerCodeForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
      code: new FormControl('', [
        Validators.required,
        Validators.pattern(new RegExp("\\S"))])
    });
    this.translate.get('COMP_SIGNUP.ENTER_CODE').toPromise().then((res) =>
      this.userPlaceholder = res.replaceAll("{{identifier}}", this.partnerService.partner.uniqueIdentifier))
    this.registerCodeForm.controls.code.setValue(localStorage.getItem('registerCode'));
    if(this.partnerService.partner.loginType === 6 && this.registerCodeForm.controls.code.value !== null && this.registerCodeForm.controls.code.value !== '' && this.registerCodeForm.controls.code.value !== undefined)
      this.registerCodeForm.controls.code.disable();
  }

  get register() { return this.registerCodeForm.controls; }
  get inputRegisterEmail() {
    return this.registerCodeForm.get('email')
  }
  get inputRegisterCode() {
    return this.registerCodeForm.get('code')
  }

  registerCode() {
    this.loading = true;
    var request = new RegisterCodeRequest();
    request.registerCode = this.register.code.value.trim();
    request.partnerId = this.partnerService.partner.id;
    request.email = this.register.email.value.trim();
    this.userService.registerCode(request).then(
      result => {
        this.loading = false;
        switch (result) {
          case -2:
            this.messageService.add(this.translate.instant('REGISTER_FORM.RESULT_ERROR3'), "error");
            break;
          case -1:
            this.messageService.add(this.translate.instant('REGISTER_FORM.RESULT_ERROR1').replaceAll("{{identifier}}", this.partnerService.partner.uniqueIdentifier), "error");
            break;
          case 0:
            this.messageService.add(this.translate.instant('REGISTER_FORM.RESULT_ERROR2').replaceAll("{{identifier}}", this.partnerService.partner.uniqueIdentifier), "error");
            break;
          case 1:
            this.messageService.add(this.translate.instant('REGISTER_FORM.RESULT_OK'), "ok");
            this.router.navigate(['/']);
            break;
        }
      })
  }

  goLoginPage() {
    this.router.navigate(['']);
  }
}
