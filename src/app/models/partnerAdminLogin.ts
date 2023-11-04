import { AdminLanguage } from "./adminLanguage";

export class PartnerAdminLogin {
    loginType: number;
    login: string;
    imageLogin: File;
    // enforcePasswordComplexity:boolean;
    additionaltext: string;
    userPlaceholder: string;
    uniqueIdentifier: string;
    communicationsTitle: string;
    languageSelected: number;
    loginInstructionsShow: string;
    loginInstructionsTitle: string;
    loginInstructionsDescription: boolean;
    languages: AdminLanguage[];
}
