import { AdminLanguage } from "./adminLanguage";
import { AdminSuite } from "./adminSuite";

export class PartnerAdminChat {
    html: string;
    javascript: string;
    webPathFileChatCss: string;
    chatId: string;
    welcome: string;

    languageSelected: number;
    languages: AdminLanguage[];
    suiteSelected: number;
    suites: AdminSuite[];
}
