import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoredCardsComponent } from './monitored-cards.component';

describe('MonitoredCardsComponent', () => {
  let component: MonitoredCardsComponent;
  let fixture: ComponentFixture<MonitoredCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoredCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoredCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
