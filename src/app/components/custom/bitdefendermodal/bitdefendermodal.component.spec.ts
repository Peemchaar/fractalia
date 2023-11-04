import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitdefendermodalComponentComponent } from './bitdefendermodal.component';

describe('BitdefendermodalComponentComponent', () => {
  let component: BitdefendermodalComponentComponent;
  let fixture: ComponentFixture<BitdefendermodalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BitdefendermodalComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BitdefendermodalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
