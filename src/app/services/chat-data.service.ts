import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserService } from './user.service';
import { PartnerService } from './partner.service';
import { ChatData } from '../models/chatData';
import { environment } from '../../environments/environment'
import { LanguageService } from './language.service';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class ChatDataService {

  public html: string;
  public javascript: string;
  public primaryColor: string;
  public url: string;
  public showChat: boolean ;
  public chatExists: boolean ;

  constructor(private http: HttpClient,
    private userService: UserService,
    private partnerService: PartnerService,
    private languageService: LanguageService,
    private chatService: ChatService) { }

  async loadChat(serviceId:number, servicename:string)
  {
    this.url = undefined;
    this.chatExists = true;
    this.showChat = false;
    // this.languageService.lan
    let params = new HttpParams();
    params =  params.set('partnerId', this.partnerService.partner.id.toString());
    params =  params.set('languageId',this.partnerService.partner.languageId.toString());
    if(this.userService.selSuiteId)
      params =  params.set('partnerSuiteId',this.userService.selSuiteId.toString());
    else{
      params =  params.set('partnerSuiteId', localStorage.getItem('partnerSuiteId'));
    }
    var license = "";
    if(this.partnerService.partner.loginType == 1 || this.partnerService.partner.loginType == 4 || this.partnerService.partner.loginType == 6)
      license = this.userService.currentUserValue.email;
    else
      license = this.userService.currentUserValue.eid;

    params =  params.set('serviceId', serviceId.toString());

    // console.log(this.userService.currentUserValue.lastAccessDate);
    var date = new Date(this.userService.currentUserValue.lastAccessDate);
    var timeString = date.getUTCFullYear()+"-"
      +("0" + (date.getUTCMonth()+1)).slice(-2)+"-"
      +("0" + date.getUTCDate()).slice(-2)+" "
      +("0" + date.getUTCHours()).slice(-2)+":"
      +("0" + date.getUTCMinutes()).slice(-2)+":"
      +("0" + date.getUTCSeconds()).slice(-2);
    var token = this.userService.currentUserValue.id.toString() + timeString;
    var sha1 = require('sha1');

    this.http.get<ChatData>(environment.apiEndpoint + "api/chatdata", {params}).subscribe(result =>
      {
        if(result.html){
          this.html = result.html;
          this.javascript = result.javascript;
          this.primaryColor = this.partnerService.partner.name;
          if(result.html.startsWith("https://startchat.onlineassist.me"))
          {
            this.url = result.html + "?scriptHermes=" + result.javascript
            + "&lang=" + this.languageService.lan
            + "&primaryColor=" + this.partnerService.partner.color.replace('#','')
            + "&licencia=" + encodeURIComponent(license) + "-" + this.partnerService.partner.code
            + "&partner=" + encodeURIComponent(this.partnerService.partner.name).toLowerCase()
            + "&servicio=" + encodeURIComponent(servicename);
            if(result.skills && result.skills.length>0){
              this.url = this.url + result.skills;
            }
          }
          else if(result.html.startsWith("https://as.activecall.pe"))
          {
            // Chat sólo para UBAE por eso ponemos el dominio fijo
            this.url = result.html
            + "?dominio='ultrabandaancha.app.onlineassist.me'"
            + "&contactid=" + this.userService.currentUserValue.eid
          }
          else
          {
            this.url = result.html
            + "?token=" + sha1(token)
            + "&partnersuite=" + localStorage.getItem('partnerSuiteId')
            + "&user=" + this.userService.currentUserValue.id
            + "&lang=" + this.partnerService.partner.languageId
            + "&servicio=" + this.chatService.serviceName
          }
          this.showChat = true;
          this.chatExists = true;
        }
        else{
          this.url =""
          this.showChat = true;
          this.chatExists = false;
        }
      });
  }
}
