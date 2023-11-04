import { TestBed } from '@angular/core/testing';

import { ExternalappDigitalLegacyService } from './externalapp-digital-legacy.service';

describe('ExternalappDigitalLegacyService', () => {
  let service: ExternalappDigitalLegacyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalappDigitalLegacyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
