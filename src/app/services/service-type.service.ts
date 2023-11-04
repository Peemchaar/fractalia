import { Injectable } from '@angular/core';
import { Generic } from '../models/generic';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeService {

  public types: Generic[];

  constructor(private http: HttpClient) { }

  public async loadServiceTypes(): Promise<any>
  {
    return this.http.get<any>(environment.apiEndpoint + "api/servicetype").toPromise().then(result => {this.types = result;});
  }
}
