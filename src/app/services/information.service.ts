import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InformationService {  
  public serviceId: number;
  public serviceName: string;
  public serviceIcon: string;
  public serviceDesc: string;
  public longDesc: string;
  constructor() { }
}
