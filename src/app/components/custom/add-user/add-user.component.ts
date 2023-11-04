import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PartnerService } from 'src/app/services/partner.service';
import { UserService } from 'src/app/services/user.service';
import { FormGroup } from '@angular/forms';
import { User } from 'src/app/models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UserValidator } from 'src/app/validators/user.validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddUserComponent implements OnInit {
  public staticContentUrl = environment.STATIC_CONTENT;
  public profileForm: FormGroup;
  public user: User;
  public loginType: number;
  public loading = false;
  public submitted = false;
  public updateError = false;
  public AdminUserId: number;
  public image: string = `${this.staticContentUrl}img/add-user.png`;
  public partnerId: number;
  public showMessage: boolean = false;
  public message: string = "";
  public pendingUsers: number = 0;
  public isShowEid: boolean = false;
  public isShowEmail: boolean = false;
  public isShowRequiredEmail: boolean = false;


  constructor(
    public partnerService: PartnerService,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private translate: TranslateService,
    public sanitizer: DomSanitizer) {

    this.user = this.userService.currentUserValue;
    this.partnerId = this.user.partnerId;

  }

  async ngOnInit() {

    if (!this.userService.currentUserValue.isAdminUserId) {
      this.router.navigate(['/profile']);
      return;
    }

    await this.userService.getCompanyUsers();
    this.pendingUsers = this.userService.companyUser.pendingUsers;
    if (this.pendingUsers == 0) {
      this.router.navigate(['/profile']);
      // this.router.navigate(['/user-list']);
      return;
    }

    this.AdminUserId = +this.route.snapshot.paramMap.get('AdminUserId');
    this.user = new User();
    this.user.countryCode = "select";
    this.loading = false;
    this.loginType = this.partnerService.partner.loginType;

    this.ruleShowEid();
    this.ruleShowEmail();
    this.ruleShowRequiredEmail();
  }

  ruleShowEid()
  {
    if (this.loginType == 2 || this.loginType == 5)
    {
      this.isShowEid = true;
    }
  }

  ruleShowEmail()
  {
    this.isShowEmail = true;
  }

  ruleShowRequiredEmail()
  {
    if (this.loginType == 1 || this.loginType == 4 || this.loginType == 5 || this.loginType == 6)
    {
      this.isShowRequiredEmail = true;
    }
  }


  isValidString(str: string) {
    return str !== null && str !== undefined && typeof str === "string" && str.length > 0;
  }

  async onSubmit() {
    this.updateError = false;
    this.loading = true;
    if (!this.isValidString(this.user.name)) {
      this.message = this.translate.instant('MULTIUSER.VALIDATION1'); this.showMessage = true; this.loading = false; return;
    }

    if (this.loginType == 2 || this.loginType == 5) {
      if (!this.isValidString(this.user.eid)) {
        this.message = this.translate.instant('MULTIUSER.VALIDATION2').replace("{{identifier}}",this.partnerService.partner.uniqueIdentifier);
        this.showMessage = true; this.loading = false; return;
      }
    }

    if (this.loginType == 1 || this.loginType == 4 || this.loginType == 5 || this.loginType == 6) {
      if (!this.isValidString(this.user.email)) {
        this.message = this.translate.instant('MULTIUSER.VALIDATION3'); this.showMessage = true; this.loading = false; return;
      }

      if(UserValidator.validEmail(this.user.email)==null){
          this.message = this.translate.instant('MULTIUSER.VALIDATION4'); this.showMessage = true; this.loading = false; return;
      }
    }

    if(this.user.phone){
      if(UserValidator.validPhone(this.user.phone)==null){
        this.message = this.translate.instant('MULTIUSER.VALIDATION11'); this.showMessage = true; this.loading = false; return;
      }
    }

    this.showMessage = false;
    this.message = "";

    this.user.adminUserId = this.AdminUserId;
    this.user.partnerId = this.partnerId;
    if (this.image == `${this.staticContentUrl}img/profileDefaultMenu.png` || this.image == `${this.staticContentUrl}img/add-user.png` ) {
      this.user.profileImage = null;
    }
    else {
      this.user.profileImage = this.image;
    }

    this.user.typeUser="1";
    this.user.parentCompanyIdentification = this.userService.currentUserValue.companyIdentification;
    this.user.userSuites = this.userService.currentUserValue.userSuites;    
    if (this.user.countryCode !== 'select')
      this.user.country = this.partnerService.countries.find(x => x.code == this.user.countryCode).name;

    await this.userService.createCompanyUser(this.user , this.partnerService.partner.apiKey).then(
      (result: any) => {
        if (result.status != 200) {
          // this.message = result.message;
          this.message = this.translate.instant("COMP_USER.APIPROVISION.MESSAGE." + result.responseCode);
          this.showMessage = true;
          this.loading = false;
          return;
        }
        else {
          this.loading = false;
          this.translate.get('MULTIUSER.ADD_USER_OK').subscribe(res => this.messageService.add(res, "ok"));
          this.user = new User();
          this.image =`${this.staticContentUrl}img/add-user.png`;
          this.userService.getCompanyUsers().then(
            (result: any) => {
              this.router.navigate(['/user-list']);
              // if(this.userService.companyUser.pendingUsers<=0)
              //   this.router.navigate(['/services']);
            });
        }
      }, err => {
        this.loading = false;
        this.translate.get('MULTIUSER.ADD_USER_OK').subscribe(res => this.messageService.add(res, "error"));
        return;
      }
    );
  }

  getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  onUploadImagen($event: any) {
    const target = $event.target;
    if (target.files != null) {
      if (target.files.length > 0) {
        const file = target.files[0];
        const value = target.value.toLowerCase();
        const ext = value.split('.').pop();
        const name = target.name.toLowerCase();
        let exts = ["png", "jpg", "jpeg", "gif"];
        if (name == "favicon") {
          exts = ["png", "jpg", "jpeg", "gif", "ico"];
        }
        if (exts.indexOf(ext) != -1) {
          this.getBase64(file).then(result => {
            this.image = result.toString();
          });
        }
        else {
          this.translate.get('ONLY_IMAGES_ERROR').subscribe(res => this.messageService.add(res, "error"));
        }
      }
    }
  }


}







