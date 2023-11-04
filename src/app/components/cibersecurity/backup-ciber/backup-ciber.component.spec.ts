import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupCiberComponent } from './backup-ciber.component';

describe('BackupCiberComponent', () => {
  let component: BackupCiberComponent;
  let fixture: ComponentFixture<BackupCiberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackupCiberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupCiberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
