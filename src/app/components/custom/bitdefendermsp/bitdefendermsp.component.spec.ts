import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitdefendermspComponent } from './bitdefendermsp.component';

describe('BitdefendermspComponent', () => {
  let component: BitdefendermspComponent;
  let fixture: ComponentFixture<BitdefendermspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BitdefendermspComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BitdefendermspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
