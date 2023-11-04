import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LanguageService } from './language.service';
import { environment } from 'src/environments/environment';
import { Suite } from '../models/suite';

@Injectable({
  providedIn: 'root'
})
export class SuiteService {

  public suites: Suite[];

  constructor(private http: HttpClient, 
     private languageService: LanguageService) { 
  }

  public async getUserSuites()
  {
    if(this.suites != undefined)
      return;

    let params = new HttpParams();
    params = params.set('lan', this.languageService.lan);
    
    //return this.http.get<Suite[]>(environment.apiEndpoint + "api/suite/user", {params}).toPromise().then(result => {this.suites = result;});
    return this.http.get<Suite[]>(environment.apiEndpoint + "api/suite/user_suite", {params}).toPromise().then(result => {this.suites = result;});
  }
}
