/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FraTabComponent } from './fra-tab.component';

describe('FraTabComponent', () => {
  let component: FraTabComponent;
  let fixture: ComponentFixture<FraTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FraTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FraTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
