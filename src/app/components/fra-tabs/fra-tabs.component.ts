import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { FraTabComponent } from './fra-tab/fra-tab.component';
import { FrabTabTemplate } from './shared/tab-templates';

@Component({
  selector: 'app-fra-tabs',
  templateUrl: './fra-tabs.component.html',
  styleUrls: ['./fra-tabs.component.scss']
})
export class FraTabsComponent implements AfterContentInit {
  @Input() tabTemplate = FrabTabTemplate.NotificationTemplate;
  @ContentChildren(FraTabComponent) tabs!: QueryList<FraTabComponent>;
  @Output() onTabChange = new EventEmitter();
  @Output() onDeleteAll = new EventEmitter();
  serviceTemplate = FrabTabTemplate.ServiceTemplate;
  notificationTemplate = FrabTabTemplate.NotificationTemplate;

  showDeleteAllNotification = false;
  ngAfterContentInit() {
    const activeTabs = this.tabs.filter((tab) => tab.active);

    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: FraTabComponent) {

    this.tabs.toArray().forEach((tab) => (tab.active = false));
    this.showDeleteAllNotification = tab.showDeleteAllButton;
    this.onTabChange.emit(tab);
    tab.active = true;
  }


  onDeleteAllNotification() {
    let activeTab = this.tabs.find((tab) => tab.active);
    if(!activeTab) activeTab = this.tabs.first;
    this.onDeleteAll.emit(activeTab)
  }



}
