import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { ChatData } from '../models/chatData';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public serviceId: number;
  public serviceName: string;
  public serviceIcon: string;
  public serviceDesc: string;    
  public longDesc: string;  
  public partnerSuiteId: string;
  
  constructor(private http: HttpClient) { }

    public getChatData(): Observable<ChatData>
    {
      return this.http.get<ChatData>(environment.apiEndpoint + "api/chatdata?serviceId=" + this.serviceId);
    }
  }

