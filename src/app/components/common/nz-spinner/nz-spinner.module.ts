import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { NzSpinnerComponent } from './nz-spinner';


@NgModule({
  imports: [
    CommonModule,
    NzSpinModule
  ],
  declarations: [
    NzSpinnerComponent
  ],
  exports: [
    NzSpinnerComponent,
  ],
})
export class NzSpinnerModule { }
