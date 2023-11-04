import { UserList } from 'src/app/models/userlist';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PartnerService } from 'src/app/services/partner.service';
import { UserService } from 'src/app/services/user.service';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from 'src/app/models/user';
import { UserValidator } from 'src/app/validators/user.validator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteUserModalComponent } from '../deleteusermodal/deleteusermodal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class EditUserComponent implements OnInit {
  profileForm: FormGroup;
  public staticContentUrl = environment.STATIC_CONTENT;
  public user: UserList = new UserList;
  public loading_page = true;
  public loading = false;
  public loadingDelete = false;
  public submitted = false;
  public updateError = false;
  public image: string = `${this.staticContentUrl}img/add-user.png`;
  public id = 0;
  public partnerId: number;
  public loginType: number;
  public emailDisabled: boolean = true;
  public showMessage: boolean = false;
  public message: string = "";
  public isActivo: boolean = true;
  public isShowEid: boolean = false;
  public isShowEmail: boolean = false;
  public isShowRequiredEid: boolean = false;
  public isShowRequiredEmail: boolean = false;

  constructor(public partnerService: PartnerService,
    public userService: UserService,
    private router: Router,
    private messageService: MessageService,
    private modalService: NgbModal,
    private translate: TranslateService,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer) {

    // console.log("constructor");
    route.params.subscribe(val => {
      this.loading_page = true;
      // put the code from `ngOnInit` here
      this.id = +this.route.snapshot.paramMap.get('id');
      this.loadUser();

    });
  }

  ngOnInit() {
    // console.log("ngOnInit");
    this.userService.getCompanyUsers();
    this.loadUser();
  }

  loadUser() {
    // console.log("loadUser")
    if (!this.userService.currentUserValue.isAdminUserId) {
      this.router.navigate(['/profile']);
    }
    var interval = setInterval(() => {
      if (this.userService.companyUser) {
        this.user = this.userService.companyUser.userList.find(u => u.userId == this.id);
        // console.log("USER:");
        // console.log(this.user);
        this.image = this.user.profileImage == null ? `${this.staticContentUrl}img/add-user.png` : this.user.profileImage;
        this.partnerId = this.user.partnerId;
        this.loginType = this.partnerService.partner.loginType;
        this.isActivo = +this.user.active == 1;
        this.emailDisabled = this.isActivo;
        if (this.emailDisabled && (this.partnerService.partner.loginType == 2 || this.partnerService.partner.loginType == 3 || this.partnerService.partner.loginType == 5
          || this.partnerService.partner.loginType == 7 || this.partnerService.partner.loginType == 8 || this.partnerService.partner.loginType == 10)) {
          if (this.user.email == null || this.user.email.trim() == "") {
            this.emailDisabled = false;
          }
        }

        this.ruleShowEid();
        this.ruleShowEmail();
        this.ruleShowRequiredEmail();
        this.loading_page = false;
        clearInterval(interval);
      }
    }, 500)
  }

  isValidString(str: string) {
    return str !== null && str !== undefined && typeof str === "string" && str.length > 0;
  }
  ruleShowEid() {
    if (this.loginType == 2 || this.loginType == 5) {
      this.isShowEid = true;
    }
  }

  ruleShowEmail() {
    this.isShowEmail = true;
  }

  ruleShowRequiredEmail() {
    if (this.loginType == 1 || this.loginType == 5 || this.loginType == 4 || this.loginType == 6) {
      this.isShowRequiredEmail = true;
    }
  }

  onSubmit() {
    this.updateError = false;
    this.showMessage = false;
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

    this.user.country = this.partnerService.countries.find(x => x.code == this.user.countryCode)?.name;
    this.loading = true;
    if (!this.isValidString(this.user.name)) {
      this.message = this.translate.instant('MULTIUSER.VALIDATION1'); this.showMessage = true; this.loading = false; return;
    }

    if (this.loginType == 2 || this.loginType == 5) {
      if (!this.isValidString(this.user.eid)) {
        this.message = this.translate.instant('MULTIUSER.VALIDATION2').replace("{{identifier}}", this.partnerService.partner.uniqueIdentifier);
        this.showMessage = true; this.loading = false; return;
      }
    }

    if (this.loginType == 1 || this.loginType == 4 || this.loginType == 5 || this.loginType == 6) {
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
    if (this.image == `${this.staticContentUrl}img/profileDefaultMenu.png` || this.image == `${this.staticContentUrl}img/add-user.png`) {
      this.user.profileImage = null;
    }
    else {
      this.user.profileImage = this.image;
    }

    this.userService.updateUserByAdminCompany(this.user).then(
      (result: any) => {
        if (result.status != 200) {
          this.message = result.message;
          this.showMessage = true;
          this.loading = false;
          return;
        }
        else {
          this.translate.get('PERFIL_MODIFICADO').subscribe(res => this.messageService.add(res, "ok"));
          this.loading = false;
          // this.router.navigate([this.router.url]);
          // this.router.navigate(['/user-list']);
          // this.router.navigate(['/services']);
        }
      }, error => {
        this.translate.get('ERROR_MODIFICAR_PERFIL').subscribe(res => {
          this.messageService.add(res, "error"); this.updateError = true;
          this.loading = false;
        });
      });
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

  deletetUser() {
    var idChild = this.user.userId;
    let userChild = this.userService.companyUser.userList.find(u => u.userId == idChild);
    const modalRef = this.modalService.open(DeleteUserModalComponent);
    modalRef.componentInstance.usuario = userChild.name;
    modalRef.result.then((result) => { }, (reason) => {
      if (reason === 'OK') {
        const userparam = new User();
        userparam.id = userChild.userId;
        this.userService.deleteUser(userparam, this.partnerService.partner.apiKey).then(
          (result: any) => {
            if (result.status != 200) {
              this.messageService.add(this.translate.instant('COMP_USER_LIST.REM_FAILED'), "error");
              return;
            }
            else {
              this.messageService.add(this.translate.instant('COMP_USER_LIST.REM_OK'), "ok");
              this.userService.getCompanyUsers();
              this.router.navigate(['/services']);
            }
          }, error => {
            this.messageService.add(this.translate.instant('COMP_USER_LIST.REM_FAILED'), "error");
          });
      }
    });
  }
}
