import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GravityIntegratedComponent } from './gravity-integrated.component';

describe('GravityIntegratedComponent', () => {
  let component: GravityIntegratedComponent;
  let fixture: ComponentFixture<GravityIntegratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GravityIntegratedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GravityIntegratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
