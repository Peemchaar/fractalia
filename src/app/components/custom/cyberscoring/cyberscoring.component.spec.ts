import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberscoringComponent } from './cyberscoring.component';

describe('CyberscoringComponent', () => {
  let component: CyberscoringComponent;
  let fixture: ComponentFixture<CyberscoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberscoringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberscoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
