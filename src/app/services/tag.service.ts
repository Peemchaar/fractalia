import { TagLan } from './../models/tagLan';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private http: HttpClient) { }

  public async loadServiceTag(id: Number, partnerId: Number): Promise<any> {
    let params = new HttpParams();
    params = params.set('serviceId', id.toString());
    params = params.set('partnerId', partnerId.toString());
    return this.http.get<TagLan[]>(environment.apiEndpoint + "api/tag", { params }).toPromise();
  }

  public async saveServiceTag(serviceId: Number, partnerId: Number, configServiceTags: TagLan[]): Promise<any> {
    let params = new HttpParams();
    params = params.set('serviceId', serviceId.toString());
    params = params.set('partnerId', partnerId.toString());
    return this.http.put<TagLan[]>(environment.apiEndpoint + "api/tag", configServiceTags, { params }).toPromise();
  }
}
