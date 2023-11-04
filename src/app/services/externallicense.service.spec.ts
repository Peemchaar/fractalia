import { TestBed } from '@angular/core/testing';

import { ExternalLicenseService } from './externallicense.service';

describe('ExternalLicenseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExternalLicenseService = TestBed.get(ExternalLicenseService);
    expect(service).toBeTruthy();
  });
});
