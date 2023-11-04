import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoredIdentitiesIntegratedComponent } from './monitored-identities-integrated.component';

describe('MonitoredIdentitiesIntegratedComponent', () => {
  let component: MonitoredIdentitiesIntegratedComponent;
  let fixture: ComponentFixture<MonitoredIdentitiesIntegratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoredIdentitiesIntegratedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoredIdentitiesIntegratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
