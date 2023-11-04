import { AdminService } from "./adminService";
import { AdminSuite } from "./adminSuite";

export class PartnerAdminServices {
    services: AdminService[];
    suiteSelected: number;
    suites: AdminSuite[];
    nameSuiteSelected: string;
    hasSKUs: boolean;
}
