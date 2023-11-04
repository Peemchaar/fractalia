import { JiraProject } from "./jiraProject";

export class PartnerAdminDetails {
    id: number;
    name: string;
    subdomain: string;
    domain: string;
    customDomain:string;
    code: string;
    apiKey: string;
    tokenExpiration:number;
    hasFullProfile:boolean;
    hasSKUs:boolean;
}
