import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CbyFreemiumAlertComponent } from './cby-freemium-alert.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule
  ],
  declarations: [CbyFreemiumAlertComponent],
  exports:[CbyFreemiumAlertComponent],
  entryComponents:[CbyFreemiumAlertComponent]
})
export class CbyFreemiumAlertModule { }
