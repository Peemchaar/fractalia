import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { Icon } from '../models/icon';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  public icons: Icon[];

  constructor(private http: HttpClient,
    private messageService: MessageService) { }

  public async loadIcons(reload: boolean = false): Promise<any>
  {
    if(!reload && this.icons != undefined)
      return;

    return this.http.get<any>(environment.apiEndpoint + "api/icon").toPromise().then(result => {this.icons = result;});
  }

  public async createIcon(icon: Icon)
  {
    return this.http.post(environment.apiEndpoint + "api/icon", icon).toPromise();
  }

  public async updateIcon(icon: Icon)
  {
    return this.http.put(environment.apiEndpoint + "api/icon", icon).toPromise();
  }

  public async GetExistsIconByValue(icon: Icon)
  {
    return this.http.post<boolean>(environment.apiEndpoint + "api/icon/existsvalue", icon).toPromise();
  }
}
