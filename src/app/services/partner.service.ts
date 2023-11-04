import { PartnerSeo } from './../models/partnerSeo';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Partner } from '../models/partner';
import { PartnerAdminDetails } from '../models/partnerAdminDetails';
import { PartnerAdminLanguages } from '../models/partnerAdminLanguages';
import { PartnerAdminLanding } from '../models/partnerAdminLanding';
import { PartnerAdminLogin } from '../models/partnerAdminLogin';
import { PartnerAdminSuites } from '../models/partnerAdminSuites';
import { PartnerAdminSKUs } from '../models/partnerAdminSKUs';
import { PartnerAdminServices } from '../models/partnerAdminServices';
import { PartnerAdminThirdPartiesServices } from '../models/partnerAdminThirdPartiesServices';
import { PartnerAdminMailing } from '../models/partnerAdminMailing';
import { PartnerAdminChat } from '../models/partnerAdminChat';
import { PartnerAdminLookAndFeel } from '../models/partnerAdminLookAndFeel';
import { PartnerAdminPwa } from '../models/partnerAdminPwa';
import { PartnerAdminSeo } from '../models/partnerAdminSeo';
import { PartnerAdminCookies } from '../models/partnerAdminCookies';
import { PartnerAdminCommChannels } from '../models/partnerAdminCommChannels';
import { LanguageService } from './language.service';
import { environment } from '../../environments/environment'
import { Suite } from '../models/suite';
import { Generic } from '../models/generic';
import { CountryService } from './country.service';
import { ActivatePartner } from '../models/activatePartner';
import { PartnerLanguage } from '../models/partnerLanguage';
import { PartnerChat } from '../models/partnerChat';
import { PartnerSuiteLans } from '../models/PartnerSuiteLans';
import { PartnerSuite } from '../models/partnerSuite';
import { PartnerInitialElements } from '../models/partnerInitialElements';
import { PartnerPwaConfig } from '../models/partnerPwaConfig';
import { AppInstallerService } from './app-installer.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PartnerDuplicate } from '../models/partnerDuplicate';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../models/language';
import { SingleSignonService } from './singleSignon.service';
import { DashboardInfo } from '../models/dashboardInfo';
import { PartnerUserCount } from '../models/partnerUserCount';
import { PartnerControlPanelView } from '../models/partnerControlPanelView';
import { PartnerAdminErrors } from '../models/partnerAdminErrors';
import { JiraProject } from '../models/jiraProject';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  public staticContentUrl = environment.STATIC_CONTENT;
  public partner: Partner;
  public partnerAdminErrors: PartnerAdminErrors;
  public partnerAdminDetails: PartnerAdminDetails;
  public partnerAdminLanguages: PartnerAdminLanguages;
  public partnerAdminLanding: PartnerAdminLanding;
  public partnerAdminLogin: PartnerAdminLogin;
  public partnerAdminSuites: PartnerAdminSuites;
  public partnerAdminSKUs: PartnerAdminSKUs;
  public partnerAdminServices: PartnerAdminServices;
  public partnerAdminThirdPartiesServices: PartnerAdminThirdPartiesServices;
  public partnerAdminMailing: PartnerAdminMailing;
  public partnerAdminChat: PartnerAdminChat;
  public partnerAdminLookAndFeel: PartnerAdminLookAndFeel;
  public partnerAdminPwa: PartnerAdminPwa;
  public partnerAdminSeo: PartnerAdminSeo;
  public partnerAdminCookies: PartnerAdminCookies;
  public partnerAdminCommChannels: PartnerAdminCommChannels;
  public partnerCookies: PartnerAdminCookies;
  public partnerLanguages: Language[];
  public partnerSuites: Suite[];
  public editPartner: Partner;
  public partners: PartnerControlPanelView[];
  public countries: Generic[];
  public suites: Generic[];
  public partnerLanguage: PartnerLanguage;
  public partnerChat: PartnerChat;
  public partnerSuiteLans: PartnerSuiteLans;
  public partnerSuite: PartnerSuite;
  public additionalText = "";
  public placeholderLogin = "";
  public isRecover = false;
  public recover: string;
  public initialElements: PartnerInitialElements;
  public cssUrl: string;
  public preloaderImage;
  public backgroundImage: string;
  public countsByPartner: PartnerUserCount[];
  public jiraProjects: JiraProject[];
  public browser

  constructor(private http: HttpClient,
    private languageService: LanguageService,
    private countryService: CountryService,
    public appInstaller: AppInstallerService,
    public sanitizer: DomSanitizer,
    public translate: TranslateService,
    public singleSignonService: SingleSignonService) { }

  delay(delayInms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }
  public async Init() {
    this.browser = this.getBrowserName()
    await this.appInstaller.registerServiceWorker()
    var domain = /:\/\/([^\/]+)/.exec(window.location.href)[1];
    if (domain.includes(environment.host)) {
      domain = domain.split(".")[0];
    }

    while (localStorage.getItem('swLoaded') == 'false') {
      await this.delay(20)
    }

    domain = "soportedigitalsura"

    await this.loadInitialElements(domain);


    await this.loadCss("fonts/myicons/myicons.css", 'myIcons', 'stylesheet');
    await this.loadCss("fonts/newcore/newcore.css", 'newCore', 'stylesheet');
    await this.loadScript("fonts/font-awesome/font-awesome.js", 'fontAwesome', null, 'anonymous');
    await this.loadCss("css/bootstrap.min.css", 'bootstrapMinCss', 'stylesheet','anonymous');
    await this.loadCss("css/bootstrap-select.min.css", 'bootstrapSelectMinCss', 'stylesheet');
    await this.loadScript("js/jquery-3.6.0.min.js", 'jqueryJs', null, 'anonymous');
    await this.loadScript("js/popper.min.js", 'popperJs', null, 'anonymous');
    await this.loadScript("js/bootstrap.min.js", 'bootstrapMinJs', null, 'anonymous');
    await this.loadScript("js/bootstrap-select.min.js", 'bootstrapSelectMinJs');
    await this.loadScript("js/startchat.js", 'startchat', null, 'anonymous');
    await this.loadCss("css/styles.css", 'styles', 'stylesheet');


    return new Promise<void>((resolve, reject) => {
      let params = new HttpParams();
      let addr = new URL(window.location.href);
      let recover = addr.searchParams.get("recover");

      params = params.set('subdomain', domain);
      params = params.set('lan', this.languageService.lan);
      return this.http.get<Partner>(environment.apiEndpoint + "api/partner", { params })
        .toPromise()
        .then(
          res => {
            this.partnerCookies = res.partnerCookies;
            this.countryService.getCountries(res.id).then(result => {
              this.countries = result.sort(
                (a, b) => {
                  if (a.name < b.name) { return -1; }
                  if (a.name > b.name) { return 1; }
                }
              )
                ;
            })
            this.partner = res;

            // console.log("PARTNER");
            this.translate.use(this.partner.lan);
            this.languageService.setLanguage(this.partner.lan, false);
            this.translate.use(this.languageService.lan).subscribe(() => {
              if (!this.partner.loginTitle) {
                this.translate.get('LOGIN_TITLE_DEFAULT').toPromise().then(res => { this.partner.loginTitle = res; }
                )
              }
              if (!this.partner.loginSubtitle) {
                this.translate.get('LOGIN_SUBTITLE_DEFAULT').toPromise().then(res => this.partner.loginSubtitle = res);
              }
            })

            if (recover != null && recover.length == 36) {
              this.isRecover = true;
              this.recover = recover;
            }
            this.cssUrl = `${environment.STATIC_SERVER}webapi/partners/${this.partner.code}/css/lookfeel.css?nocache=${new Date().getTime()}`;

            // Get background login image
            if (this.partner.login != null && this.partner.login != "") {
              this.backgroundImage = 'url(' + this.partner.login + ')';
            }
            else { // Get default
              this.backgroundImage = '';
            }




            // Adding css link dynamically
            var link = document.createElement('link');
            link.id = "lkPartner";
            link.rel = "preload"
            link.href = this.cssUrl;
            link.onload = function () {
              resolve();
            };
            link.rel = "stylesheet";
            document.getElementsByTagName('head')[0].appendChild(link);

          }, error => {
            resolve();
          }
        );
    });
  }

  public getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    console.log("agent:", agent)
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
}

  public async loadScript(url, id, integrity?: string, crossOrigin?: string, type?: string){
    var script = document.createElement('script');
    script.src = `${environment.STATIC_CONTENT}${url}`
    script.id = id;
    type ? script.type = type : null;
    integrity ? script.integrity = integrity : null;
    crossOrigin ? script.crossOrigin = crossOrigin : null;
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  public async loadCss(url, id, rel, crossOrigin? : string){
    var stylesUrl = `${environment.STATIC_CONTENT}${url}`
    var link = document.createElement('link');
    crossOrigin ? link.crossOrigin = crossOrigin : null;
    link.id = id;
    link.rel = rel
    link.href = stylesUrl;
    link.type = 'text/css'
    document.getElementsByTagName('head')[0].appendChild(link);
  }



  public async loadPartners(reload: boolean = false) {
    if (this.partners != undefined && !reload)
      return;
    return this.http.get<PartnerControlPanelView[]>(environment.apiEndpoint + "api/partners").toPromise().then(result => {
      this.partners =  result.sort(function (a, b) {
         return a.name.toLowerCase().localeCompare(b.name.toLowerCase());

       });
    });
  }
  public async loadJiraX3(reload: boolean = false) {
    return this.http.get<JiraProject[]>(environment.apiEndpoint + "api/JiraX3").toPromise().then(result => {
      this.jiraProjects =  result.sort(function (a, b) {
         return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
       });
    });
  }

  public async loadPartnerSuites(partnerId: number): Promise<Generic[]> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.get<Generic[]>(environment.apiEndpoint + "api/suite/partner", { params }).toPromise();
  }

  public async getPartner(id: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('id', id.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/get", { params }).toPromise();
  }

  public async getPartnerAdminErrors(partnerId: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/admin_errors", { params }).toPromise().then(result => { this.partnerAdminErrors = result; });
  }

  public async getPartnerAdminDetails(id: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('id', id.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/admin_details", { params }).toPromise().then(result => { this.partnerAdminDetails = result; });
  }

  public async getPartnerAdminLanguages(partnerId: number, languageId: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    params = params.set('languageId', languageId.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/admin_languages", { params }).toPromise().then(result => {
      this.partnerAdminLanguages = result;
      this.getLanguagesPartner(this.partnerAdminLanguages.languages);
    });
  }

  public async getPartnerAdminLanding(partnerId: number, languageId: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    params = params.set('languageId', languageId.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/admin_landing", { params }).toPromise().then(result => {
      this.partnerAdminLanding = result;
      this.getLanguagesPartner(this.partnerAdminLanding.languages);
    });
  }

  public async getPartnerAdminLogin(partnerId: number, languageId: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    params = params.set('languageId', languageId.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/admin_login", { params }).toPromise().then(result => {
      this.partnerAdminLogin = result;
      this.getLanguagesPartner(this.partnerAdminLogin.languages);
    });
  }

  public async getPartnerAdminSuites(partnerId: number, suiteId: number, languageId: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    params = params.set('suiteId', suiteId.toString());
    params = params.set('languageId', languageId.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/admin_suites", { params }).toPromise().then(result => {
      this.partnerAdminSuites = result;
      this.getSuitesPartner(this.partnerAdminSuites.suites);
      this.getLanguagesPartner(this.partnerAdminSuites.languages);
    });
  }

  public async getPartnerAdminSKUs(partnerId: number, languageId: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    params = params.set('languageId', languageId.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/admin_skus", { params }).toPromise().then(result => {
      this.partnerAdminSKUs = result;
    });
  }

  public async getPartnerAdminServices(partnerId: number, suiteId: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    params = params.set('suiteId', suiteId.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/admin_services", { params }).toPromise().then(result => {
      this.partnerAdminServices = result;
      this.getSuitesPartner(this.partnerAdminServices.suites);
    });
  }

  public async getPartnerAdminThirdPartiesServices(partnerId: number, suiteId: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    params = params.set('suiteId', suiteId.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/admin_thirdparties_services", { params }).toPromise().then(result => {
      this.partnerAdminThirdPartiesServices = result;
      this.getSuitesPartner(this.partnerAdminThirdPartiesServices.suites);
    });
  }

  public async getPartnerAdminMailing(partnerId: number, languageId: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    params = params.set('languageId', languageId.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/admin_mailing", { params }).toPromise().then(result => {
      this.partnerAdminMailing = result;
      this.getLanguagesPartner(this.partnerAdminMailing.languages);
    });
  }

  public async getPartnerAdminChat(partnerId: number, suiteId: number, languageId: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    params = params.set('suiteId', suiteId.toString());
    params = params.set('languageId', languageId.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/admin_chat", { params }).toPromise().then(result => {
      this.partnerAdminChat = result;
      this.getSuitesPartner(this.partnerAdminChat.suites);
      this.getLanguagesPartner(this.partnerAdminChat.languages);
    });
  }

  public async getPartnerAdminLookAndFeel(partnerId: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/admin_lookandfeel", { params }).toPromise().then(result => {
      this.partnerAdminLookAndFeel = result;
    });
  }

  public async getPartnerAdminPwa(partnerId: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/admin_pwa", { params }).toPromise().then(result => {
      this.partnerAdminPwa = result;
    });
  }

  public async getPartnerAdminSeo(partnerId: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/admin_seo", { params }).toPromise().then(result => {
      this.partnerAdminSeo = result;
    });
  }

  public async getPartnerAdminCookies(partnerId: number, languageId: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    params = params.set('languageId', languageId.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/admin_cookies", { params }).toPromise().then(result => {
      this.partnerAdminCookies = result;
      if (!this.partnerAdminCookies.internalTextCookies) {
        this.translate.get('COMP_PARTNERS.NOT_CONFIGURED').toPromise().then((res) => this.partnerAdminCookies.title = this.partnerAdminCookies.message = res)
      }
      this.getLanguagesPartner(this.partnerAdminCookies.languages);
    });
  }

  public async getPartnerAdminCommChannels(partnerId: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/admin_commchannels", { params }).toPromise().then(result => {
      this.partnerAdminCommChannels = result;
    });
  }

  private getLanguagesPartner(languages) {
    var languagesPartner = [];
    languages.forEach(element => {
      if (element.checked) {
        var lang = new Language();
        lang.id = element.id;
        lang.code = element.code;
        lang.checked = element.checked;
        lang.default = element.default;
        lang.name = element.name;
        languagesPartner.push(lang);
      }
    });
    this.partnerLanguages = languagesPartner;
  }

  private getSuitesPartner(suites) {
    var suitesPartner = [];
    suites.forEach(element => {
      if (element.checked) {
        var suite = new Suite();
        suite.id = element.id;
        suite.code = element.code;
        suite.checked = element.checked;
        suite.name = element.name;
        suitesPartner.push(suite);
      }
    });
    this.partnerSuites = suitesPartner;
  }

  public async loadInitialElements(domain: string) {
    let params = new HttpParams();
    params = params.set('subdomain', domain);
    params = params.set('lan', this.languageService.lan);
    this.http.get<PartnerInitialElements>(environment.apiEndpoint + "api/partner/initialelements", { params }).toPromise().then(result => {
      this.initialElements = result;
      // this.languageService.setLanguage(this.initialElements.lan);
      if (result.preloader) {
        this.preloaderImage = this.initialElements.preloader;
        let preloader = document.getElementById('initialPreloader')
        preloader.setAttribute("src", this.preloaderImage);
        preloader.style.visibility = "visible";
      }
      // As default
      else {
        this.initialElements.preloader = `${this.staticContentUrl}img/brand/preloader.gif`;
      }
      if (result.favicon) {
        document.getElementById('favicon').setAttribute("href", this.initialElements.favicon);
      }

      if (this.initialElements.loginType == 1) {
        this.singleSignonService.FacebookInit();
        this.singleSignonService.GoogleInit();
      }

      if (result.pwaName && result.pwaIconPath && result.pwaStatusBarColor && result.pwaMobileIconPath && !domain.includes("localhost")) { // Has pwa configuration -> registering sw and pwa configuration
        this.loadPwaManifest()
      }
    }
    );
  }

  public getPartnerKey(partnerId: number): Observable<string> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.get<string>(environment.apiEndpoint + "api/partner/key", { params });
  }

  public getPartnerSuites(partnerId: number): Observable<Suite[]> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.get<Suite[]>(environment.apiEndpoint + "api/suite/partner", { params });
  }

  public getPartnerSuitesServices(partnerId: number, suiteId: number): Observable<Suite[]> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    params = params.set('suiteId', suiteId.toString());
    return this.http.get<Suite[]>(environment.apiEndpoint + "api/suite/partner/services", { params });
  }

  public async getPartnerLanguage(partnerId: number, languageId: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    params = params.set('languageId', languageId.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/language", { params }).toPromise().then(result => { this.partnerLanguage = result; });
  }

  public async getPartnerSuiteLans(partnerId: number, suiteId: number, languageId: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    params = params.set('suiteId', suiteId.toString());
    params = params.set('languageId', languageId.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/suitelans", { params }).toPromise().then(result => { this.partnerSuiteLans = result; });
  }

  public async getPartnerChat(partnerId: number, suiteId: number, languageId: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    params = params.set('suiteId', suiteId.toString());
    params = params.set('languageId', languageId.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/partner/partnerchat", { params }).toPromise().then(result => { this.partnerChat = result; });
  }

  public async getPwaConfiguration(partnerId: number) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.get<PartnerPwaConfig>(environment.apiEndpoint + "api/partner/pwa", { params }).toPromise();
  }

  public async getPartnerSeo(partnerId: number) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.get<PartnerSeo>(environment.apiEndpoint + "api/partner/seo", { params }).toPromise();
  }

  public async getProjectFootKeys() {
    return this.http.get<any>(environment.apiEndpoint + "api/partner/projectfootkeys",).toPromise();
  }

  public async createPartner(partner: Partner) {
    return this.http.post<Partner>(environment.apiEndpoint + "api/partner", partner).toPromise();
  }

  public async partnerDuplicate(partner: PartnerDuplicate) {
    return this.http.post<boolean>(environment.apiEndpoint + "api/partner/duplicate", partner).toPromise();
  }

  public async createPartnerDetails(partner: Partner) {
    return this.http.post<Partner>(environment.apiEndpoint + "api/partner/details", partner).toPromise();
  }

  public async updatePartner(partner: Partner) {
    return this.http.put<Partner>(environment.apiEndpoint + "api/partner", partner).toPromise();
  }

  public async updatePartnerDetails(partner: Partner) {
    return this.http.put<Partner>(environment.apiEndpoint + "api/partner/details", partner).toPromise();
  }

  public async updatePartnerLanding(partner: Partner) {
    return this.http.put<Partner>(environment.apiEndpoint + "api/partner/landing", partner).toPromise();
  }

  public async updatePartnerSuites(partner: Partner) {
    return this.http.put<Partner>(environment.apiEndpoint + "api/partner/suites", partner).toPromise();
  }

  public async updatePartnerServices(partner: Partner) {
    return this.http.put<Partner>(environment.apiEndpoint + "api/partner/services", partner).toPromise();
  }

  public async updatePartnerLogin(partner: Partner) {
    return this.http.put<Partner>(environment.apiEndpoint + "api/partner/login", partner).toPromise();
  }

  public async updatePartnerMensajeria(partner: Partner) {
    return this.http.put<Partner>(environment.apiEndpoint + "api/partner/mensajeria", partner).toPromise();
  }

  public async updatePartnerChat(partner: Partner) {
    return this.http.put<Partner>(environment.apiEndpoint + "api/partner/chat", partner).toPromise();
  }

  public async updatePwaConfig(pwaConfig: PartnerPwaConfig, partnerId: number) {
    return this.http.put<boolean>(environment.apiEndpoint + "api/partner/pwa?partnerId=" + partnerId, pwaConfig).toPromise();
  }

  public async updatePartnerSeo(partnerSeo: PartnerSeo) {
    return this.http.put<boolean>(environment.apiEndpoint + "api/partner/seo", partnerSeo).toPromise();
  }

  public async updatePartnerCookie(partner: Partner) {
    return this.http.put<boolean>(environment.apiEndpoint + "api/partner/cookie", partner).toPromise();
  }

  public async filePartnerChat(formData: FormData, name: string) {
    let params = new HttpParams();
    params = params.set('name', name);
    return this.http.post<any>(environment.apiEndpoint + "api/partner/filechat", formData, { params }).toPromise();
  }

  public async uploadFileServerStatic(formData: FormData) {
    return this.http.put<Partner>(environment.apiEndpoint + "api/partner/uploadFileServerStatic", formData).toPromise();
  }

  public DownloadFonts(partnercode: string, type: string) {
    let params = new HttpParams();
    params = params.set('partnercode', partnercode);
    params = params.set('type', type);
    return this.http.get(environment.apiEndpoint + "api/partner/fonts", {
      responseType: 'blob',
      params: params
    }).toPromise();
  }

  async createPartnerSuites(partnerId: number, suites: Suite[]) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.post<Suite[]>(environment.apiEndpoint + "api/suite/partner", suites, { params }).toPromise();
  }

  //async updatePartnerSuites(partnerId: number, suites: Suite[])
  //{
  //  let params = new HttpParams();
  //  params = params.set('partnerId', partnerId.toString());
  //  return this.http.put<Suite[]>(environment.apiEndpoint + "api/suite/partner", suites, {params}).toPromise();
  //}

  async activatePartner(model: ActivatePartner) {
    return this.http.put(environment.apiEndpoint + "api/partner/activate", model).toPromise();
  }

  async reactivatePartner(model: ActivatePartner) {
    return this.http.put(environment.apiEndpoint + "api/partner/reactivate", model).toPromise();
  }

  public UploadImage(file: FormData) {
    this.http.post(environment.apiEndpoint + 'api/image/upload', file, { observe: 'events' })
      .toPromise()
      .then(
        (response: any) => {
          console.log(response);
        })
      ,
      err => { console.log(err); }
  }
  ////////////////////////
  // PWA CONFIGURATION
  public async loadPwaManifest() {
    this.http.get(environment.pwaManifest).subscribe(data => {
      var jsonstring = JSON.stringify(data)
      jsonstring = jsonstring.split('{{name}}').join(this.initialElements.pwaName)
      jsonstring = jsonstring.split('{{statusBarColor}}').join(this.initialElements.pwaStatusBarColor)
      jsonstring = jsonstring.split('{{backgroundColor}}').join(this.initialElements.pwaBackgroundColor)

      let url: any;
      if ( window.location.href.indexOf("suite/") >= 0) {
          url = new URL(window.location.href.substring(0, window.location.href.indexOf("suite/") + 6));
      } else {
        url = new URL(window.location.href);
      }

      jsonstring = jsonstring.split('{{siteUrl}}').join(url.toString());

      if ((navigator.userAgent.match(/Android/i)) ||
        (navigator.userAgent.match(/webOS/i)) ||
        (navigator.userAgent.match(/iPhone/i)) ||
        (navigator.userAgent.match(/iPad/i))) {
        if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) // Mandatory to "statusbar" iOS
        {
          // iOS Status bar will be main body background color
          var iosStatusBarStyle = document.createElement('meta');
          iosStatusBarStyle.name = "apple-mobile-web-app-status-bar-style"
          iosStatusBarStyle.content = 'black-translucent';
          document.getElementsByTagName('head')[0].appendChild(iosStatusBarStyle);

          document.getElementById('main-body').style.backgroundColor = this.initialElements.pwaStatusBarColor
        }
        jsonstring = jsonstring.split('{{pwaIcon}}').join(this.initialElements.pwaMobileIconPath)
      }
      else {
        jsonstring = jsonstring.split('{{pwaIcon}}').join(this.initialElements.pwaIconPath)
      }

      var link = document.createElement('link');
      const blob = new Blob([jsonstring], { type: 'application/json' });
      const manifestURL = URL.createObjectURL(blob);
      link.href = manifestURL;
      link.rel = 'manifest';
      document.getElementsByTagName('head')[0].appendChild(link);

      var metaThemecolor = document.createElement('meta');
      metaThemecolor.name = "theme-color";
      metaThemecolor.content = this.initialElements.pwaStatusBarColor;
      document.getElementsByTagName('head')[0].appendChild(metaThemecolor);

      var linkIosIcon = document.createElement('link');
      linkIosIcon.href = this.initialElements.pwaMobileIconPath;
      linkIosIcon.rel = 'apple-touch-icon';
      document.getElementsByTagName('head')[0].appendChild(linkIosIcon);

      this.appInstaller.showInstallerAuto()
    });
  }

  public async updatePartnerAdminDetails(partnerAdminDetails: PartnerAdminDetails, partnerId: number) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.put<boolean>(environment.apiEndpoint + "api/partner/admin_details", partnerAdminDetails, { params }).toPromise();
  }
  public async updatePartnerAdminLanguages(partnerAdminLanguages: PartnerAdminLanguages, partnerId: number) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.put<boolean>(environment.apiEndpoint + "api/partner/admin_languages", partnerAdminLanguages, { params }).toPromise();
  }
  public async updatePartnerAdminLanding(partnerAdminLanding: PartnerAdminLanding, partnerId: number) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.put<boolean>(environment.apiEndpoint + "api/partner/admin_landing", partnerAdminLanding, { params }).toPromise();
  }
  public async updatePartnerAdminLogin(partnerAdminLogin: PartnerAdminLogin, partnerId: number) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.put<boolean>(environment.apiEndpoint + "api/partner/admin_login", partnerAdminLogin, { params }).toPromise();
  }
  public async updatePartnerAdminSuites(partnerAdminSuites: PartnerAdminSuites, partnerId: number) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.put<boolean>(environment.apiEndpoint + "api/partner/admin_suites", partnerAdminSuites, { params }).toPromise();
  }
  public async updatePartnerAdminServices(partnerAdminServices: PartnerAdminServices, partnerId: number) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.put<boolean>(environment.apiEndpoint + "api/partner/admin_services", partnerAdminServices, { params }).toPromise();
  }
  public async updatePartnerAdminThirdPartiesServices(partnerAdminThirdPartiesServices: PartnerAdminThirdPartiesServices, partnerId: number) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.put<boolean>(environment.apiEndpoint + "api/partner/admin_thirdparties_services", partnerAdminThirdPartiesServices, { params }).toPromise();
  }
  public async updatePartnerAdminMailing(partnerAdminMailing: PartnerAdminMailing, partnerId: number) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.put<boolean>(environment.apiEndpoint + "api/partner/admin_mailing", partnerAdminMailing, { params }).toPromise();
  }
  public async updatePartnerAdminChat(partnerAdminChat: PartnerAdminChat, partnerId: number) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.put<boolean>(environment.apiEndpoint + "api/partner/admin_chat", partnerAdminChat, { params }).toPromise();
  }
  public async updatePartnerAdminPwa(partnerAdminPwa: PartnerAdminPwa, partnerId: number) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.put<boolean>(environment.apiEndpoint + "api/partner/admin_pwa", partnerAdminPwa, { params }).toPromise();
  }
  public async updatePartnerAdminSeo(partnerAdminSeo: PartnerAdminSeo, partnerId: number) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.put<boolean>(environment.apiEndpoint + "api/partner/admin_seo", partnerAdminSeo, { params }).toPromise();
  }
  public async updatePartnerAdminCookies(partnerAdminCookies: PartnerAdminCookies, partnerId: number) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.put<boolean>(environment.apiEndpoint + "api/partner/admin_cookies", partnerAdminCookies, { params }).toPromise();
  }
  public async updatePartnerAdminCommChannels(partnerAdminCommChannels: PartnerAdminCommChannels, partnerId: number) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    return this.http.put<boolean>(environment.apiEndpoint + "api/partner/admin_commchannels", partnerAdminCommChannels, { params }).toPromise();
  }

  public async getDashboardInfo() {
    return this.http.get<DashboardInfo>(environment.apiEndpoint + "api/partner/dashboard-info").toPromise();
  }

  public async getUserCountByPartners() {
    return this.http.get<PartnerUserCount[]>(environment.apiEndpoint + "api/partner/user-count").toPromise();
  }

}
