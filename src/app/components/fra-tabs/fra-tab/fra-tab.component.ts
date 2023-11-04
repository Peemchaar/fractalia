import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fra-tab',
  templateUrl: './fra-tab.component.html',
  styleUrls: ['./fra-tab.component.scss']
})
export class FraTabComponent  {

  @Input() label!: string;
  @Input() name!: string;
  @Input() icon!: string;
  @Input() title!: string;
  @Input() id!: number;
  @Input() active = false;
  @Input() notification = true;

  @Input() showNotificationAsNoReaded = false;
  @Input() showDeleteAllButton = false;
  @Input() backgroundColor!: string;

}
