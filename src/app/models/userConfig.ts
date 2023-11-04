import { ServiceTypeConfig } from './serviceTypeConfig';

export class UserConfig {
  userConfigId: number;
  name: string;
  surname: string;
  surname2: string;
  email: string;
  profileImage: string;
  isAdminUserId: boolean;
  isActive: boolean;
  isBITActive: boolean;
  isBAKActive: boolean;
  isCITActive: boolean;
  isCIIActive: boolean;
  showBITService: boolean;
  showBAKService: boolean;
  showCITService: boolean;
  showCIIService: boolean;
  servicesTypeConfig : ServiceTypeConfig[]
}
