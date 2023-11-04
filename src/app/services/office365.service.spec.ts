import { TestBed } from '@angular/core/testing';

import { Office365Service } from './office365.service';

describe('Office365Service', () => {
  let service: Office365Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Office365Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
