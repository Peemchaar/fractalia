import { Subscription } from './subscription';

export class BitDefenderMspResponse {
  enrolUrl:any;
  state: string;
  subscriberId:string;
  subscriptions: Subscription[];
  devices:any[];
  isSSO:number;
  message:string;
}
