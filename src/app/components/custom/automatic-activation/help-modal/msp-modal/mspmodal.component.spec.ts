import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MspmodalComponent } from './mspmodal.component';

describe('MspmodalComponent', () => {
  let component: MspmodalComponent;
  let fixture: ComponentFixture<MspmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MspmodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MspmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
