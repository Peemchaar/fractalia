export class DashboardUser {
  id: number;
  name: string;
  surname:string;
  profileImage:string;
  isActive:boolean;
  isAdmin:boolean;

  devices:any[];
  isMsp:boolean;

  spacedUsed: string = '-1';
  spaceAssigned: string = '-1';
  wksInstalled: string = '';
  mobInstalled: string = '';
  isAcronis:boolean;

  isFractel:boolean;

  cards:any[];
  identities:any[];
  acronis:any;
  acunetix:any;
  lstFractel:any[];

}
