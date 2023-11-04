import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalLifeComponent } from './digital-life.component';

describe('DigitalLifeComponent', () => {
  let component: DigitalLifeComponent;
  let fixture: ComponentFixture<DigitalLifeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalLifeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalLifeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
