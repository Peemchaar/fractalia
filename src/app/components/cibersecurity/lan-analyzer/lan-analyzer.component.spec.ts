import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanAnalyzerComponent } from './lan-analyzer.component';

describe('LanAnalyzerComponent', () => {
  let component: LanAnalyzerComponent;
  let fixture: ComponentFixture<LanAnalyzerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanAnalyzerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanAnalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
