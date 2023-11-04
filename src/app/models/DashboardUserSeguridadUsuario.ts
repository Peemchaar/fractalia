export class DashboardUserSeguridadUsuario{

  name: string;
  surname:string;
  profileImage:string;
  isActive:boolean;
  isAdmin:boolean;

  spacedUsed: string = '-1';
  spaceAssigned: string = '-1';
  wksInstalled: string = '';
  mobInstalled: string = '';
  dangerAlertsDate:Date;
  koAlertsDate:Date;
  okAlertsDate:Date;
  dangerAlerts:number;
  koAlerts:number;
  isNotification:boolean;

  cardAlertHigh: number;
  lastAnalysisDateCard:Date;
  cardLength:number;

  identityAlertHigh:number;
  identitiesLength:number;
  lastAnalysisDateIdentity:Date;
}
