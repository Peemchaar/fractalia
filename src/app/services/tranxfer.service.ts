import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from './message.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TranxferService {

  public serviceId: number;
  public serviceName: string;
  public serviceCode: string;
  public serviceIcon: string;
  public serviceDesc: string;
  public longDesc: string;
  
  constructor(private http: HttpClient,
    private messageService: MessageService,
    private translate: TranslateService) { }

  
  public async GetUserStatusTranxfer(id: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('userid', id.toString());
    return this.http.get<any>(environment.apiEndpoint + "api/tranxfer/user", { params }).toPromise().then(result => { 
     
      return result;
    //  this.editPartner = result; 
    });
  }

  public async ActivateUserTranxfer(id: number, sname: string, ssurname: string, semail: string, slanguage: string): Promise<any> {
    let params = new HttpParams();
    params = params.set('id', id.toString());
    return this.http.post<any>(environment.apiEndpoint + "api/tranxfer/user", { userid: id, name: sname, surname: ssurname, email: semail, language: slanguage  }).toPromise().then(result => { 
     
      return result;
    //  this.editPartner = result; 
    });
  }
  


}
