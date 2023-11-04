import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PartnerService } from 'src/app/services/partner.service';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder } from '@angular/forms';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '../infomodal/infomodal.component';
import { FamilyUser } from 'src/app/models/familyUser';
import { UserConfig } from 'src/app/models/userConfig';
import { DeleteUserModalComponent } from '../deleteusermodal/deleteusermodal.component';
import { EmailService } from 'src/app/services/email.service';
import { AdminHiredServices } from 'src/app/models/adminHiredService';
import { ServiceTypeConfig } from 'src/app/models/serviceTypeConfig';
import { BytesValidator } from 'src/app/validators/bytes.validator'
import { DesactiveservicemodalComponent } from '../desactiveservicemodal/desactiveservicemodal.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranxferService } from 'src/app/services/tranxfer.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit {

  public staticContentUrl = environment.STATIC_CONTENT;
  public user: User;
  public terms = false;
  public image: string = `${this.staticContentUrl}img/profileDefaultMenu.png`;
  public familyUser: FamilyUser;
  public usersConfig: UserConfig[] = [];
  public hiredServices: AdminHiredServices[] = [];
  public maxLicense: number = 0;
  public totalUsers: number = 0;
  public activeUsers: number = 0;
  public usersNotActivated: number = 0;
  public pendingUsers: number = 0;
  public previousServicesState: ServiceTypeConfig[];
  public loading = false;

  constructor(
    public partnerService: PartnerService,
    public userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private translate: TranslateService,
    public sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private emailService: EmailService,
    public tranxferService: TranxferService
    ) {
    this.user = this.userService.currentUserValue;
    this.terms = this.user.checkTermsAcceptDate;
    this.image = this.user.profileImage;
    }
    

  async ngOnInit() {
    localStorage.removeItem('userConfigList')
    if (!this.userService.currentUserValue.isAdminUserId) {
      this.router.navigate(['/profile']);
    }
    this.userService.getFamilyUser().then((result) => {
      console.log(this.userService.familyUser);
      this.familyUser = this.userService.familyUser;
      // this.userConfig = this.familyUser.userConfig.filter(x => x.userId != this.user.id);
      this.usersConfig = this.familyUser.usersConfig;
      this.hiredServices = this.familyUser.adminHiredServices;
      this.maxLicense = this.familyUser.maxLicense;
      this.totalUsers = this.familyUser.totalUsers;
      this.activeUsers = this.familyUser.activeUsers;
      this.usersNotActivated = this.familyUser.usersNotActivated;
      this.pendingUsers = this.familyUser.pendingUsers;
    });
    // console.log(this.userService.usersConfig);
  }

  onCheckType(i: number) {
    let id = "eid" + i.toString();
    let input = document.getElementById(id);
    let type = input.attributes["type"].value;
    if (type === "password") {
      input.attributes["type"].value = "text";
    } else {
      input.attributes["type"].value = "password";
    }
  }

  validateAddUser() {
    if (this.pendingUsers == 0) {
      const modalRef = this.modalService.open(InfoModalComponent);
      modalRef.componentInstance.message = this.translate.instant('COMP_USER_LIST.VALIDATE_USER');
      return;
    }
    else {
      this.router.navigate(['/add-user', this.user.id]);
    }
  }

  editUser(userid: number) {
    if (userid == this.user.id)
      this.router.navigate(['/profile']);
    else
      this.router.navigate(['edit-user', userid]);
  }
  deleteUser(idChild: number) {
    let userChild = this.userService.companyUser.userList.find(u => u.userId == idChild);
    const modalRef = this.modalService.open(DeleteUserModalComponent);
    modalRef.componentInstance.usuario = userChild.name;
    modalRef.result.then((result) => { }, (reason) => {
      if (reason === 'OK') {
        const userparam = new User();
        userparam.id = userChild.userId;
        this.userService.deleteUser(userparam,this.partnerService.partner.apiKey).then(
          (result: any) => {
            if (result.status != 200) {
              this.messageService.add(this.translate.instant('COMP_USER_LIST.REM_FAILED'), "error");
              return;
            }
            else {
              this.messageService.add(this.translate.instant('COMP_USER_LIST.REM_OK'), "ok");
              this.ngOnInit();
            }
          }, error => {
            this.messageService.add(this.translate.instant('COMP_USER_LIST.REM_FAILED'), "error");
          });
      }
    });
  }

  sendEmail(email: string) {
    this.emailService.sendEmail(email, this.user.partnerId.toString()).then(
      result => {
        if (result) this.translate.get('RESEND_PASSWORD.OK').subscribe(res => this.messageService.add(res, "ok"));
        else this.translate.get('RESEND_PASSWORD.FAIL').subscribe(res => this.messageService.add(res, "error"));
      });
  }

  saveConfigUser(userConfigId: number) {
    this.loading = true;
    var userConfigUpdate = this.familyUser.usersConfig.find(uc => uc.userConfigId == userConfigId);
    let acronisService = userConfigUpdate.servicesTypeConfig.find(x => x.code === "CAC");
    if (acronisService && !acronisService.isActive) {
      acronisService.assigned = 0;
    }

    this.userService.updateUserConfig(userConfigUpdate).then(
      result => {
        if (result.result === -3) {
          this.messageService.add(this.translate.instant('COMP_USER_LIST.ERROR_ACRONIS_SPACE'), "error");
          this.loading = false;
          return;
        }
        if (result.result != 0) {
          this.messageService.add(this.translate.instant('COMP_USER_LIST.SAVE_CONFIG_FAILED'), "error");
          this.loading = false;
          return;
        }
        else {
          this.messageService.add(this.translate.instant('COMP_USER_LIST.SAVE_CONFIG'), "ok");
          this.hiredServices = result.adminHiredServices
          localStorage.setItem('userConfigList', JSON.stringify(this.usersConfig.find(x => x.userConfigId === userConfigId))) // Saving current user 
          this.loading = false;
        }
      }, error => {
        this.messageService.add(this.translate.instant('COMP_USER_LIST.SAVE_CONFIG_FAILED'), "error");
        this.loading = false;
      });
  }

  increaseDecreaseServiceConfig(add = true, serviceType, userConfigId) {
    switch (serviceType) {
      case 'CAC':
        let userConfig = this.usersConfig.find(x => x.userConfigId == userConfigId).servicesTypeConfig.find(x => x.code === serviceType)
        let hiredService = this.hiredServices.find(x => x.serviceTypeCode === serviceType)
        let totalAmountOtherUsers = 0;
        this.usersConfig.filter(x => x.userConfigId !== userConfigId)
          .map(x => x.servicesTypeConfig
            .find(y => y.code === serviceType))
          .forEach((element) => { totalAmountOtherUsers += element.assigned })
        
        if (add) {
          if ((totalAmountOtherUsers + userConfig.assigned) >= (hiredService.available + hiredService.used))
            return;
          userConfig.assigned += 10
        }
        else {
          if (userConfig.assigned <= 0)
            return;
          userConfig.assigned -= 10
        }
        break;
    }
  }
  loadInitialState(userConfigId: number) {
    if (!document.getElementById('collapse' + userConfigId).classList.contains('show')) { // only if is displaying
      if (localStorage.getItem('userConfigList')) { // Previous value user
        var userConfig = JSON.parse(localStorage.getItem('userConfigList'))
        this.usersConfig[this.usersConfig.findIndex(x => x.userConfigId == userConfig.userConfigId)] = userConfig
      }
      localStorage.setItem('userConfigList', JSON.stringify(this.usersConfig.find(x => x.userConfigId == userConfigId))) // Saving current user 
    }
  }

  GetSpaceWithDecimals(bytes: number) {
    return (bytes>0)?BytesValidator.GetSpaceWithDecimals(bytes):0;
  }

  IsCorrectSpace(currentSpace: string, assignedSpace: string, availableSpace: string) {
    var bytesAssignedSpace = BytesValidator.FormatBytes(assignedSpace + ' GB')
    return (bytesAssignedSpace + availableSpace) > currentSpace
  }

  confirmDialog(e, userConfigId, serviceType) {
    if (!e.target.checked) {
      if (this.usersConfig.find(x => x.userConfigId == userConfigId).servicesTypeConfig.find(x => x.code === serviceType).isUsed) {
        const modalRefService = this.modalService.open(DesactiveservicemodalComponent);
        modalRefService.componentInstance.message = this.translate.instant('DESACTIVE_SERVICE_MODAL.MESSAGE');
        modalRefService.result.then((result) => { }, (reason) => {
          if (reason !== 'OK') {
            this.usersConfig.find(x => x.userConfigId == userConfigId).servicesTypeConfig.find(x => x.code === serviceType).isActive = true;
          }
        });
      }
    }
  }
 

}
