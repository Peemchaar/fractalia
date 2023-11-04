import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoredCardsIntegratedComponent } from './monitored-cards-integrated.component';

describe('MonitoredCardsIntegratedComponent', () => {
  let component: MonitoredCardsIntegratedComponent;
  let fixture: ComponentFixture<MonitoredCardsIntegratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoredCardsIntegratedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoredCardsIntegratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
