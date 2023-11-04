import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoredIdentitiesComponent } from './monitored-identities.component';

describe('MonitoredIdentitiesComponent', () => {
  let component: MonitoredIdentitiesComponent;
  let fixture: ComponentFixture<MonitoredIdentitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoredIdentitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoredIdentitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
