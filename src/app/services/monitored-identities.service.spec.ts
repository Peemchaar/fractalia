import { TestBed } from '@angular/core/testing';

import { MonitoredIdentitiesService } from './monitored-identities.service';

describe('MonitoredIdentitiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonitoredIdentitiesService = TestBed.get(MonitoredIdentitiesService);
    expect(service).toBeTruthy();
  });
});
