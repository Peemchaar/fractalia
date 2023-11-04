import { TestBed } from '@angular/core/testing';

import { ElearningService } from './elearning.service';

describe('ElearningService', () => {
  let service: ElearningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElearningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
