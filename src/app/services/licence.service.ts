import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageService } from './message.service';
import { ServiceIcon } from '../models/serviceIcon';

@Injectable({
  providedIn: 'root'
})
export class LicenceService {

  public licenceSubject: BehaviorSubject<string>;
  public globalLicence: string = "";
  public serviceId: number;
  public serviceName: string;
  public serviceIcon: string;
  public serviceDesc: string;
  public longDesc: string;
  public services: ServiceIcon[];
  public code: string;
  constructor(private http: HttpClient,
    private messageService: MessageService,
    private translate: TranslateService) { }

  public get licence(): Observable<string> {
    return this.licenceSubject.asObservable();
  }

  public async getUserLicence(partnerSuiteId: number, serviceId: number, languageId: number, serviceTypeId: number) {
    let params = new HttpParams();
    params = params.set('partnerSuiteId', partnerSuiteId.toString());
    params = params.set('serviceId', serviceId.toString());
    params = params.set('languageId', languageId.toString());
    params = params.set('serviceTypeId', serviceTypeId.toString());
    return this.http.get<string>(environment.apiEndpoint + "api/licence", { params }).toPromise().then(result => {
      this.globalLicence = result;
      //this.licenceSubject.next(result);
    });
  }

  public async setUserLicence(partnerSuiteId: number, languageId: string, serviceId: string) {
    let params = new HttpParams();
    params = params.set('partnerSuiteId', partnerSuiteId.toString());
    params = params.set('languageId', languageId);
    params = params.set('serviceId', serviceId);
    return this.http.get<string>(environment.apiEndpoint + "api/licence/new", { params }).toPromise().then((result: any) => {
      this.globalLicence = result.value;
      if (result.value == "") {
        this.messageService.add(this.translate.instant('NOT_LICENSE'), "error")
      }
      else {
        this.services = result.services;
      }
    });
  }

  public async setUserLicenceIS(partnerSuiteId:number,languageId:string, serviceId:string)
  {
    let params = new HttpParams();
    params = params.set('partnerSuiteId', partnerSuiteId.toString());
    params = params.set('languageId', languageId);
    params = params.set('serviceId', serviceId);
    return this.http.get<string>(environment.apiEndpoint + "api/licence/new_internetsecurity",{params}).toPromise().then((result:any) => {
      this.globalLicence = result.value;
      if(result.value == ""){
        this.messageService.add(this.translate.instant('NOT_LICENSE'), "error")
      }
      else{
        this.services = result.services;
      }
    });
  }

  public async setUserLicencePR(partnerSuiteId: number, languageId: string, serviceId: string) {
    let params = new HttpParams();
    params = params.set('partnerSuiteId', partnerSuiteId.toString());
    params = params.set('languageId', languageId);
    params = params.set('serviceId', serviceId);
    return this.http.get<string>(environment.apiEndpoint + "api/licence/new_protection", { params }).toPromise().then((result: any) => {
      this.globalLicence = result.value;
      if (result.value == "") {
        this.messageService.add(this.translate.instant('NOT_LICENSE'), "error")
      }
      else {
        this.services = result.services;
      }
    });
  }
}
