import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallmebackComponent } from './callmeback.component';

describe('CallmebackComponent', () => {
  let component: CallmebackComponent;
  let fixture: ComponentFixture<CallmebackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallmebackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallmebackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
