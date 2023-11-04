import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Office365Component } from './office365.component';

describe('Office365Component', () => {
  let component: Office365Component;
  let fixture: ComponentFixture<Office365Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Office365Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Office365Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
