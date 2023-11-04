import { TestBed } from '@angular/core/testing';

import { AppInstallerService } from './app-installer.service';

describe('AppInstallerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppInstallerService = TestBed.get(AppInstallerService);
    expect(service).toBeTruthy();
  });
});
