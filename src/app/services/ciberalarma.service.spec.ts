import { TestBed } from '@angular/core/testing';

import { CiberalarmaService } from './ciberalarma.service';

describe('CiberalarmaService', () => {
  let service: CiberalarmaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiberalarmaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
