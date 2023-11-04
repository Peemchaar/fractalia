import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITab } from './shared/ITab';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  @Input() items: ITab[] = [];
  @Input() itemSelected: number;

  @Output() tabChanged = new EventEmitter();
  constructor() { }

  ngOnInit() {
    if(this.itemSelected) {
      this.updateActiveInTabs();
    }
  }

  updateActiveInTabs() {
    const index = this.items.findIndex(x => x.id === this.itemSelected);
    this.items.map(x => x.active = false);
    if(index >= 0) this.items[index].active = true;

  }

  onTabSelected(item: any) {
    this.items.map(x => x.active = false);
    item.active = true;
    this.tabChanged.emit(item);
  }

  ngOnChanges() {
     this.updateActiveInTabs()
  }

}
