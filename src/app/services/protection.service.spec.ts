import { TestBed } from '@angular/core/testing';

import { ProtectionService } from './protection.service';

describe('Protection.ServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProtectionService = TestBed.get(ProtectionService);
    expect(service).toBeTruthy();
  });
});
