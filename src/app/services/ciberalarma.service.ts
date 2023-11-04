import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CiberalarmaDevice } from '../models/ciberalarmaDevice';
import { CiberalarmaNavigationConfig } from '../models/ciberalarmaNavigationConfig';
import { CiberalarmaNavigationStats } from '../models/ciberalarmaNavigationStats';

@Injectable({
  providedIn: 'root'
})
export class CiberalarmaService {

  public serviceId: number;
  public serviceName: string;
  public serviceCode: string;
  public serviceIcon: string;
  public serviceDesc: string;
  public longDesc: string;
  public hasUserCiberalarma: boolean = false;
  public devices: CiberalarmaDevice[] = [];
  public navDevices: CiberalarmaDevice[] = [];
  public geoDevices: CiberalarmaDevice[] = [];
  public ciberalarmaNavigationConfig: CiberalarmaNavigationConfig = new CiberalarmaNavigationConfig();
  public ciberalarmaNavigationStats: CiberalarmaNavigationStats = new CiberalarmaNavigationStats();
  public navMaxLicenses: number = 0;
  public geoMaxLicenses: number = 0;
  
  constructor(private http: HttpClient) { }

  public async AccessCiberalarma() {
    return this.http.get<string>(environment.apiEndpoint + "api/ciberalarma/sso").toPromise().then(result => {
      return result;
    });
  }

  public async GetDevices() {
    return this.http.get<CiberalarmaDevice[]>(environment.apiEndpoint + "api/ciberalarma/devices").toPromise().then(result => {
      this.devices = result;
      this.hasUserCiberalarma = true;

      this.navDevices = [];
      this.geoDevices = [];
      result.forEach(device => {
        if(device.navegationServiceLicence)
          this.navDevices.push(device);
        if(device.geoServiceLicence)
          this.geoDevices.push(device);
      });
      
      return result;
    })
    .catch(function(err){
      // recover here if err is 404
      if(err.status === 404)
      {
        
        return null; //returning recovery
      }
    }); 
  }

  public async GetMaxNavLicenses() {
    return this.http.get<number>(environment.apiEndpoint + "api/ciberalarma/max_nav_licenses").toPromise().then(result => {
      this.navMaxLicenses = result;
      return result;
    });
  }
  public async GetMaxGeoLicenses() {
    return this.http.get<number>(environment.apiEndpoint + "api/ciberalarma/max_geo_licenses").toPromise().then(result => {
      this.geoMaxLicenses = result;
      return result;
    });
  }

  public async GetNavigationConfig() {
    return this.http.get<CiberalarmaNavigationConfig>(environment.apiEndpoint + "api/ciberalarma/nav_config").toPromise().then(result => {
      this.ciberalarmaNavigationConfig = result;
      return result;
    });
  }

  public async GetNavigationStats() {
    return this.http.get<CiberalarmaNavigationStats>(environment.apiEndpoint + "api/ciberalarma/nav_stats").toPromise().then(result => {
      this.ciberalarmaNavigationStats = result;
      return result;
    });
  }

  public async UpdateNavigationConfig()
  {
    return this.http.post<boolean>(environment.apiEndpoint + "api/ciberalarma/nav_config", this.ciberalarmaNavigationConfig).toPromise();
  }

  public async NewNavigationDevice(ciberalarmaNewNavigation:CiberalarmaDevice)
  {
    return this.http.post<boolean>(environment.apiEndpoint + "api/ciberalarma/nav_device", ciberalarmaNewNavigation).toPromise();
  }

  public async DeleteNavigationDevice(deviceId:number)
  {
    return this.http.delete<boolean>(environment.apiEndpoint + "api/ciberalarma/nav_device?deviceId=" + deviceId).toPromise();
  }

  public async NewGeolocationDevice(ciberalarmaNewNavigation:CiberalarmaDevice)
  {
    return this.http.post<boolean>(environment.apiEndpoint + "api/ciberalarma/geo_device", ciberalarmaNewNavigation).toPromise();
  }

  public async DeleteGeolocationDevice(deviceId:number)
  {
    return this.http.delete<boolean>(environment.apiEndpoint + "api/ciberalarma/geo_device?deviceId=" + deviceId).toPromise();
  }

  public async CreateUsers() {
    return this.http.get<boolean>(environment.apiEndpoint + "api/ciberalarma/create_users").toPromise().then(result => {
      if(result)
      return result;
    });
  }

}
