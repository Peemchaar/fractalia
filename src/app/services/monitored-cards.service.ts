import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MonitoredCard } from '../models/monitoredCard';
import { StringUtils } from '../utils/string-utils';

@Injectable({
  providedIn: 'root'
})
export class MonitoredCardsService {

  public serviceId: number;
  public serviceName: string;
  public serviceIcon: string;
  public serviceDesc: string;
  public longDesc: string;
  public cards: MonitoredCard[] = [];
  public maxCardsByUser: number;
  public canAddCards: boolean
  protectedCards = 0;
  cardsWithFraud = 0;

  constructor(private http: HttpClient) {

  }

  public async getMonitoredCardsByUser()
  {
    // let params = new HttpParams();
    // params = params.set('partnerSuiteId', partnerSuiteId);
    return this.http.get<MonitoredCard[]>(environment.apiEndpoint + "api/monitoredcards/").toPromise().then(result => {
      this.cards = result;
      this.cards.forEach(element => {
        if(element.lastAnalysisDate == null || element.lastAnalysisDate == ''){
          element.lastAnalysisDate = StringUtils.getCurrentDate();
        }
      });
      this.protectedCards = this.cards.filter(x=>!x.fraudDetected).length;
      this.cardsWithFraud = this.cards.length - this.protectedCards;
    });
  }

  public addMonitoredCard(cards:Array<MonitoredCard>): Promise<boolean>
  {
    return this.http.post<boolean>(environment.apiEndpoint + "api/monitoredcards/", cards).toPromise();
  }

  public deleteMonitoredCard(cardId:number): Promise<boolean>
  {
    return this.http.delete<boolean>(environment.apiEndpoint + "api/monitoredcards?cardId=" + cardId).toPromise();
  }

}
