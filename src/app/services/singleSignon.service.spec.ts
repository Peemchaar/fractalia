/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SingleSignonService } from './singleSignon.service';

describe('Service: SingleSignon', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SingleSignonService]
    });
  });

  it('should ...', inject([SingleSignonService], (service: SingleSignonService) => {
    expect(service).toBeTruthy();
  }));
});
