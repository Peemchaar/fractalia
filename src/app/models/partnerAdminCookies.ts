import { AdminLanguage } from "./adminLanguage";

export class PartnerAdminCookies {
    title:string;
    message:string;
    internalDisplayCookies:boolean;
    externalDisplayCookies:boolean;
    internalTextCookies:string;
    policyLinkCookies:string;
    internalDisplayPrivacy:boolean;
    internalTextPrivacy:string;
    externalDisplayPrivacy:boolean;
    policyLinkPrivacy:string;
    languageSelected: number;
    languages: AdminLanguage[];
}
