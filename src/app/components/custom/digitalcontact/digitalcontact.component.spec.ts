import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalContactComponent } from './digitalcontact.component';

describe('InternetComponent', () => {
  let component: DigitalContactComponent;
  let fixture: ComponentFixture<DigitalContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
