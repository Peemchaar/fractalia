import { TestBed } from '@angular/core/testing';

import { BackupService } from './backup.service';

describe('Backup.ServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BackupService = TestBed.get(BackupService);
    expect(service).toBeTruthy();
  });
});
