import { NgModule } from '@angular/core';

import { DynamicRenderComponentService } from './dynamic-render-component.service';
import { RenderComponentDirective } from './render-component.directive';

@NgModule({
  imports: [],
  declarations: [RenderComponentDirective],
  exports: [RenderComponentDirective],
  providers: [DynamicRenderComponentService],
})
export class DynamicRenderComponentModule {}
