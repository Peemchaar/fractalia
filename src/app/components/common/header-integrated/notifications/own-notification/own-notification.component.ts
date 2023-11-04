import { Component, Input, OnInit } from '@angular/core';
import { StringUtils } from 'src/app/utils/string-utils';


@Component({
  selector: 'app-own-notification',
  templateUrl: './own-notification.component.html',
  styleUrls: ['./own-notification.component.scss']
})
export class OwnNotificationComponent implements OnInit {
  @Input() notifications: any[] = [];
  isloading = false;
  constructor() {

  }

  ngOnInit() {
  }

  ngOnChanges() {
  }


  // formatNotification() {
  //   for (let index = 0; index < this.notifications.length; index++) {
  //     const element = this.notifications[index];
  //     element.dayFormatted = StringUtils.convertDateLatinFormat(element.notificationDate);
  //   }
  // }
}
