import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Service } from '../models/service';
import { UserService } from './user.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Generic } from '../models/generic';
import { LanguageService } from './language.service';
import { environment } from 'src/environments/environment';
import { MessageService } from './message.service';
import { User } from '../models/user';
import { PartnerServiceLan } from '../models/partnerServiceLan';
import { PartnerServiceConfig } from '../models/partnerServiceConfig';
import { TagLan } from '../models/tagLan';
import { LocalService } from './local.service';
import { DigitalContact } from '../models/digitalContact';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private currentServicesSubject: BehaviorSubject<Service[]>;
  public currentServices: Observable<Service[]>;
  public suiteId: number;
  public services: Service[];
  public userServices: Service[];
  public userCategories: Generic[];
  public userTags: TagLan[] = [];
  public user: User;
  public selCategory = 0;

  constructor(private http: HttpClient,
    private userService: UserService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private translate: TranslateService,
    private localService: LocalService) {
    this.currentServicesSubject = new BehaviorSubject<Service[]>(null);
    this.currentServices = this.currentServicesSubject.asObservable();
  }

  public get currentServicesValue(): Service[] {
    return this.currentServicesSubject.value;
  }

  public async getUserServices() {
    this.user = this.getLocalStorage('currentUser');
    let params = new HttpParams();
    params = params.set('suiteId', this.userService.selSuiteId?.toString() ?? localStorage.getItem('partnerSuiteId'));
    params = params.set('partnerId', this.user.partnerId.toString());
    params = params.set('lan', this.languageService.lan);
    return this.http.get<Service[]>(environment.apiEndpoint + "api/user/services", { params }).toPromise().then(result => {
      this.userServices = result;
      result.forEach(element => {
        if(element.tags)
        {
          element.tags.forEach(tag=> {
            if(!this.userTags.find(x=>x.tagId==tag.tagId))
              this.userTags.push(tag);
          });
        }
      });
    })
  }

  public async getUserServicesMenu() {
    this.user = this.getLocalStorage('currentUser');
    let params = new HttpParams();
    params = params.set('suiteId', this.userService.selSuiteId?.toString() ?? localStorage.getItem('partnerSuiteId'));
    params = params.set('partnerId', this.user.partnerId.toString());
    params = params.set('lan', this.languageService.lan);
    return this.http.get<[]>(environment.apiEndpoint + "api/menu/menuservices", { params }).toPromise().then(result => {
      
    })
  }

  public async getUserServicesDashboard() {
    this.user = this.getLocalStorage('currentUser');
    let params = new HttpParams();
    params = params.set('suiteId', this.userService.selSuiteId?.toString() ?? localStorage.getItem('partnerSuiteId'));
    params = params.set('partnerId', this.user.partnerId.toString());
    params = params.set('lan', this.languageService.lan);
    return this.http.get<[]>(environment.apiEndpoint + "api/menu/dashboardservices", { params }).toPromise().then(result => {
     
    })
  }

  public async getUserCategories() {
    this.user = this.getLocalStorage('currentUser');
    let params = new HttpParams();
    params = params.set('suiteId', this.userService.selSuiteId.toString());
    params = params.set('partnerId', this.user.partnerId.toString());
    params = params.set('lan', this.languageService.lan);
    return this.http.get<Generic[]>(environment.apiEndpoint + "api/service/user/category", { params }).toPromise().then(result => { this.userCategories = result; });
  }

  //ADMIN

  public async loadServices() {
    return this.http.get<any>(environment.apiEndpoint + "api/service").toPromise().then(result => { this.services = result });
  }

  public async updatePartnerServiceLan(serviceId: Number, partnerId: Number, languageId: Number, serviceLan: PartnerServiceLan) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    params = params.set('serviceId', serviceId.toString());
    params = params.set('languageId', languageId.toString());
    return this.http.put(environment.apiEndpoint + "api/service/partner_lan", serviceLan, { params }).toPromise().then(result => { this.messageService.add(this.translate.instant('COMP_ADMIN_SERVICE.MESSAGE.UPD'), "ok") }, err => { this.messageService.add(this.translate.instant('COMP_ADMIN_SERVICE.MESSAGE.ERR'), "error") });
  }

  public async updatePartnerServiceConfig(serviceId: Number, partnerId: Number, serviceConfig: PartnerServiceConfig) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    params = params.set('serviceId', serviceId.toString());
    return this.http.put(environment.apiEndpoint + "api/service/partner_config", serviceConfig, { params }).toPromise().then(result => { this.messageService.add(this.translate.instant('COMP_ADMIN_SERVICE.MESSAGE.UPD'), "ok") }, err => { this.messageService.add(this.translate.instant('COMP_ADMIN_SERVICE.MESSAGE.ERR'), "error") });
  }

  public async getPartnerServiceLan(serviceId: Number, partnerId: Number, languageId: Number) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    params = params.set('serviceId', serviceId.toString());
    params = params.set('languageId', languageId.toString());
    return this.http.get(environment.apiEndpoint + "api/service/partner_lan", { params }).toPromise();
  }

  public async getPartnerServiceConfig(serviceId: Number, partnerId: Number) {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());
    params = params.set('serviceId', serviceId.toString());
    return this.http.get(environment.apiEndpoint + "api/service/partner_config", { params }).toPromise();
  }

  public async createService(service: Service) {
    return this.http.post(environment.apiEndpoint + "api/service", service).toPromise().then(result => { this.messageService.add(this.translate.instant('COMP_ADMIN_SERVICE.MESSAGE.CREATE'), "ok") }, err => { this.messageService.add(this.translate.instant('COMP_ADMIN_SERVICE.MESSAGE.ERR'), "error") });
  }

  public async getAnySuite(service: Service) {
    return this.http.post<boolean>(environment.apiEndpoint + "api/service/getanysuite", service).toPromise();
  }

  public async getExistsCode(service: Service) {
    return this.http.post<boolean>(environment.apiEndpoint + "api/service/getexistscode", service).toPromise();
  }

  public async deleteService(serviceId: number) {
    let params = new HttpParams();
    params = params.set('serviceId', serviceId.toString());
    return this.http.delete(environment.apiEndpoint + "api/service/delete", { params }).toPromise();
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);
  }

  public async postContactForm(data: DigitalContact){
    return this.http.post(environment.apiEndpoint + "api/formkitdigital", data).toPromise();
  }
}
