import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SuiteService } from 'src/app/services/suite.service';
import { User } from 'src/app/models/user';
import { first } from 'rxjs/operators';
import { PartnerService } from 'src/app/services/partner.service';
import { MenuService } from 'src/app/services/menu.service';
import { TranslateService } from '@ngx-translate/core';
import { UserValidator } from 'src/app/validators/user.validator';
//Recaptcha
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UserEid } from 'src/app/models/userEid';
import { LanguageService } from 'src/app/services/language.service';
import { SingleSignonService } from 'src/app/services/singleSignon.service';
import { exit } from 'process';
import { LocalService } from 'src/app/services/local.service';




declare var $: any;
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  encapsulation: ViewEncapsulation.None,

})

export class LandingComponent implements OnInit, AfterViewInit{
  public listLicenses = [];
  public lista: string[] = [];
  public ssoadt: boolean = false;
  public loadingssoadt: boolean;
  closeResult: string;
  public loading = false;
  public redirecting = false;
  submitted = false;
  returnUrl: string;
  public loginText = "";
  public loginError = false;
  public loginZurichError = false;
  public backgroundImage: string;
  public registerFormStep = 0;
  loginForm: FormGroup;
  public userPlaceholder: string;
  public parsedParams: any;
  public login: string = "";
  checkCodeForm: FormGroup;
  registerCodeForm: FormGroup;
  public showPhoneOption: number = 0;
  //Recaptcha
  private allExecutionsSubscription: Subscription;
  private allExecutionErrorsSubscription: Subscription;
  private singleExecutionSubscription: Subscription;
  public recentToken = "";
  public recentError?: { error: any };
  public typePassword = "password";
  keepSession: boolean = true;
  public tokenInterval;
  public cookiesAccepted = false;

  /*COOKIES*/
  public title: string;
  public message: string;
  public policyLinkCookies: string = "";
  public policyLinkPrivacy: string = "";
  public selectLanguage: FormControl = new FormControl();
  public dropdownLanguage: string = "";

  //SingleSignOn
  public userSsoEmail: string;
  public seleccionado: any;

