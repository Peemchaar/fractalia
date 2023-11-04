import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseinternetComponent } from './licenseinternet.component';

describe('LicenseinternetComponent', () => {
  let component: LicenseinternetComponent;
  let fixture: ComponentFixture<LicenseinternetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenseinternetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseinternetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
