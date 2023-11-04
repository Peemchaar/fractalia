import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IdentityBreach } from '../models/identityBreach';
import { MonitoredIdentity } from '../models/monitoredIdentity';

@Injectable({
  providedIn: 'root'
})
export class MonitoredIdentitiesService {

  public serviceId: number;
  public serviceName: string;
  public serviceIcon: string;
  public serviceDesc: string;
  public longDesc: string;
  public identities: MonitoredIdentity[] = [];
  public maxIdentitiesByUser: number;
  public canAddIdentities: boolean
  protectedIdentities = 0;
  breachedIdentities = 0;

  constructor(private http: HttpClient) { }

  public async getMonitoredIdentitiesByUser()
  {
    return this.http.get<MonitoredIdentity[]>(environment.apiEndpoint + "api/monitoredidentities/").toPromise().then(result => {
      this.identities = result;
      this.protectedIdentities = this.identities.filter(x=>x.breaches === 0).length;
      this.breachedIdentities = this.identities.length - this.protectedIdentities;
    });
  }


  public addMonitoredIdentity(Identities:Array<MonitoredIdentity>): Promise<boolean>
  {
    return this.http.post<boolean>(environment.apiEndpoint + "api/monitoredidentities/", Identities).toPromise();
  }

  public addMonitoredIdentities(Identity:any[]): Promise<boolean>
  {
    return this.http.post<boolean>(environment.apiEndpoint + "api/monitoredidentities/", Identity).toPromise();
  }

  public deleteMonitoredIdentity(IdentityId:number): Promise<boolean>
  {
    return this.http.delete<boolean>(environment.apiEndpoint + "api/monitoredidentities?monitoredIdentityId=" + IdentityId).toPromise();
  }

  public getIdentityBreach(IdentityId:number)
  {
    return this.http.get<IdentityBreach[]>(environment.apiEndpoint + "api/monitoredidentities/getIdentityBreach?monitoredIdentityId=" + IdentityId).toPromise();
  }
}
