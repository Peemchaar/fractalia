import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FraTabComponent } from './fra-tab/fra-tab.component';
import { FraTabsComponent } from './fra-tabs.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  declarations: [
    FraTabsComponent,
    FraTabComponent
  ],
  exports: [
    FraTabsComponent,
    FraTabComponent
  ],
})
export class FraTabsModule { }
