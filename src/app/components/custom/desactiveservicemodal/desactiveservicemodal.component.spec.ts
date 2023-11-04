import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesactiveservicemodalComponent } from './desactiveservicemodal.component';

describe('DesactiveservicemodalComponent', () => {
  let component: DesactiveservicemodalComponent;
  let fixture: ComponentFixture<DesactiveservicemodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesactiveservicemodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesactiveservicemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
