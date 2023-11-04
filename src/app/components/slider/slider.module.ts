import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider.component';
import { SlideDirective } from './shared/slide.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SliderComponent, SlideDirective],
  exports:[SliderComponent, SlideDirective],
  entryComponents:[SliderComponent]
})
export class SliderModule { }
