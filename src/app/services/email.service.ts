import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Generic } from '../models/generic';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EmailService
{
  constructor(private http: HttpClient) {}

  public async loadEmailSender(): Promise<Generic[]>
  {
    return this.http.get<Generic[]>(environment.apiEndpoint + "api/Email").toPromise();
  }
  public sendEmail(email:string, partnerid:string): Promise<boolean>
  {
    let params = new HttpParams();
    params = params.append('email', encodeURIComponent(email));
    params = params.append('partnerid', partnerid);
    return this.http.get<boolean>(environment.apiEndpoint + "api/email/sentEmail", {params}).toPromise();
  }
  public sendEmailTest(email:string, partnerid:string): Promise<boolean>
  {
    let params = new HttpParams();
    params = params.append('email', encodeURIComponent(email));
    params = params.append('partnerid', partnerid);
    return this.http.get<boolean>(environment.apiEndpoint + "api/email/sentEmailTest", {params}).toPromise();
  }

  public validarEmail(email:string):boolean {
    if(email === null || email === undefined || email===""){
      return false;
    }
    if (email.length <= 2) {
        return false;
    }
    if (email.indexOf("@") == -1) {
        return false;
    }
    var parts = email.split("@");
    var dot = parts[1].indexOf(".");
    var dotSplits = parts[1].split(".");
    var dotCount = dotSplits.length - 1;
    if (dot == -1 || dot < 2 || dotCount > 2) {
        return false;
    }
    for (var i = 0; i < dotSplits.length; i++) {
        if (dotSplits[i].length == 0) {
            return false;
        }
    }
    return true;
  }
}

