import { TestBed } from '@angular/core/testing';

import { FractelService } from './fractel.service';

describe('FractelService', () => {
  let service: FractelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FractelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
