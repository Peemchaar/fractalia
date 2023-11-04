import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ExternalLicenseService {

  public externalLicenseSubject: BehaviorSubject<string>;
  public externalLicenseCode: string = "";
  public serviceId: number;
  public serviceCode: string;
  public serviceName: string;
  public serviceIcon: string;
  public serviceDesc: string;  
  public longDesc: string;

  constructor(private http: HttpClient,
    private messageService: MessageService) { }

  public get externalLicense(): Observable<string> {
      return this.externalLicenseSubject.asObservable();
  }
  
  public async getUserExternalLicenseData(externalLicenseCode: string)
  {
    let params = new HttpParams();
    params = params.set('externallicensecode', externalLicenseCode);
    return this.http.get<JSON>(environment.apiEndpoint + "api/externallicenses", {params}).toPromise().then(result => {
      this.externalLicenseCode = result["data"] === null ? null : result["data"].license;
    });
  }
}