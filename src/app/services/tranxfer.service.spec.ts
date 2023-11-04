import { TestBed } from '@angular/core/testing';

import { TranxferService } from './tranxfer.service';

describe('CiberalarmaService', () => {
  let service: TranxferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranxferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