  // activation validators
  public allreadyActivated: boolean = false;
  public loginUrl: string;
  public userEmail: string;
  public badToken: boolean = false;
  public validatingToken: boolean = true;
  //loginHelp section
  public showHelp: boolean = false;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private suiteService: SuiteService,
    private localService: LocalService,
    public partnerService: PartnerService,
    private menuService: MenuService,
    public languageService: LanguageService,
    private translate: TranslateService,
    private recaptchaV3Service: ReCaptchaV3Service,
    public sanitizer: DomSanitizer,
    public messageService: MessageService,
    public singleSignonService: SingleSignonService,
    
  ) {
    var found = partnerService.partner.languages.find(element => element.code == this.languageService.lan);
    if (!found) {
      
      var element = partnerService.partner.languages.find(element => element.default);
      this.dropdownLanguage = element.code;
      this.selectLanguage.setValue(element.name);
      this.changeLanguage(element.code, false);
    }
    else {
      this.dropdownLanguage = this.partnerService.partner['languageName'];
      this.selectLanguage.setValue(this.languageService.lan);
    }

  }

  async ngOnInit() {
    this.loadingssoadt = false;
    //SSO ADT Brasil------------------------------------------------
    if (this.partnerService.partner.loginType == 9) {
      var token = this.route.snapshot.paramMap.get("token");
      if (this.userService.currentUserValue == null && token == null) {
        this.loadingssoadt = true;
        window.location.href = 'https://vdigitaldata.com';
        exit;
      }
      this.ssoadt = false;
      if (token != null) {

        this.userService.getContracts(token).then(result => {
          if (result != "") {
            this.ssoadt = true;
            //this.partnerService.partner.loginType = 2;  //MAM test ADT
            let obj = JSON.parse(result);
            obj.items.forEach(element => {
              this.listLicenses.push({ id: element.CustomerId, name: element.CustomerId + "-" + element.CustomerName });
            });
            
            if (this.listLicenses.length == 1) {
              this.onSubmit();
            }
          }
          else {
            this.messageService.add(this.translate.instant('REGISTER_FORM.RESULT_ERROR1').replaceAll("{{identifier}}", this.partnerService.partner.uniqueIdentifier), "ok");
          }
        });
      }
    }
    //------------------------------------------------   

    this.redirecting = true;

    if (this.userService.currentUserValue)
      this.loginRedirect();
    else {
      this.redirecting = false;
      try {
        const param = this.route.snapshot.queryParams.param;
        const token = this.route.snapshot.queryParams.token;
        //alert(token);
        if (param) {
          const decodedParams = atob(param);
          this.parsedParams = JSON.parse(decodedParams);
          this.login = this.parsedParams.login;
          if (this.isValidString(this.parsedParams.autoregister_code)) {
            this.login = this.parsedParams.autoregister_code;
          }
          else if (this.isValidString(this.parsedParams.login)) {
            this.login = this.parsedParams.login;
          }
        }
        if (token)
          if (this.isValidString(token))
            this.getRegisterCode(token);
      }
      catch (error) {
        this.login = '';
      }
    }

    //this.partnerService.partner.loginType = 2;  //MAM test ADT
    if (this.partnerService.partner.loginType === 1 || this.partnerService.partner.loginType === 4 || this.partnerService.partner.loginType === 6)
      this.translate.get('EMAIL').subscribe(res => this.loginText = res);
    else
      this.loginText = this.partnerService.partner.loginText;

    if (this.partnerService.partner.loginType === 1 || this.partnerService.partner.loginType === 4 || this.partnerService.partner.loginType === 5 || this.partnerService.partner.loginType === 6) {
      if (this.partnerService.partner.loginType === 4 || this.partnerService.partner.loginType === 6 || this.partnerService.partner.loginType === 5) {
        this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
        });
      }
      else {
        this.loginForm = this.formBuilder.group({
          username: [this.login, [Validators.required, Validators.pattern(UserValidator.EMAIL_PATTERN)]],
          password: ['', Validators.required]
        });
      }

      this.translate.get('RECOVER_WRITE').subscribe(res => {
        this.userPlaceholder = res.replace("{{userPlaceholder}}", this.partnerService.partner.userPlaceholder != null && this.partnerService.partner.userPlaceholder != "" ? this.partnerService.partner.userPlaceholder : "email");
      })
    }
    else {
      if (this.partnerService.partner.loginType === 2 || this.partnerService.partner.loginType === 9 
        || this.partnerService.partner.loginType === 3 || this.partnerService.partner.loginType === 7 
        || this.partnerService.partner.loginType === 8 || this.partnerService.partner.loginType === 10) {
          this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['']
          });
      }
    }

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.partnerService.isRecover) {      
      var user = new User();
      user.code = this.partnerService.partner.code;
      user.recover = this.partnerService.recover;
      user.languageCode = localStorage.getItem('langUser');
      this.loginRedirect();
      // this.userService.login(user)
      //   .pipe(first())
      //   .subscribe(
      //     data => {
      //       localStorage.setItem('keepSession', String(this.keepSession))
      //       this.setAcceptCookies()
      //       this.loading = false;
      //       clearInterval(this.tokenInterval)
      //       this.loginRedirect();
      //     },
      //     error => {
      //       console.log(error)
      //       this.loginError = true;
      //       this.loading = false;
      //     });
    }
    this.cookiesAccepted = Boolean(localStorage.getItem('acceptCookies'));
    if (!this.cookiesAccepted) {
      const cookies = this.partnerService.partnerCookies;
      if (cookies != null) {
        if (cookies.title) {
          this.title = cookies.title;
        }
        else {
          this.translate.get("COOKIES.TITLE").toPromise().then((translation) => { this.title = translation })
        }

        if (cookies.message) {
          this.message = cookies.message;
        }
        else {
          this.translate.get("COOKIES.PARAGRAPH1").toPromise().then((translation) => { this.message = translation })
        }
        if (cookies.externalDisplayCookies) {
          this.policyLinkCookies = cookies.policyLinkCookies;
        }
        else if (cookies.internalDisplayCookies) {
          this.policyLinkCookies = window.location.origin + "/#/policyCookies";
        }
        if (cookies.externalDisplayPrivacy) {
          this.policyLinkPrivacy = cookies.policyLinkPrivacy;
        }
        else if (cookies.internalDisplayPrivacy) {
          this.policyLinkPrivacy = window.location.origin + "/#/policyPrivacy";
        }
      }
    }
    // if (this.partnerService.partner.loginType === 1) {
    //   await this.singleSignonService.GoogleAuthentication();
    // } 



  }

  ngAfterViewInit(){
    
    if (this.userService.tokenSSO) {
      this.redirecting = true;
      this.loginPartner();
    }
    if (this.userService.activationToken) {
      this.validatingToken = true
      if(this.getLocalStorage('currentUser')){
        var langUser = localStorage.getItem('langUser')
        let activationToken = localStorage.getItem('activationToken')
        localStorage.clear()
        localStorage.setItem('langUser', langUser)
        localStorage.setItem('activationToken', activationToken)
      }
      this.validateUserStatus();
    }
  }

  async validateUserStatus(){
    await this.userService.getusertokendata(this.userService.activationToken).then(
      result => {
        this.validatingToken = false;
        if(result == null){
          this.badToken = true;
          localStorage.removeItem('activationToken');
        }else{
          var user = Object.assign({}, result as User);
          if (user.checkTermsAcceptDate == true){
            this.userEmail = user.email;
            this.allreadyActivated = true;
            this.loginUrl = window.location.href.toString().split('#')[0]
          }else{
            this.allreadyActivated = false;
            this.redirecting = true;
            this.router.navigate(['activation']); 
          }
        }
      },
      err => {
        console.log("Error: ", err)
      });
  }

  showLogin(){
    localStorage.removeItem('activationToken');
    this.badToken = false;
    this.userService.activationToken = null
    this.allreadyActivated = false;
  }
  
  public setAcceptCookies() {
    if (localStorage.getItem('acceptCookies') == null) {
      localStorage.setItem('acceptCookies', JSON.stringify(true));
      $('#cajacookies').hide();
    }
  }
  isValidString(str: string) {
    return str !== null && str !== undefined && typeof str === "string" && str.length > 0;
  }

  get f() { return this.loginForm.controls; }


  onSubmit() {
    if (this.loginForm.invalid && !this.ssoadt) { this.loading = false; return; }

    this.submitted = true;
    this.loading = true;
    this.loginError = false;
    var user = new User();
    user.code = this.partnerService.partner.code;
    user.username = this.f.username.value.trim();

    if (this.ssoadt == true) {
      {
        if (this.listLicenses.length == 1)
          user.username = this.listLicenses[0].id;
      }
    }
    //Recaptcha
    user.sso = false;

    if (!this.userSsoEmail && (
      this.partnerService.partner.loginType === 1
      || this.partnerService.partner.loginType === 4
      || this.partnerService.partner.loginType === 5
      || this.partnerService.partner.loginType === 6
    ))
      user.password = this.f.password.value.trim();
    else {

      user.password = '';
      if (this.partnerService.partner.loginType === 7) {
        let isDNI = false;
        if (UserValidator.NIFValidation(user.username) == null || UserValidator.NIEValidation(user.username) == null) isDNI = true;
        if (!isDNI) {
          this.loginError = true;
          this.loading = false;
          return;
        }
      }
    }

    if (this.userSsoEmail) {
      user.username = this.userSsoEmail;
      user.sso = true;
      this.submitted = false;
    }

    user.languageCode = localStorage.getItem('langUser');
    this.singleExecutionSubscription = this.recaptchaV3Service
      .execute('register')
      .subscribe(
        (token) => {
          user.token = token;
          this.recentError = undefined;
          this.userService.login(user)
            .pipe(first())
            .subscribe(
              data => {
                if (data.id != -1) { // To Zurich error
                  localStorage.setItem('keepSession', String(this.keepSession))
                  this.setAcceptCookies()
                  this.loading = false;
                  clearInterval(this.tokenInterval)
                  this.loginRedirect();
                }
                else {
                  this.loginZurichError = true;
                  this.loading = false;
                }
              },
              error => {
                this.loginError = true;
                this.loading = false;
              });
        },
        (error) => {
          this.recentToken = "";
          this.recentError = { error };
        }
      );
  }


  ngAfterContentInit() {
    if (this.partnerService.partner.login != null && this.partnerService.partner.login != "") {
      this.backgroundImage = 'url(' + this.partnerService.partner.login + ')';
    }
    else { // Get default
      this.backgroundImage = '';
    }

  }

  checkCheckboxSession(event) {
    this.keepSession = event.target.checked
  }

  async getRegisterCode(token) {
    var userEid = new UserEid();
    userEid.partnerId = this.partnerService.partner.id;
    userEid.eid = token;
    var registerCode = '';
    await this.userService.decodeRegisterCode(userEid).then(result => { registerCode = result });
    if (registerCode !== null && registerCode !== undefined && registerCode !== '') {
      this.userService.checkRegCodeActivated(registerCode, this.partnerService.partner.id.toString()).then(result => {
        if (!result) {
          localStorage.setItem('registerCode', String(registerCode))
          this.loading = false;
          this.goSignup();
        }
        else
          this.messageService.add(this.translate.instant('REGISTER_FORM.RESULT_ERROR1').replaceAll("{{identifier}}", this.partnerService.partner.uniqueIdentifier), "ok");
      })
    }
    else
      this.messageService.add(this.translate.instant('TOKEN_INCORRECTO'), "error");
  }


  async loginRedirect() {
    if (this.partnerService.isRecover) {
      this.partnerService.isRecover = false;
      this.router.navigate(['/recoverpassword']);
      return;
    }

    if (this.userService.currentUserValue.role == "BAS" || this.userService.currentUserValue.role == "CHI") {
      if (!this.userService.currentUserValue.inJira) {
        this.router.navigate(['/profile']);
        return;
      }

      if (!this.userService.currentUserValue.passwordChanged) {
        this.router.navigate(['/profile']);
        return;
      }

      if (!this.userService.currentUserValue.checkTermsAcceptDate) {
        this.router.navigate(['/profile']);
        return;
      }

      await this.suiteService.getUserSuites();

      if (this.suiteService.suites == undefined)
        this.router.navigate(['/offline']);
      else {
        if (localStorage.getItem('partnerSuiteId')) {
          this.userService.selSuiteId = Number(localStorage.getItem('partnerSuiteId'));
          this.userService.selSuiteName = localStorage.getItem('suiteName');
        }
        else {
          this.userService.selSuiteId = this.suiteService.suites[0].id;
          this.userService.selSuiteName = this.suiteService.suites[0].name
          localStorage.setItem('maxCardsByUser', this.suiteService.suites[0].maxCardsByUser.toString())
          localStorage.setItem('maxIdentitiesByUser', this.suiteService.suites[0].maxIdentitiesByUser.toString())
        }
        this.router.navigate(['/services']);
      }
    }
    else if (this.userService.currentUserValue.role == "SUP" || this.userService.currentUserValue.role == "OPE") {
      this.menuService.loadMenu();
      this.router.navigate(['/admin/admin']);
    }
    else if (this.userService.currentUserValue.role == "SEA") {
      this.menuService.loadMenu();
      this.router.navigate(['/admin/admin']);
    }
    else if (this.userService.currentUserValue.role == "ADM") {
      this.menuService.loadMenu();
      this.router.navigate(['/admin/admin']);
    }
  }
  onkeyPress(event: any) {
    if (event.charCode == 32) return false;
  }
  //Captcha
  ngOnDestroy(): void {
    if (this.allExecutionsSubscription) {
      this.allExecutionsSubscription.unsubscribe();
    }
    if (this.allExecutionErrorsSubscription) {
      this.allExecutionErrorsSubscription.unsubscribe();
    }
    if (this.singleExecutionSubscription) {
      this.singleExecutionSubscription.unsubscribe();
    }
  }


  goSignup() {
    this.setAcceptCookies()
    this.router.navigate(['signup']);
  }

  goResetPassword() {
    this.setAcceptCookies()
    this.router.navigate(['resetpassword']);
  }

  tooglePassword() {
    if (this.typePassword == "password")
      this.typePassword = "text";
    else
      this.typePassword = "password"
  }

  changeLanguage(languageCode, reload) {
    this.languageService.setLanguage(languageCode, reload);
  }

  async authenticateGoogle() {

    if (this.singleSignonService.authInstance) {
      await this.singleSignonService.GoogleLogin();
    }

    if (this.singleSignonService.GoogleUser != null && this.singleSignonService.GoogleUser.getBasicProfile().getEmail() != "") {
      this.userSsoEmail = this.singleSignonService.GoogleUser.getBasicProfile().getEmail();
      this.onSubmit();
    }
  }

  async authenticateFacebook() {
    await this.singleSignonService.FacebookLogin();
    if (this.singleSignonService.FacebookStatus &&
      this.singleSignonService.FacebookStatus.status === 'connected') {
      await this.singleSignonService.FacebookGetEmail();
      if (this.singleSignonService.FacebookUser && this.singleSignonService.FacebookUser.email != "") {
        this.userSsoEmail = this.singleSignonService.FacebookUser.email;
        this.singleSignonService.FacebookUser = null;
        this.onSubmit();
      }
    }
  }

  loginPartner(){
    var user = new User
    this.recaptchaV3Service
      .execute('register')
      .subscribe(
        (token) => {
          user.token = token;
          user.tokenSSO = this.userService.tokenSSO;
          user.username = "";
          user.password = "";
          user.code = this.partnerService.partner.code;
          user.languageCode = localStorage.getItem('langUser');
          user.sso = false;
          this.userService.login(user)
            .pipe(first())
            .subscribe(
              data => {
                if (data.id != -1) { // To Zurich error
                  localStorage.setItem('keepSession', String(this.keepSession))
                  this.setAcceptCookies()
                  this.loading = false;
                  clearInterval(this.tokenInterval)
                  this.loginRedirect();
                }
                else {
                  this.loginZurichError = true;
                  this.loading = false;
                }
              },
              error => {
                this.loginError = true;
                this.loading = false;
              }
            );
        },
        (error) => {
          this.recentToken = "";
          this.recentError = { error };
        }
      ); 
  }

  toggleHelp(){
    this.showHelp = !this.showHelp
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);
  }

}

