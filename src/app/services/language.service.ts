import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Language } from '../models/language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public lan = "es-ES";
  public languages: Language[];
  
  constructor(private translate: TranslateService,
    private http: HttpClient) { 
    var lang = navigator.language; 
    // var lang = "es";
    let langUser = localStorage.getItem('langUser');
    if(langUser)
      this.lan = langUser;
    else{
      this.lan = lang;
      localStorage.setItem('langUser',lang);
    }
  }

  setLanguage(code: string,reload: boolean=false)
  {
    // console.log("setLanguage: "+code+" - "+reload);
    localStorage.setItem('langUser',code);
    if(this.lan != code)
    {
      // console.log("Changing language to "+code+" - reload: "+reload);
      this.lan = code;
      this.translate.use(code);
      if(reload)
        window.location.reload(); 
    }
  }

  public async loadLanguages(partnerId: number = 0): Promise<any>
  {
    if(this.languages != undefined)
      return;

    let params = new HttpParams();

    if(partnerId > 0)
      params = params.set('partnerId', partnerId.toString());

    return this.http.get<any>(environment.apiEndpoint + "api/language", {params}).toPromise().then(result => {this.languages = result;});
  }

  public async getLanguages(partnerId: number): Promise<Language[]>
  {
    let params = new HttpParams();
    params = params.set('partnerId', partnerId.toString());

    return this.http.get<Language[]>(environment.apiEndpoint + "api/language", {params}).toPromise();
  }
}
