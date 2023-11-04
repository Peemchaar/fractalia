import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderIntegratedComponent } from './header-integrated.component';

describe('HeaderIntegratedComponent', () => {
  let component: HeaderIntegratedComponent;
  let fixture: ComponentFixture<HeaderIntegratedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderIntegratedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderIntegratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
