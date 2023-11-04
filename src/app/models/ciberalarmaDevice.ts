export class CiberalarmaDevice {
    deviceId: number = -1;
    code: string = "";
    name: string = "";
    so: string = "";
    email: string = "";
    installed: boolean;
    deleted: boolean;
    installedDate: Date;
    deletedDate: Date;
    applicationDate: Date;
    installedVersion: string;
    lastSeen: Date;
    navegationServiceLicence: boolean;
    geoServiceLicence: boolean;

}