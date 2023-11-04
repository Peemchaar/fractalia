import { AdminCountry } from "./adminCountry";
import { AdminLanguage } from "./adminLanguage";

export class PartnerAdminLanguages {
    id: number;
    languages: AdminLanguage[];
    countries: AdminCountry[];
    languageSelected: number;
    isLanguageDefault: boolean;
    terms: string;
}
