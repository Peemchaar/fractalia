import { Component, OnInit, Inject, ViewEncapsulation, Input } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { PartnerService } from 'src/app/services/partner.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { SuiteService } from 'src/app/services/suite.service';
import { DOCUMENT } from '@angular/common';
import { MessageService } from 'src/app/services/message.service';
import { CompanyUser } from 'src/app/models/companyUser';
import { UserList } from 'src/app/models/userlist';
import { UserNotificationGrouped } from 'src/app/models/userNotificationGrouped';
import { AppInstallerService } from 'src/app/services/app-installer.service';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../header-integrated/shared/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  @Input() hideButtons = false;

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
  public currentDate = new Date();
  public yesterdayDate = new Date().setDate(new Date().getDate() - 1);
  public notificationUnreaded:boolean = false;
  public notificationChildsUnreaded:boolean = false;
  public showDownloadText = false;
  public showSafariAdvice = false;
  public showChromeAdvice = false;
  public showDownloadButton = false;
  public showNotificationButton = false;
  private readonly unsubscriber$: Subject<any> = new Subject();
  screenWidth$: BehaviorSubject<number> = new BehaviorSubject(null);
  public mobile: boolean = false;
  public wizardSkiped: boolean = false;



  constructor(public userService: UserService,
    public router: Router,
    public partnerService: PartnerService,
    public suiteService: SuiteService,
    public appInstallerService: AppInstallerService,
    public notificationService: NotificationService,
    @Inject(DOCUMENT) document,
  ) {

    this.currentUserSubscription = this.userService.currentUser.subscribe(user => {
      this.currentUser = user
    });

    window.addEventListener('click', function (e) {
      if (document.getElementById('navbarToggleExternalContent') && !document.getElementById('navbarToggleExternalContent').contains(e.target))
        document.getElementById('navbarToggleExternalContent').classList.remove("show")
    });


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
      if (val instanceof NavigationEnd) {
        if (val.url == "/services") // Show tutorial and load active class
        {
          this.showTutorial = true;
          var interval = setInterval(() => {
            if (document.getElementById("suite" + this.suiteService.suites[0].id)){
              if (document.getElementById("users")) {
                var usersRemove = document.getElementById("users");
                usersRemove.classList.remove("active")
              }
              var usersRemove = document.getElementById("profile");
              usersRemove.classList.remove("active")
              this.suiteService.suites.forEach(function (value) {
                document.getElementById("suite" + value.id).classList.remove("active");
              });
              if (localStorage.getItem('partnerSuiteId')) {
                document.getElementById("suite" + localStorage.getItem('partnerSuiteId')).classList.add("active");
              }
              else {
                document.getElementById("suite" + this.suiteService.suites[0].id).classList.add("active");
              }
              clearInterval(interval);
            }
          }, 20)
        }
        else if (val.url == "/profile") { // load active class at profile
          var intervalProfile = setInterval(() => {
            if (document.getElementById("profile")) {
              this.suiteService.suites.forEach(function (value) {
                document.getElementById("suite" + value.id).classList.remove("active");
              });

              var usersRemove = document.getElementById("users");
              usersRemove?.classList.remove("active")

              document.getElementById("profile").classList.add("active")
              clearInterval(intervalProfile);
            }

          }, 100)
        }
        else if (val.url == "/user-list") { // load active class at profile
          var intervalProfile = setInterval(() => {
            if (document.getElementById("users")) {
              this.suiteService.suites.forEach(function (value) {
                document.getElementById("suite" + value.id).classList.remove("active");
              });

              var usersRemove = document.getElementById("profile");
              usersRemove.classList.remove("active")

              document.getElementById("users").classList.add("active")
              clearInterval(intervalProfile);
            }

          }, 100)
        }
        else if (val.url.includes("/edit-user")) { // load active class at profile
          var uId = val.url.substring(11);
          var intervalProfile = setInterval(() => {
            if (document.getElementById("profile")) {
              this.suiteService.suites.forEach(function (value) {
                document.getElementById("suite" + value.id).classList.remove("active");
              });

              var usersRemove = document.getElementsByClassName("user_list");
              if(usersRemove){
                Array.prototype.forEach.call(usersRemove, function(el) {
                  // Do stuff here
                  el.classList.remove("active");
                });
              }
              var usersAdd = document.getElementsByClassName("u_"+uId);
              if(usersAdd){
                Array.prototype.forEach.call(usersAdd, function(el) {
                  // Do stuff here
                  el.classList.add("active");
                });
              }

              clearInterval(intervalProfile);
            }
          }, 100)
        }
        else
          this.showTutorial = false;
      }
    });
  }

  ngAfterViewInit() {

  }


  async ngOnInit() {
    this.hideTutorial = JSON.parse(localStorage.getItem("hideTutorial"));
    if (this.currentUser)
    {
      if (this.currentUser.roleId === 4 || this.currentUser.roleId === 7 || this.currentUser.roleId === 3 || this.currentUser.roleId === 2) {
        this.showBasicUserItems = false;
      }
      else {
        await this.suiteService.getUserSuites();
        if(this.suiteService.suites && this.suiteService.suites.length) {
          this.userService.selSuiteId = this.suiteService.suites[0].id;
          this.userService.selSuiteName = this.suiteService.suites[0].name
          this.showBasicUserItems = true;
        }
      }
      await this.partnerService.getPartner(this.currentUser.partnerId).then(res => {
        if(res.name){
          var tempUser = new User;
          tempUser = Object.assign({}, this.userService.currentUserValue);
          tempUser.partnerName = res.name
          this.userService.updateCurrentUser(tempUser)
        }
      });
      this.loginType = this.partnerService.partner.loginType;
      if (this.loginType == 2 && !this.currentUser.isAdminUserId && (this.currentUser.email == undefined || this.currentUser.email == null || this.currentUser.email == "")) {
        this.messageService.add("Recomendación: establezca un correo electónico con el fin de establecer un canal de notificaciones, por favor, vaya a su perfil y añádalo.", "info");
      }

    }
  }

  ngAfterContentInit() {}

  logout() {
    this.userService.logout();
  }

  toogleNotificacion()  {
    this.notificationService.toogleNotification()
  }

}

