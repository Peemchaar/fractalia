import { AdminHiredServices } from './adminHiredService';
import { UserConfig } from './userConfig';

export class FamilyUser {
    isAdminUserId: boolean;
    usersConfig: UserConfig[];
    adminHiredServices: AdminHiredServices[];
    maxLicense: number;
    totalUsers: number;
    activeUsers: number;
    usersNotActivated: number;
    pendingUsers: number;
    isCustomizable: boolean;
}