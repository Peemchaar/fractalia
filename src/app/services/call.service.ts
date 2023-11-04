import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PartnerService } from 'src/app/services/partner.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CallService {
  public Token :string;
  constructor(private http: HttpClient,
    private partnerservice:PartnerService) { }


  public async getToken(){
    const code:string = this.partnerservice.partner.apiKey;
    let params = new HttpParams();
    // params = params.set("user", user);
    return this.http.post(environment.apiEndpoint + "api/call/GetToken?code=" + code, params , {responseType:'text'}).toPromise().then((res:string)=>{
      this.Token = res;
    });
  }

}
