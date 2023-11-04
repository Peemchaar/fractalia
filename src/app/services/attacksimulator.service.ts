import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from './message.service';
import { environment } from 'src/environments/environment';
import { AttackSimulatorStats } from '../models/attackSimulatorStats';
import { Result } from '../models/result';

@Injectable({
  providedIn: 'root'
})
export class AttacksimulatorService {

  public serviceId: number;
  public serviceName: string;
  public serviceCode: string;
  public serviceIcon: string;
  public serviceDesc: string;
  public longDesc: string;
  public status = 0;
  public stats: AttackSimulatorStats = new AttackSimulatorStats();

  constructor(private http: HttpClient,
    private messageService: MessageService,
    private translate: TranslateService) { }

  public async GetAttackSimulatorStats() {
    return this.http.get<AttackSimulatorStats>(environment.apiEndpoint + "api/attacksimulator/stats").toPromise().then(result => {
      this.stats = result;
      
      if(this.stats.id != null)
        this.status = 1;

      // this.stats.received= 8;
      // this.stats.opened= 7;
      // this.stats.clicked= 3;
      // this.stats.affected= 1;
      // this.stats.score= 3;
    });
  }

  public async CreateAttackSimulatorEndUser() {
    return this.http.get<boolean>(environment.apiEndpoint + "api/attacksimulator/new_user").toPromise().then(result => {
      return result;
    });
  }

  public async CreateAttackSimulatorFamily() {
    return this.http.get<Result>(environment.apiEndpoint + "api/attacksimulator/family").toPromise().then(result => {
      return result;
    });
  }
}
