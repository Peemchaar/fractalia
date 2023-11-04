import { AdminSuite } from "./adminSuite";
import { LicencType } from "./licencType";

export class PartnerAdminThirdPartiesServices {

    showIdentitiesModule:boolean;
    showFraudCardsModule:boolean;
    showBitdefenderTSModule:boolean;
    showBitdefenderISModule:boolean;
    showBitdefenderPRModule:boolean;
    showBitdefenderMSPModule:boolean;
    showAcronisModule:boolean;
    showNavegationSecureModule:boolean;
    showGeolocationModule:boolean;
    showCiberalarmaModule:boolean;
    showCyberscoringModule:boolean;
    showAttackSimulatorModule:boolean;
    showGravityModule:boolean;
    showElearningModule:boolean;

    maxIdentitiesByAdminUser:number;
    maxIdentitiesByUser:number;
    maxCardsByAdminUser:number;
    maxCardsByUser:number;
    bitdefenderAdminUserTS:number;
    bitdefenderUserTS:number;
    bitdefenderAdminUserIS:number;
    bitdefenderUserIS:number;
    bitdefenderAdminUserPR:number;
    bitdefenderUserPR:number;
    pentestingDay: number;
    pentestingMaxUrl: number;
    licenceTypes: LicencType[];
    suiteSelected: number;
    suites: AdminSuite[];
    bitDefenderMSPOrganizations:any[];
    bitdefenderMspOrganization:string;
    bitdefenderMspISSO:number;
    adminBitdefenderMsp:any;
    userBitdefenderMsp:any;
    bitDefenderMspProducts:any[];

    acronisTenantId: string;
    acronisWks : number;
    acronisMbs: number;
    acronisAssignment: number;

    isCustomizable: boolean;
    disableBitDefenderMSPOrganizations:boolean;
    ciberalarmaProduct : number;
    navSeguraLicenses : number;
    geolocationLicenses : number;

    bmsGenerateNotification: boolean;
    bmsSendEmail: boolean;
    bmsCreateTicket: boolean;
    cacGenerateNotification: boolean;
    cacSendEmail: boolean;
    cacCreateTicket: boolean;

    cyberscoringMaxAnalysis: number;
    cyberscoringMaxDomains: number;
    cyberscoringMaxEmails: number;
    cyberscoringExpandedAnalysis: boolean;

    gravityPartnerId: string;
    gravityMaxEndpointsAdmin : number;
    gravityMaxEndpointsUser : number;

    elearningPartnerId: string;

    hasSKUs: boolean;
}
