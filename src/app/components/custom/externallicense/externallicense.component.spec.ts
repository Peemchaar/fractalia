import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLicenseComponent } from './externallicense.component';

describe('ExternalLicenseComponent', () => {
  let component: ExternalLicenseComponent;
  let fixture: ComponentFixture<ExternalLicenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalLicenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
