import { ServiceTypeConfig } from './serviceTypeConfig';

export class UserNotification {
  notificationId: number;
  userId: number;
  userName: string;
  userProfileImage: string;
  attachedFiles?: string;
  attachedFilesNames?: string;
  links?: string;
  parseFiles?: any;
  parseURLFiles?: any;
  parseLinks?: string;
  serviceName: string;
  serviceIcon: string;
  categoryName: string;
  categoryIcon: string;
  notificationDate: Date;
  notificationDateFormatted?: string;
  description: string;
  type?: string;
  readed: boolean;
  criticity: number;
}
