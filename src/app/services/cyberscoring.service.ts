import { Injectable } from '@angular/core';
import { environment } from '../../../src/environments/environment'
import { HttpClient } from '@angular/common/http';
import { CyberscoringRequest } from '../models/cyberscoring/cyberscoringRequest';
import { CyberscoringCompanyInfo } from '../models/cyberscoring/cyberscoringCompanyInfo';

@Injectable({
  providedIn: 'root'
})
export class CyberscoringService {

  public serviceId: number;
  public serviceName: string;
  public serviceIcon: string;
  public serviceDesc: string;
  public longDesc: string;

  constructor(private http: HttpClient) { }

  public async getSectors(): Promise<any> {
    return this.http.get<any>(environment.apiEndpoint + "api/cyberscoring/sector").toPromise();
  }

  public async getCompany(): Promise<CyberscoringCompanyInfo> {
    return this.http.get<CyberscoringCompanyInfo>(environment.apiEndpoint + "api/cyberscoring").toPromise();
  }

  public async createCompany(body: CyberscoringRequest) {
    return this.http.post(environment.apiEndpoint + "api/cyberscoring", body, {observe: 'response'} );
  }
}
