import { Component, OnInit, Inject, HostListener, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { PartnerService } from 'src/app/services/partner.service';
import { Router, NavigationStart,  } from '@angular/router';
import { SuiteService } from 'src/app/services/suite.service';
import { DOCUMENT } from '@angular/common';
import { ServicesService } from 'src/app/services/services.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/message.service';
import { CompanyUser } from 'src/app/models/companyUser';
import { UserList } from 'src/app/models/userlist';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserNotificationGrouped } from 'src/app/models/userNotificationGrouped';
import { AppInstallerService } from 'src/app/services/app-installer.service';
import { LocalService } from 'src/app/services/local.service';
import { environment } from 'src/environments/environment';
import { InfoModalComponent } from '../../custom/infomodal/infomodal.component';
import { NotificationService } from './shared/notification.service';
import { StringUtils } from 'src/app/utils/string-utils';
import { NotificationTabs } from './shared/notifcations-tabs';

@Component({
  selector: 'app-header-integrated',
  templateUrl: './header-integrated.component.html',
  styleUrls: ['./header-integrated.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderIntegratedComponent implements OnInit {
  public staticContentUrl = environment.STATIC_CONTENT
  public logged: boolean = false;
  public hideTutorialAux: boolean = false;
  public hideTutorial: boolean = false;
  public showBasicUserItems: boolean;
  public showBasicUserMenu: boolean;
  public collapsed: boolean = true;
  public currentUser: User;
  public currentUserSubscription: Subscription;
  public logoPath = "";
  public faviconPath = "";
  public showTutorial = false;
  public loginType: number;
  public messageService: MessageService;
  public companyUser: CompanyUser;
  public userList: UserList[] = [];
  public pendingUsers:number = 0;
  public defaultPhoto = `${this.staticContentUrl}img/profileDefaultMenu.png`;
  public userNotificationsGrouped: UserNotificationGrouped[] = [];
  public userNotificationsGroupedChilds: UserNotificationGrouped[] = [];
  public supportNotificationGrouped: UserNotificationGrouped[] = [];
  public currentDate = new Date();
  public yesterdayDate = new Date().setDate(new Date().getDate() - 1);
  public notificationUnreaded:boolean = false;
  public notificationChildsUnreaded:boolean = false;
  public supportNotificationUnreaded:boolean = false;
  public showDownloadText = false;
  public showSafariAdvice = false;
  public showChromeAdvice = false;
  public showDownloadButton = false;
  public showNotificationButton = true;
  public wizardSkiped = false;

  hasGeneralNotificationsUnReaded = false;


  ownNotification = NotificationTabs.OwnNotifications;
  anotherNotification = NotificationTabs.AnotherNotifications;
  supportNotification = NotificationTabs.SupportNotifications;
  isNotificationOpen = false;


  constructor(public userService: UserService,
    public partnerService: PartnerService,
    public router: Router,
    public suiteService: SuiteService,
    public serviceService: ServicesService,
    private modalService: NgbModal,
    private translate: TranslateService,
    public appInstallerService: AppInstallerService,
    private notificationService: NotificationService,
    @Inject(DOCUMENT) document,
    private localService: LocalService) {

    this.currentUserSubscription = this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
      });

    // window.addEventListener('click', function (e) {
    //   if (document.getElementById('notification') && !document.getElementById('notification').contains(e.target))
    //     document.getElementById('notification').classList.remove("show")
    // });

    // window.addEventListener('scroll', function() {
    //   console.log(this.window.scrollY)
    //   if (this.window.scrollY > 50) {
    //     document.getElementById('notification').classList.remove("show")
    //   }
    //   // else {
    //   //   document
    //   //     .querySelector('.section-3')
    //   //     .classList.remove('sticky-visible');
    //   //   document
    //   //     .querySelector('.section-3')
    //   //     .classList.add('sticky-invisible');
    //   // }
    // });

    router.events.subscribe((val) => {
      // see also
      if (val instanceof NavigationStart) {
        var navbar = document.querySelector('#navbarToggleExternalContent');
        navbar?.classList.remove("show")
        /*if (vmenu != null) {
          (vmenu as HTMLElement).style.width = '50px';
          this.collapsed = true;
        }*/
      }
      // if (val instanceof NavigationEnd) {
      //   if (val.url == '/services') // Show tutorial and load active class
      //   {
      //     this.showTutorial = true;
      //     if(this.suiteService.suites && this.suiteService.suites.length) {
      //       var interval = setInterval(() => {
      //         if (document.getElementById("suite" + this.suiteService.suites[0].id)){
      //           if (document.getElementById("users")) {
      //             var usersRemove = document.getElementById("users");
      //             usersRemove.classList.remove("active")
      //           }
      //           var usersRemove = document.getElementById("profile");
      //           usersRemove.classList.remove("active")
      //           this.suiteService.suites.forEach(function (value) {
      //             document.getElementById("suite" + value.id).classList.remove("active");
      //           });
      //           if (localStorage.getItem('partnerSuiteId')) {
      //             document.getElementById("suite" + localStorage.getItem('partnerSuiteId')).classList.add("active");
      //           }
      //           else {
      //             document.getElementById("suite" + this.suiteService.suites[0].id).classList.add("active");
      //           }
      //           clearInterval(interval);
      //         }
      //       }, 20)
      //     }
      //   }
      //   else if (val.url == "/profile") { // load active class at profile
      //     var intervalProfile = setInterval(() => {
      //       if (document.getElementById("profile")) {
      //         this.suiteService.suites.forEach(function (value) {
      //           document.getElementById("suite" + value.id).classList.remove("active");
      //         });

      //         var usersRemove = document.getElementById("users");
      //         usersRemove?.classList.remove("active")

      //         document.getElementById("profile").classList.add("active")
      //         clearInterval(intervalProfile);
      //       }

      //     }, 100)
      //   }
      //   else if (val.url == "/user-list") { // load active class at profile
      //     var intervalProfile = setInterval(() => {
      //       if (document.getElementById("users")) {
      //         this.suiteService.suites.forEach(function (value) {
      //           document.getElementById("suite" + value.id).classList.remove("active");
      //         });

      //         var usersRemove = document.getElementById("profile");
      //         usersRemove.classList.remove("active")

      //         document.getElementById("users").classList.add("active")
      //         clearInterval(intervalProfile);
      //       }

      //     }, 100)
      //   }
      //   else if (val.url.includes("/edit-user")) { // load active class at profile
      //     var uId = val.url.substring(11);
      //     var intervalProfile = setInterval(() => {
      //       if (document.getElementById("profile")) {
      //         this.suiteService.suites.forEach(function (value) {
      //           document.getElementById("suite" + value.id).classList.remove("active");
      //         });

      //         var usersRemove = document.getElementsByClassName("user_list");
      //         if(usersRemove){
      //           Array.prototype.forEach.call(usersRemove, function(el) {
      //             // Do stuff here
      //             el.classList.remove("active");
      //           });
      //         }
      //         var usersAdd = document.getElementsByClassName("u_"+uId);
      //         if(usersAdd){
      //           Array.prototype.forEach.call(usersAdd, function(el) {
      //             // Do stuff here
      //             el.classList.add("active");
      //           });
      //         }

      //         clearInterval(intervalProfile);
      //       }
      //     }, 100)
      //   }
      //   else
      //     this.showTutorial = false;
      // }
    });
  }

  ngAfterViewInit() {

  }
  async ngOnInit() {
    this.hideTutorial = JSON.parse(localStorage.getItem("hideTutorial"));
    this.wizardSkiped = localStorage.getItem('skipWizard') == 'true';

    // if (this.currentUser)
    // {
    //   if (this.currentUser.roleId === 4 || this.currentUser.roleId === 7 || this.currentUser.roleId === 3 || this.currentUser.roleId === 2) {
    //     this.showBasicUserItems = false;
    //   }
    //   else {
    //     await this.suiteService.getUserSuites();
    //     if(this.suiteService.suites && this.suiteService.suites.length) {
    //       this.userService.selSuiteId = this.suiteService.suites[0].id;
    //       this.userService.selSuiteName = this.suiteService.suites[0].name
    //       this.showBasicUserItems = true;
    //     }
    //   }
    //   if (this.currentUser.roleId === 1 && (!this.userService.currentUserValue.inJira || !this.userService.currentUserValue.checkTermsAcceptDate))
    //     this.showBasicUserMenu = true;

    //   await this.partnerService.getPartner(this.currentUser.partnerId);
    //   this.loginType = this.partnerService.partner.loginType;
    //   if (this.loginType == 2 && !this.currentUser.isAdminUserId && (this.currentUser.email == undefined || this.currentUser.email == null || this.currentUser.email == "")) {
    //     this.messageService.add("Recomendación: establezca un correo electónico con el fin de establecer un canal de notificaciones, por favor, vaya a su perfil y añádalo.", "info");
    //   }
      // await this.userService.getCompanyUsers();
      // this.companyUser = this.userService.companyUser;
      // console.log(this.userService)
      // this.userList = this.companyUser.userList;
      // this.pendingUsers = this.companyUser.pendingUsers;
      // if(!this.serviceService.userServices && this.currentUser.roleId === 1)
      //   await this.serviceService.getUserServices().then(
      //     result => {
      //       this.showNotificationButton = this.serviceService.userServices.findIndex(e => e.typeCode === 'CAC') >= 0
      //       || this.serviceService.userServices.findIndex(e => e.typeCode === 'CPR') >= 0
      //       || this.serviceService.userServices.findIndex(e => e.typeCode === 'BMS') >= 0
      //     }
      //   );

      if (this.currentUser && this.currentUser.roleId === 1 && this.showNotificationButton)
      {

        this.watchOpenNotification();
        this.watchClickOutsideNotification();
        this.userService.getUserNotifications().then(
          result => {
           const group = this.groupNotifications();
           this.userNotificationsGrouped = StringUtils.sortByProperty(group.own,'notificationDate', true);
           this.userNotificationsGroupedChilds = StringUtils.sortByProperty(group.another,'notificationDate', true);
           this.supportNotificationGrouped = StringUtils.sortByProperty(group.support,'notificationDate', true);
           this.notificationService.showBell = (this.notificationUnreaded || this.notificationChildsUnreaded || this.supportNotificationUnreaded);
          },
        );
      }

  }

  ngAfterContentInit() {
    this.appInstallerService.showInstallBox() // Chrome - edge
    if (!this.appInstallerService.isStandalone()) {
      if ((this.appInstallerService.isWindows() || this.appInstallerService.isAndroid())
        && this.appInstallerService.isChrome()) {
        this.showDownloadText = true;
        this.showDownloadButton = true;
      }

      if (this.appInstallerService.isIos() && this.appInstallerService.isSafari()) { // iOs Safari
        this.showSafariAdvice = true;
        this.appInstallerService.showDownloadBox = true;
      }

      if ((this.appInstallerService.isWindows() || this.appInstallerService.isAndroid())
        && !this.appInstallerService.isChrome()) { // Windows/Android and no chrome
        this.appInstallerService.showDownloadBox = true;
        this.showChromeAdvice = true;
      }
    }

  }

  logout() {
    this.userService.logout();
  }

  groupNotifications() {
    let ownNotifications: any[] = [];
    let anotherNotifications: any[] = [];
    let supportNotifications: any[] = [];
    let ownNotiReadad = false;
    let anotherNotiReadad = false;
    let supportNotiReadad = false;

    if(this.userService.userNotifications != null)
    {
      this.userService.userNotifications.forEach(element => {
        const notificationDate = element.notificationDate.toString().substring(0,10);
        if(element.userId == this.currentUser.id && !element.type) {
          if(!element.readed) ownNotiReadad = true;
          const found = this.userNotificationsGrouped.some(ung => ung.notificationDate === notificationDate);
          if (!found) {
            const ung = new UserNotificationGrouped();
            ung.notificationDate = notificationDate;
            ung.notifications.push(element);
            ownNotifications.push(ung);
          } else {
            ownNotifications.find(ung => ung.notificationDate === notificationDate).notifications.push(element);
          }
        }

        if (element.userId !== this.currentUser.id && !element.type) {
          if(!element.readed) anotherNotiReadad = true;
          const found = anotherNotifications.some(ung => ung.notificationDate === notificationDate);
          if (!found) {
            const ung = new UserNotificationGrouped();
            ung.notificationDate = notificationDate;
            ung.notifications.push(element);
            anotherNotifications.push(ung);
          } else {
            anotherNotifications.find(ung => ung.notificationDate === notificationDate).notifications.push(element);
          }
        }

        if(element.userId == this.currentUser.id && element.type == 'NS') {
          if(!element.readed) supportNotiReadad = true;
          element.description = element.description;
          element.parseLinks = element.links ? JSON.parse(element.links) : null;
          element.parseFiles = element.attachedFilesNames ? element.attachedFilesNames.replace(/[\[\]]/g, "").split(',') : '';
          element.parseURLFiles = element.attachedFiles ? element.attachedFiles.replace(/[\[\]]/g, "").split(',') : '';
          const found = supportNotifications.some(ung => ung.notificationDate === notificationDate);
          if (!found) {
            const ung = new UserNotificationGrouped();
            ung.notificationDate = notificationDate;
            ung.notifications.push(element);
            supportNotifications.push(ung);
          } else {
            supportNotifications.find(ung => ung.notificationDate === notificationDate).notifications.push(element);
          }
        }

      });
    }

    this.notificationUnreaded = ownNotiReadad;
    this.notificationChildsUnreaded = anotherNotiReadad;
    this.supportNotificationUnreaded = supportNotiReadad;
    return { own: ownNotifications, another: anotherNotifications, support: supportNotifications };
  }




  async loadServices(suiteId: number, suiteColor: string, suiteGradColor: string, suiteName: string, maxCardsByUser: number, maxIdentitiesByUser: number) {
    document.getElementById("profile").classList.remove("active");
    this.suiteService.suites.forEach(function (value) {
      if (value.id === suiteId) {
        document.getElementById("suite" + value.id.toString()).classList.add("active");
      }
      else {
        document.getElementById("suite" + value.id.toString()).classList.remove("active");
      }
    });
    //Changing suite, categories and services
    this.userService.selSuiteId = suiteId;
    this.userService.selSuiteName = suiteName;
    this.userService.selSuiteColor = suiteColor;
    this.userService.selSuiteGradColor = suiteGradColor;

    // await this.serviceService.getUserCategories();
    await this.serviceService.getUserServices();
    localStorage.setItem('suiteColor', this.userService.selSuiteColor);
    localStorage.setItem('partnerSuiteId', this.userService.selSuiteId.toString());
    localStorage.setItem('suiteName', this.userService.selSuiteName);
    localStorage.setItem('suiteGradColor', this.userService.selSuiteGradColor);
    localStorage.setItem('maxCardsByUser', maxCardsByUser.toString());
    localStorage.setItem('maxIdentitiesByUser', maxIdentitiesByUser.toString());

    this.router.navigate(['/services']);
  }

  checkTutorial($event: any) {
    this.hideTutorialAux = !this.hideTutorialAux;
  }

  closeTutorial() {
    document.getElementById("tutorial").style.visibility = "hidden";
    this.hideTutorial = this.hideTutorialAux;
    localStorage.setItem('hideTutorial', JSON.stringify(this.hideTutorial));
  }

  checkProfile() {
    if (this.currentUser.isAdminUserId && this.currentUser.companyUser.maxLicense > 1) {
      this.router.navigate(['/user-list']);
      return;
    }
    else {
      this.router.navigate(['/profile']);
      return;
    }
  }

  collapse() {
    if (this.collapsed) {
      this.collapsed = false;
      (document.querySelector('.vmenu') as HTMLElement).style.width = '160px';
    } else {
      this.collapsed = true;
      (document.querySelector('.vmenu') as HTMLElement).style.width = '50px';
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.closeTutorial();
    }
  }

  editUser(userid:number){
    if (this.userService.currentUserValue.id == userid)
      this.router.navigate(['/profile']);
    else
      this.router.navigate(['edit-user',userid]);
  }

  validateAddUser()
  {
    if (this.pendingUsers == 0)
    {
      const modalRef = this.modalService.open(InfoModalComponent);
      modalRef.componentInstance.message = this.translate.instant('COMP_USER_LIST.VALIDATE_USER');
      return;
    }
    else
    {
      this.router.navigate(['/add-user',this.currentUser.id]);
    }
  }

  changeTab(event) {

    switch (event.id) {
      case NotificationTabs.OwnNotifications:
        this.readNotifications();
        break;

      case NotificationTabs.AnotherNotifications:
        this.readChildsNotifications();
        break;

      case NotificationTabs.SupportNotifications:
        this.readSupportNotification();
        break;

      default:
        break;
    }

  }

  deleteAllByTab(event) {
    switch (event.id) {
      case NotificationTabs.OwnNotifications:
        this.hideNotifications();
        break;

      case NotificationTabs.AnotherNotifications:
        this.hideChildsNotifications();
        break;

      case NotificationTabs.SupportNotifications:
        // this.readSupportNotification();
        break;

      default:
        break;
    }
  }

  updateGeneralNotification() {
    this.notificationService.showBell = (this.notificationUnreaded || this.notificationChildsUnreaded || this.supportNotificationUnreaded);
  }

  readSupportNotification() {
    if(this.supportNotificationUnreaded) {
      this.supportNotificationUnreaded = false;
      this.updateGeneralNotification();
      this.userService.readSupportNotifications();
    }
  }

  readNotifications()
  {
    if(this.notificationUnreaded)
    {
      setTimeout(()=>{
        this.userService.readUserNotifications().then(
          result => {
            this.userNotificationsGrouped.forEach(userNotif => {
              userNotif.notifications.forEach(notif => {
                notif.readed = true;
              });
            });
            this.notificationUnreaded = false;
            this.updateGeneralNotification();
          }
        );
      },1000);
    }
  }
  readChildsNotifications()
  {
    if(this.notificationChildsUnreaded)
    {
      setTimeout(()=>{
        this.userService.readUserChildsNotifications().then(
          result => {
            this.userNotificationsGroupedChilds.forEach(userNotif => {
              userNotif.notifications.forEach(notif => {
                notif.readed = true;
              });
            });
            this.notificationChildsUnreaded = false;
            this.updateGeneralNotification();
          }
        );
      },1000);
    }
  }

  hideNotifications()
  {
    this.userService.hideUserNotifications().then(
      result => {
        this.userNotificationsGrouped = [];
      }
    );
  }
  hideChildsNotifications()
  {
    this.userService.hideUserChildsNotifications().then(
      result => {
        this.userNotificationsGroupedChilds = [];
      }
    );
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);
  }

  setLocalStorage(key, data) {
    this.localService.setJsonValue(key, data);
  }

  goToWizard(){
    this.router.navigate(['/auto-activation'])
  }


  toogleNotification() {
    this.notificationService.toogleNotification();
  }

  watchOpenNotification()  {
    this.notificationService.openNotification$
      .pipe(
        tap((toogle: boolean) => this.isNotificationOpen = toogle),
      ).subscribe();
  }

  watchClickOutsideNotification(){
    window.addEventListener('click', (e:any) => {
      const iconMobile = document.getElementById('noti-icon-mobile');
      const buttonNoti = document.getElementById('button-noti');
      const notificationDiv = document.getElementById('notification');
      if(notificationDiv || buttonNoti || iconMobile) {
        if(!(notificationDiv.contains(e.target) || iconMobile.contains(e.target) || buttonNoti.contains(e.target) )){
          this.notificationService.closeNotification();
        }
      }

    });
  }
}

