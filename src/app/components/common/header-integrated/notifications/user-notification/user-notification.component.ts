import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.scss']
})
export class UserNotificationComponent implements OnInit {
  @Input() notifications: any[] = [];
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

}
