import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavegacionseguraComponent } from './navegacionsegura.component';

describe('NavegacionseguraComponent', () => {
  let component: NavegacionseguraComponent;
  let fixture: ComponentFixture<NavegacionseguraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavegacionseguraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavegacionseguraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
