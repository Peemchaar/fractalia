import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams, HttpClient } from '@angular/common/http';
import { DigitalLife } from '../models/digitalLife';
import { Certificate } from '../models/certificate';
import { Internet } from '../models/internet';
import { ExpertsConnection } from '../models/expertsConnection';
import { Callmeback } from '../models/callmeback';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  
  public serviceId: number;
  public serviceName: string;
  public serviceIcon: string;
  public serviceDesc: string;
  public longDesc: string;
  public formCallmeback: Callmeback;
  
  constructor(private http: HttpClient) { }

  public async getFormFields(serviceId : number)
  {
    let params = new HttpParams();

    params = params.set('serviceId', serviceId.toString());

    return this.http.get<FormData[]>(environment.apiEndpoint + "api/formfield", {params}).toPromise();
  }

  public async postDigitalLife(data: DigitalLife)
  {
    return this.http.post(environment.apiEndpoint + "api/life", data).toPromise();
  }

  public async postCertificate(data: Certificate)
  {
    return this.http.post(environment.apiEndpoint + "api/certificate", data).toPromise();
  }

  public async postInternet(data: Internet)
  {
    return this.http.post(environment.apiEndpoint + "api/presencia", data).toPromise();
  }

    public async postExpertsConnection(data: ExpertsConnection)
  {
    return this.http.post(environment.apiEndpoint + "api/expertsconnection", data).toPromise();
  }
  
  public async postCallmeback(data: Callmeback)
  {
    return this.http.post(environment.apiEndpoint + "api/callmeback", data).toPromise();
  }
}
