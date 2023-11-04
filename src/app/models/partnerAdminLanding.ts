import { AdminLanguage } from "./adminLanguage";
import { AdminSuite } from "./adminSuite";

export class PartnerAdminLanding {
    banner: string;
    imageBanner: File;
    show: number;
    title: string;
    subtitle: string;
    description: string;
    serviceTitle: string;
    serviceTitleDescription: string;
    includeFooter: boolean;
    footerHtml: string;
    languageSelected: number;
    languages: AdminLanguage[];
    suitesToShow: AdminSuite[];
}
