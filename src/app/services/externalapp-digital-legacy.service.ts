import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { ExternalDigitalLegacyRequest } from '../models/externalDigitalLegacyRequest';
import { MessageService } from './message.service';
import { UserService } from './user.service';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class ExternalappDigitalLegacyService {
  
  public serviceId: number;
  public serviceName: string;
  public serviceIcon: string;
  public serviceDesc: string;
  public serviceType: string;
  public longDesc: string;

  constructor(private http: HttpClient, 
    public messageService: MessageService,
    public translate: TranslateService,
    public userService: UserService,
    private localService: LocalService) { }

  public async postDigitalLegacy(request: ExternalDigitalLegacyRequest)
  {
    return this.http.post<number>(environment.apiEndpoint + "api/externaldigitallegacy",request).toPromise().then(
      result => {        
      if(result == 0){
        this.messageService.add(this.translate.instant('EXTERNAL_APPS.ERROR'), "error");
      } else if (result == -1)
      {
        this.messageService.add(this.translate.instant('EMAIL_INCORRECTO'), "error")
      }
      else{
        switch (this.serviceType){
          case "ELD": this.userService.currentUserValue.hasExtDigitalLegacyRequested = true; break;          
          case "EVD" : this.userService.currentUserValue.hasExtDigitalLifeRequested = true; break;  
          case "ETD": default: this.userService.currentUserValue.hasExtDigitalTestamentRequested = true; break;    
        }    
        this.setLocalStorage('currentUser', this.userService.currentUserValue);
        this.messageService.add(this.translate.instant('EXTERNAL_APPS.OK'), "ok")
      }
    });
  }

  setLocalStorage(key, data) {
    this.localService.setJsonValue(key, data);
  }
}
