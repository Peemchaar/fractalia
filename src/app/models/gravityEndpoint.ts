
export class GravityEndpoint {
  id: string;
  name: string;
  label: string;
  fqdn: string;
  groupId: string;
  isManaged: Boolean;
  machineType: number;
  Deleted: Boolean;
  operatingSystemVersion: string;
  ip: string;
  macs: string[];
  ssid: string;
  managedWithBest: Boolean;

  revisedCleaned: number;
  revisedErased: number;
  revisedExcluded: number;
  revisedQuarantined: number;
  blockedWebs: number;
  blockedPhising: number;
  blockedMalware: number;

  lastAnalisys: Date;
}
