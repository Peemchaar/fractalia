import { AdminLanguage } from "./adminLanguage";
import { AdminSuite } from "./adminSuite";
import { JiraProject } from "./jiraProject";

export class PartnerAdminSuites {
    suites: AdminSuite[];
    suiteName: string;
    suiteDesc: string;
    suiteIcon: string;
    suiteSelected: number;
    languageSelected: number;
    languages: AdminLanguage[];    
    jiraX3: string;
    jiraFoot: string;
    jiraPartners: JiraProject[];
    hasSKUs: boolean;
    isSuiteSku: boolean;
}
