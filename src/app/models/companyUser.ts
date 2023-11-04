import { UserList } from './userlist';

export class CompanyUser {
    isAdminUserId: boolean;
    userList: UserList[];
    deleted: boolean;
    maxLicense: number;
    totalUsers: number;
    activeUsers: number;
    usersNotActivated: number;
    pendingUsers: number;
}