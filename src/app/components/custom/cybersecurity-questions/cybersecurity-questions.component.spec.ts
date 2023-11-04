import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CybersecurityQuestionsComponent } from './cybersecurity-questions.component';

describe('CybersecurityQuestionsComponent', () => {
  let component: CybersecurityQuestionsComponent;
  let fixture: ComponentFixture<CybersecurityQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CybersecurityQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CybersecurityQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});