import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavegacionseguraIntegratedComponent } from './navegacionsegura-integrated.component';

describe('navegacionsegura-integratedComponent', () => {
  let component: NavegacionseguraIntegratedComponent;
  let fixture: ComponentFixture<NavegacionseguraIntegratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavegacionseguraIntegratedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavegacionseguraIntegratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
