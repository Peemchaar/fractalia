import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsimulatorformComponent } from './emailsimulatorform.component';

describe('EmailSimulatorComponent', () => {
  let component: EmailsimulatorformComponent;
  let fixture: ComponentFixture<EmailsimulatorformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailsimulatorformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailsimulatorformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
