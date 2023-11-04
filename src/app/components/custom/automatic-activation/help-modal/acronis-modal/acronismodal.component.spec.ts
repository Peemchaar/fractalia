import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcronismodalComponent } from './acronismodal.component';

describe('AcronismodalComponent', () => {
  let component: AcronismodalComponent;
  let fixture: ComponentFixture<AcronismodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcronismodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcronismodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
