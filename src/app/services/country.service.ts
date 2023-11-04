import { Injectable } from '@angular/core';
import { Generic } from '../models/generic';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  public countries: Generic[];

  constructor(private http: HttpClient) { }

  public async loadCountries(partnerId: number = 0): Promise<any>
  {
    let params = new HttpParams();

    if(partnerId > 0)
      params = params.set('partnerId', partnerId.toString());

    return this.http.get<any>(environment.apiEndpoint + "api/country", {params}).toPromise().then(result => {this.countries = result;});
  }

  public async getCountries(partnerId: number = 0): Promise<Generic[]>
  {
    let params = new HttpParams();

    if(partnerId > 0)
      params = params.set('partnerId', partnerId.toString());

    return this.http.get<Generic[]>(environment.apiEndpoint + "api/country", {params}).toPromise();
  }
  
  public async createCountry(country: Generic)
  {
    return this.http.post(environment.apiEndpoint + "api/country", country).toPromise();
  }

  public async updateCountry(country: Generic)
  {
    return this.http.put(environment.apiEndpoint + "api/country", country).toPromise();
  }

  public async GetExistCountryCode(country: Generic)
  {
    return this.http.post<boolean>(environment.apiEndpoint + "api/country/existscode", country).toPromise();
  }

  public async GetExistCountryName(country: Generic)
  {
    return this.http.post<boolean>(environment.apiEndpoint + "api/country/existsname", country).toPromise();
  }
}
