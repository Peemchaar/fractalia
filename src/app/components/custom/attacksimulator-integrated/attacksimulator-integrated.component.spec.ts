import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttacksimulatorIntegratedComponent } from './attacksimulator-integrated.component';

describe('AttacksimulatorIntegratedComponent', () => {
  let component: AttacksimulatorIntegratedComponent;
  let fixture: ComponentFixture<AttacksimulatorIntegratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttacksimulatorIntegratedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttacksimulatorIntegratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
