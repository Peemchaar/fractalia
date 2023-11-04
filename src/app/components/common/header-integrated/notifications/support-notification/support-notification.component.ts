import { Component, Input, OnInit } from '@angular/core';
import { UserNotificationGrouped } from 'src/app/models/userNotificationGrouped';
import { ImageUtils } from 'src/app/utils/ImageUtils';

@Component({
  selector: 'app-support-notification',
  templateUrl: './support-notification.component.html',
  styleUrls: ['./support-notification.component.scss']
})
export class SupportNotificationComponent implements OnInit {
  @Input() notifications: UserNotificationGrouped[] = [];
  isloading = false;
  constructor() {

  }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  downloadFile(item, index: number) {
    const urlFile = item.parseURLFiles[index];
    const fileName = item.parseFiles[index];
    ImageUtils.donwloadFileFromURL(urlFile, fileName);
  }

}
