import { TestBed } from '@angular/core/testing';

import { MonitoredCardsService } from './monitored-cards.service';

describe('MonitoredCardsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonitoredCardsService = TestBed.get(MonitoredCardsService);
    expect(service).toBeTruthy();
  });
});
