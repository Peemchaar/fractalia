import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Download } from '../models/donwload';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  download: Download;
  public serviceId: number;
  public serviceName: string;
  public serviceIcon: string;
  public serviceDesc: string;  
  public longDesc: string;

  constructor(private http: HttpClient) { }

  public async getDownload(languageId:number)
  {
    let params = new HttpParams();

    params = params.set('serviceId', this.serviceId.toString());
    params = params.set('languageId', languageId.toString());

    return this.http.get<Download>(environment.apiEndpoint + "api/download", {params}).toPromise().then(result => {
      this.download = result;
      this.download.macUrl = environment.apiEndpoint + this.download.macUrl;
      this.download.windowsUrl = environment.apiEndpoint + this.download.windowsUrl;
    });
  }

}
