import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'nz-spinner',
  template: `
      <nz-spin nzSimple></nz-spin>
  `,
  styles: [
    `
    `
  ]
})
export class NzSpinnerComponent {
  constructor(
    private _elementRef: ElementRef
  ) { this._elementRef.nativeElement.removeAttribute("ng-version"); }
}