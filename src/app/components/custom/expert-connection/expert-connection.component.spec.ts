import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertConnectionComponent } from './expert-connection.component';

describe('ExpertConnectionComponent', () => {
  let component: ExpertConnectionComponent;
  let fixture: ComponentFixture<ExpertConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpertConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
