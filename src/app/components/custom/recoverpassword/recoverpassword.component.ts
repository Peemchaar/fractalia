import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Key } from 'src/app/models/key';
import { User } from 'src/app/models/user';
import { MessageService } from 'src/app/services/message.service';
import { PartnerService } from 'src/app/services/partner.service';
import { UserService } from 'src/app/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recoverpassword',
  templateUrl: './recoverpassword.component.html',
  styleUrls: ['./recoverpassword.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecoverpasswordComponent implements OnInit {
  public user: User = new User;
  public loading = false;
  public loadingPassword = false;
  public submitted = false;
  public updateError = false;
  public terms = false;
  public noActive = false;
  new = "password";
  repeat = "password";
  key: Key = new Key;
  public barLabel:string = "";
  public successpass:boolean = false;
  public slastPreviousAccessDate: string;
  public passwordExample: string = "";
  public staticContentUrl = environment.STATIC_CONTENT;


  constructor(public partnerService: PartnerService,
    public userService: UserService,
    private router: Router,
    private translate: TranslateService,
    private messageService: MessageService) { 
    /* if(this.partnerService.recover == null)
      this.router.navigate(['/']); 
      this.barLabel = this.translate.instant("CONTRASENA_MESSAGE"); */
    }

  ngOnInit() {
    if(this.userService.noActive == true){
      this.userService.noActive = false;
      this.noActive = true;
      this.user.partnerName = this.partnerService.partner.name;
      this.user.email = this.userService.email;
    }else{
      this.barLabel = this.translate.instant("CONTRASENA_MESSAGE");
      this.validateUserStatus()
    }
    
    // this.user = Object.assign({}, this.userService.currentUserValue);
    // this.slastPreviousAccessDate = this.user.lastPreviousAccessDate.toString().indexOf("Z") >= 0 ? this.user.lastPreviousAccessDate.toString() : this.user.lastPreviousAccessDate.toString()+ 'Z';
  }
  async onSubmitreset()
  {
      this.loadingPassword = true;
      this.key.recoverUID = this.partnerService.recover;
      await this.userService.updateUserKeyPassword(this.key).then(
        result => {
          this.translate.get('PASSWORD_MODIFIED').subscribe(res => this.messageService.add(res, "ok"));
          // this.userService.currentUserValue.passwordChanged = true;
          // localStorage.setItem('currentUser',JSON.stringify(this.userService.currentUserValue));
          this.loadingPassword = false;
          this.partnerService.recover == null
          this.router.navigate(['/']);
        },
        err => {
          this.loadingPassword = false;
          if(err.error === -2)
            this.translate.get('PASSWORD_ALREADY_REGISTERED_ERROR').subscribe(res => this.messageService.add(res, "error"));
          else if(err.error === -1)
            this.translate.get('PASSWORD_MODIFIED_ERROR').subscribe(res => this.messageService.add(res, "error"));
        }
      );
  }

  toogleNew()
  {
    if(this.new == "password")
      this.new = "text";
    else
      this.new = "password"
  }

  toogleRepeat()
  {
    if(this.repeat == "password")
      this.repeat = "text";
    else
      this.repeat = "password"
  }

  checkpass(success:boolean)
  {
    this.successpass = success;
    // let enforcePasswordComplexity = this.partnerService.partner.enforcePasswordComplexity;
    // if (enforcePasswordComplexity) 
    // {
    //   if (!success) { this.successpass = false; }
    //   if (success) { this.successpass = true; }
    // }
    // if (!enforcePasswordComplexity) 
    // {
    //   this.successpass = true;
    // }
  }

  generatePassword(){
    //const reg = /^(\d{12}[a-z]{1,2}[A-Z]{1,2}[!#$%&/()=?]{1,1})$/;
    const reg = /^([a-z]{4}\d{2}[A-Z]{4}[!@#$%&/()=?]{2})$/;
    const RandExp = require('randexp');
    const rdx = new RandExp(reg);
    let res = rdx.gen();
    this.passwordExample = res;
    // this.key.newKey = res;
    // this.key.repeatKey = res;
  }
  
  async validateUserStatus(){
    await this.userService.getusertokendata(this.partnerService.recover, "true").then(
      result => {
        this.user = Object.assign({}, result as User);
        if (this.user.checkTermsAcceptDate != true){
          this.noActive = true;
        }
      },
      err => {
        console.log("Error: ", err)
      });   
  }

}
