import { AdminLanguage } from "./adminLanguage";
import { Generic } from "./generic";

class partnerSuite{
    code: string
    creation: string
    desc: string
    icon: string
    id: number
    name: string
    textManager: string
    textUser: string
    emailText: string
}

export class PartnerAdminMailing {
    emailServers: Generic[];
    emailServerSelected: number;
    emailSenderFromName: string;
    sendFromHour: string;
    projectName: string;
    welcomeEmail: boolean;
    welcomeGeneralEnable: boolean;
    welcomeCustomEnable: boolean;
    welcomeCustomBody: string;
    headerImage: string;
    separatorImage: string;
    footerImage: string;
    colorH1Email: string;
    colorUnderlinedEmail: string;
    colorPasswordEmail: string;
    colorButtonEmail: string;
    customWelcomeEnable: boolean;
    customWelcomeSubject: string;
    customWelcomeHtml: string;
    preactivationEnable: boolean;
    preactivationSubject: string;
    preactivationHtml: string;
    preregistrationEnable: boolean;
    preregistrationSubject: string;
    preregistrationHtml: string;
    rememberOneEnable: boolean;
    rememberOneSubject: string;
    rememberOneDays: number;
    rememberOneHtml: string;
    rememberTwoEnable: boolean;
    rememberTwoSubject: string;
    rememberTwoDays: number;
    rememberTwoHtml: string;
    rememberThreeEnable: boolean;
    rememberThreeSubject: string;
    rememberThreeDays: number;
    rememberThreeHtml: string;
    deletionEnable: boolean;
    deletionSubject: string;
    deletionHtml: string;
    subdomain: string;
    languageSelected: number;
    languages: AdminLanguage[];
    partnerSuites:partnerSuite[];
    imageHeader:File;
    imageFoot:File;
    imageSeparator:File;
    customWelcomeHtmlFile: File;
    preactivationHtmlFile: File;
    preregistrationHtmlFile: File;
    rememberOneHtmlFile: File;
    rememberTwoHtmlFile: File;
    rememberThreeHtmlFile: File;
    deletionHtmlFile: File;
}
