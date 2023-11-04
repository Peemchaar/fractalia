import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from './message.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Office365Service {

  public ticket: string = "";
  public activated: boolean = false;

  constructor(private http: HttpClient,
    private messageService: MessageService,
    private translate: TranslateService) { }

  public async GetUserOffice365Licence() {
    let params = new HttpParams();
    params = params.set('userId', '1');
    return this.http.get<string>(environment.apiEndpoint + "api/office365").toPromise().then(result => {
      this.ticket = result;
      if (this.ticket != "")
      this.activated = true;
    });
  }

  public async SetUserOffice365Licence(active?) {
    let params = new HttpParams();
    params = params.set('IsActivate', active);
    return this.http.get<string>(environment.apiEndpoint + "api/Office365/New", { params }).toPromise();
  }
}