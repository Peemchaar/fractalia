import { TestBed } from '@angular/core/testing';

import { CyberscoringService } from './cyberscoring.service';

describe('CyberscoringService', () => {
  let service: CyberscoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CyberscoringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
