import { Result } from './../../../models/result';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PartnerService } from 'src/app/services/partner.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { Key } from 'src/app/models/key';
import { DomSanitizer } from '@angular/platform-browser';
import { UserValidator } from 'src/app/validators/user.validator';
import { LanguageService } from 'src/app/services/language.service';
import { UserNotificationConfig } from 'src/app/models/userNotificationConfig';
import { ImageUtils } from 'src/app/utils/ImageUtils';
import { LocalService } from 'src/app/services/local.service';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { NotificationType, UserPost } from 'src/app/models/userPost';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProfileComponent implements OnInit {
  public staticContentUrl = environment.STATIC_CONTENT;
  public user: User;
  public loading_page = true;
  public loading = false;
  public loadingPassword = false;
  public submitted = false;
  public updateError = false;
  public terms = false;
  public image: string = `${this.staticContentUrl}img/add-user.png`;
  public old = "password";
  public new = "password";
  public repeat = "password";
  public key: Key = new Key;
  public showMessage: boolean = false;
  public message: string = "";
  public loginType: number;
  public isReadOnlyEmail: boolean = false;
  public isShowEid: boolean = false;
  public isShowEmail: boolean = false;
  public isShowRequiredEmail: boolean = false;
  public barLabel: string = "";
  public successpass: boolean = false;
  public slastPreviousAccessDate: string;
  public passwordExample: string = "";
  public userNotificationConfig: UserNotificationConfig = new UserNotificationConfig;
  public loadingNotificationConfig = false;
  public elearningNotification : boolean = false;

  constructor(
    public partnerService: PartnerService,
    public userService: UserService,
    private router: Router,
    private messageService: MessageService,
    private translate: TranslateService,
    public sanitizer: DomSanitizer,
    public languageService: LanguageService,
    private localService: LocalService) {
      this.loading_page = true;
      this.barLabel = this.translate.instant("CONTRASENA_MESSAGE");
      this.user = Object.assign({}, this.userService.currentUserValue);
      this.terms = this.user.checkTermsAcceptDate;
      this.loginType = this.partnerService.partner.loginType;
      this.generatePassword();
    }

  ngOnInit() {
    this.ruleShowEid();
    this.ruleShowEmail();
    this.ruleShowRequiredEmail();
    this.readOnlyEmail();

    this.user = Object.assign({}, this.userService.currentUserValue);
    if (!this.user.checkTermsAcceptDate && this.getLocalStorage('tmpUser')) {
      this.user = Object.assign({}, this.getLocalStorage('tmpUser'));
      localStorage.removeItem('tmpUser')
    }
    if (this.user.profileImage !== null) {
      this.image = this.user.profileImage;
    }
    this.slastPreviousAccessDate = this.user.lastPreviousAccessDate.toString()+ 'Z';
    this.loading_page = false;
     this.userService.getUserNotificationConfig(this.user.id).then(
       result => {
         this.userNotificationConfig = this.userService.userNotificationConfig;
         this.user.activeNewsletter = this.userNotificationConfig.activeNewsletter
         /* if(this.userNotificationConfig.showUserPost) {
           this.loadElearningNotification();
         } */
       }
     );
  }

  checkTerms(e: any) {
    this.terms = e.target.checked;
  }

  isValidString(str: string) {
    return str !== null && str !== undefined && typeof str === "string" && str.length > 0;
  }

  ruleShowEid() {
    this.isShowEid = this.loginType == 2 || this.loginType == 3 || this.loginType == 10 || this.loginType == 5 || this.loginType == 7 || this.loginType == 8;
  }

  ruleShowEmail() {
    this.isShowEmail = true;
  }

  ruleShowRequiredEmail() {
    this.isShowRequiredEmail = this.loginType == 1 || this.loginType == 4 || this.loginType == 5 || this.loginType == 6;
  }

  readOnlyEmail() {
    this.isReadOnlyEmail = this.loginType == 1 || this.loginType == 4 || this.loginType == 9 || this.loginType == 6;
  }

  onSubmit() {
    // console.log("ONSUBMIT");
    this.updateError = false;
    this.submitted = true;
    if (this.user.name != null)
      this.user.name = this.user.name.trim();
    if (this.user.surname != null)
      this.user.surname = this.user.surname.trim();
    if (this.user.email != null)
      this.user.email = this.user.email.trim();
    if (this.user.eid != null)
      this.user.eid = this.user.eid.trim();
    if (this.user.phone != null)
      this.user.phone = this.user.phone.trim();

    this.loading = true;
    if (!this.isValidString(this.user.name)) {
      this.message = this.translate.instant('MULTIUSER.VALIDATION1'); this.showMessage = true; this.loading = false; return;
    }
    if (this.loginType == 2 || this.loginType == 5) {
      if (!this.isValidString(this.user.eid)) {
        this.message = this.translate.instant('MULTIUSER.VALIDATION2').replace("{{identifier}}", this.partnerService.partner.uniqueIdentifier); this.showMessage = true; this.loading = false; return;
      }
    }
    if (this.user.email != null && this.user.email.length > 0) {
      if (!this.isValidString(this.user.email)) {
        this.message = this.translate.instant('MULTIUSER.VALIDATION3'); this.showMessage = true; this.loading = false; return;
      }
      if (UserValidator.validEmail(this.user.email) == null) {
        this.message = this.translate.instant('MULTIUSER.VALIDATION4'); this.showMessage = true; this.loading = false; return;
      }
    }
    if (this.user.phone != null && this.user.phone.length > 0) {
      if (UserValidator.validPhone(this.user.phone) == null) {
        this.message = this.translate.instant('MULTIUSER.VALIDATION11'); this.showMessage = true; this.loading = false; return;
      }
    }

    this.showMessage = false;
    this.message = "";
    if (this.image == `${this.staticContentUrl}img/add-user.png`) {
      this.user.profileImage = null;
    }
    else {
      this.user.profileImage = this.image;
    }

    var languageUser = this.partnerService.partner.languages.find(l => l.code == this.user.languageCode);
    if(languageUser)
      this.user.languageId = languageUser.id;

    this.userService.updateUser(this.user).subscribe(
      () => {
        this.translate.get('PERFIL_MODIFICADO').subscribe(res => this.messageService.add(res, "ok"));
        if (this.user.profileImage === null) {
          this.userService.menuPhoto = `${this.staticContentUrl}img/profileDefaultMenu.png`
        }
        else {
          this.userService.menuPhoto = this.user.profileImage
        }
        var userUpdated = null;
        if(this.userService.companyUser)
          userUpdated = this.userService.companyUser.userList.find(u => u.userId == this.userService.currentUserValue.id);
        if(userUpdated) {
          userUpdated.name = this.user.name;
          userUpdated.profileImage = this.user.profileImage;
        }
        if (this.partnerService.partner.loginType === 2 || this.partnerService.partner.loginType === 3
          || this.partnerService.partner.loginType === 7 || this.partnerService.partner.loginType === 8
          || this.partnerService.partner.loginType === 10)
          this.router.navigate(['/services']);

        if(this.userService.currentUserValue.passwordChanged == false && this.partnerService.partner.loginType === 5){
          this.translate.get('CAMBIO_CONTRASENA_FALTA').subscribe(res => {
            this.messageService.add(res, "ok");
          });
        }
        this.loading = false;

        if(this.user.languageCode != localStorage.getItem('langUser'))
          this.languageService.setLanguage(this.user.languageCode,true);
      }, error => {
        this.translate.get('ERROR_MODIFICAR_PERFIL').subscribe(res => {
          this.messageService.add(res, "error"); this.updateError = true;
          this.loading = false;
        });
      });
  }

  onUpdateProfile() {
    // console.log("onUpdateProfile");
    this.updateError = false;
    this.submitted = true;
    if (this.user.name != null)
      this.user.name = this.user.name.trim();
    if (this.user.surname != null)
      this.user.surname = this.user.surname.trim();
    if (this.user.email != null)
      this.user.email = this.user.email.trim();
    if (this.user.eid != null)
      this.user.eid = this.user.eid.trim();
    if (this.user.phone != null)
      this.user.phone = this.user.phone.trim();

    this.loading = true;
    if (!this.isValidString(this.user.name)) {
      this.message = this.translate.instant('MULTIUSER.VALIDATION1'); this.showMessage = true; this.loading = false; return;
    }
    if (this.loginType == 2 || this.loginType == 5) {
      if (!this.isValidString(this.user.eid)) {
        this.message = this.translate.instant('MULTIUSER.VALIDATION2').replace("{{identifier}}", this.partnerService.partner.uniqueIdentifier); this.showMessage = true; this.loading = false; return;
      }
    }
    if (this.user.email != null && this.user.email.length > 0) {
      if (!this.isValidString(this.user.email)) {
        this.message = this.translate.instant('MULTIUSER.VALIDATION3'); this.showMessage = true; this.loading = false; return;
      }
      if (UserValidator.validEmail(this.user.email) == null) {
        this.message = this.translate.instant('MULTIUSER.VALIDATION4'); this.showMessage = true; this.loading = false; return;
      }
    }
    if (this.user.phone != null && this.user.phone.length > 0) {
      if (UserValidator.validPhone(this.user.phone) == null) {
        this.message = this.translate.instant('MULTIUSER.VALIDATION11'); this.showMessage = true; this.loading = false; return;
      }
    }

    this.showMessage = false;
    this.message = "";
    if (this.image == `${this.staticContentUrl}img/add-user.png`) { this.user.profileImage = null;}
    else {this.user.profileImage = this.image;}

    var languageUser = this.partnerService.partner.languages.find(l => l.code == this.user.languageCode);
    if(languageUser)
      this.user.languageId = languageUser.id;

    if(this.partnerService.partner.hasFullProfile){
      var userFullProfile = {
        name:this.user.name,
        surname:this.user.surname,
        email:this.user.email,
        phone:this.user.phone,
        adress:this.user.adress,
        postalcode:this.user.postalcode,
        city:this.user.city,
        countryCode:this.user.countryCode,
        profileImage:this.user.profileImage,
        languageId : this.partnerService.partner.languages.find(l => l.code == this.user.languageCode).id
      };

      this.userService.updateFullProfile(userFullProfile).then((result:Result)=>{
        this.userService.currentUserValue.adress = this.user.adress;
        this.userService.currentUserValue.name = this.user.name;
        this.userService.currentUserValue.surname = this.user.surname;
        this.userService.currentUserValue.email = this.user.email;
        this.userService.currentUserValue.phone = this.user.phone;
        this.userService.currentUserValue.postalcode = this.user.postalcode;
        this.userService.currentUserValue.city = this.user.city;
        this.userService.currentUserValue.profileImage = this.user.profileImage;
        this.userService.currentUserValue.countryCode = this.user.countryCode;
        this.userService.currentUserValue.languageId = this.user.languageId;
        this.userService.currentUserValue.languageCode = this.user.languageCode;
        this.userService.currentUserValue.passwordChanged = this.user.passwordChanged;
        
        this.setLocalStorage('currentUser', this.userService.currentUserValue);
        this.userService.updateCurrentUser(this.user)
        
        this.viewUpdateProfile(result);
      });
    }
    else{
      var userProfile = {
        name:this.user.name,
        surname:this.user.surname,
        email:this.user.email,
        countryCode:this.user.countryCode,
        languageId:this.user.languageId
      };
      this.userService.updateProfile(userProfile).then((result:Result)=>{
        this.userService.currentUserValue.name = this.user.name;
        this.userService.currentUserValue.surname = this.user.surname;
        this.userService.currentUserValue.email = this.user.email;
        this.userService.currentUserValue.countryCode = this.user.countryCode;
        this.userService.currentUserValue.languageId = this.user.languageId;
        this.userService.currentUserValue.languageCode = this.user.languageCode;
        this.userService.currentUserValue.passwordChanged = this.user.passwordChanged;
        this.setLocalStorage('currentUser', this.userService.currentUserValue);
        this.viewUpdateProfile(result);
      });
    }
  }


  viewUpdateProfile(result:Result){
    switch(result.status){
      case 200:
          this.translate.get('PERFIL_MODIFICADO').subscribe(res => this.messageService.add(res, "ok"));

          if (this.user.profileImage === null) {this.userService.menuPhoto = `${this.staticContentUrl}img/profileDefaultMenu.png`}
          else {this.userService.menuPhoto = this.user.profileImage}

          if (this.partnerService.partner.loginType === 2 || this.partnerService.partner.loginType === 3
             || this.partnerService.partner.loginType === 7 || this.partnerService.partner.loginType === 8
             || this.partnerService.partner.loginType === 10)
             this.router.navigate(['/services']);
          this.loading = false;

          if(this.user.languageCode != localStorage.getItem('langUser'))
            this.languageService.setLanguage(this.user.languageCode,true);

        break;
      case 400:
        this.translate.get(result.message).subscribe(res => {
          this.messageService.add(res, "error"); this.updateError = true;
          this.loading = false;
        });

        break;
      default:
        this.translate.get('ERROR_MODIFICAR_PERFIL').subscribe(res => {
          this.messageService.add(res, "error"); this.updateError = true;
          this.loading = false;
        });
        break;
    }

  }

  toogleOld() {
    this.old = this.old == "password" ? "text" : "password";
  }

  toogleNew() {
    this.new = this.new == "password" ? "text" : "password";
  }

  toogleRepeat() {
    this.repeat = this.repeat == "password" ? "text" : "password";
  }

  async onSubmitreset() {
    this.loadingPassword = true;
    await this.userService.updateUserKey(this.key).then(
      result => {
        this.translate.get('PASSWORD_MODIFIED').subscribe(res => this.messageService.add(res, "ok"));
        this.userService.currentUserValue.passwordChanged = true;
        this.setLocalStorage('currentUser', this.userService.currentUserValue);
        this.loadingPassword = false;
        this.router.navigate(['/']);
      },
      err => {
        this.loadingPassword = false;
        if (err.error === -2)
          this.translate.get('PASSWORD_ALREADY_REGISTERED_ERROR').subscribe(res => this.messageService.add(res, "error"));
        else if (err.error === -1)
          this.translate.get('PASSWORD_MODIFIED_ERROR').subscribe(res => this.messageService.add(res, "error"));
      }
    );

  }

  async onSubmitNotificationConfig() {
    
    this.loadingNotificationConfig = true;
    const elearningNotification = new UserPost();
    elearningNotification.state = this.elearningNotification ? 1 : 3;
    elearningNotification.postId = NotificationType.Elearning;
    const serviceList = [
      //this.userService.updateUserNotificationConfig(this.userNotificationConfig),
      //this.userService.updateElearningNotification(elearningNotification),
      this.userService.updateUser(this.user)
    ];

    forkJoin(serviceList)
    .pipe(
      tap(() => {
        this.translate.get('NOTIFICATION_CONFIG_MODIFIED').subscribe(res => this.messageService.add(res, "ok"));
        this.loadingNotificationConfig = false;
      }),
      catchError(async () => {
        this.loadingNotificationConfig = false;
        this.translate.get('NOTIFICATION_CONFIG_MODIFIED_ERROR').subscribe(res => this.messageService.add(res, "error"));
      })
    )
    .subscribe()

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
            ImageUtils.compressImage(result, 100, 100).then(compressed => {
              this.image = compressed;
              this.user.profileImage = this.image
            })
          });
        }
        else {
          console.clear();
          this.translate.get('ONLY_IMAGES_ERROR').subscribe(res => this.messageService.add(res, "error"));
        }
      }
    }
  }


  copyToClipboard(event: any) {
    event.preventDefault();
    const copyTarget = document.getElementById("passwordExample") as HTMLInputElement;
    copyTarget.select();
    document.execCommand("copy");
  }

  checkpass(success: boolean) {
    this.successpass = success;
  }

  generatePassword() {
    //const reg = /^(\d{12}[a-z]{1,2}[A-Z]{1,2}[!#$%&/()=?]{1,1})$/;
    const reg = /^([a-z]{4}\d{2}[A-Z]{4}[!@#$%&/()=?]{2})$/;
    const RandExp = require('randexp');
    const rdx = new RandExp(reg);
    let res = rdx.gen();
    this.passwordExample = res;

  }
  saveTempProfile() {
    this.setLocalStorage('tmpUser', this.user);
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);
  }

  setLocalStorage(key, data) {
      this.localService.setJsonValue(key, data);
  }

  private loadElearningNotification() {
    this.userService.getElearningNotification()
      .pipe(
        tap((data : UserPost ) => this.userService.setElearningNotification(data)),
        tap((elearning: UserPost ) => this.elearningNotification = elearning.state == 1 ?  true : false),
        catchError( async () => {
        }),
      ).subscribe();
  }
}







