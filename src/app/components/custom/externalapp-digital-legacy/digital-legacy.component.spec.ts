import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalLegacyComponent } from './digital-legacy.component';

describe('DigitalLegacyComponent', () => {
  let component: DigitalLegacyComponent;
  let fixture: ComponentFixture<DigitalLegacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalLegacyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalLegacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
