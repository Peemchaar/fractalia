import { ServiceTypeConfig } from './serviceTypeConfig';

export class UserNotificationConfig {
  userId: number;
  isUserAdmin: boolean;

  receiveChildAlerts: boolean;
  sendChildEmailAlerts: boolean;
  sendChildEmailNewsletter: boolean;

  receiveEmailAlerts: boolean;
  receiveNewsletter: boolean;

  showReceiveEmailAlerts: boolean;
  showReceiveNewsletter: boolean;
  showUserPost:boolean;

  activeNewsletter: boolean;
}
