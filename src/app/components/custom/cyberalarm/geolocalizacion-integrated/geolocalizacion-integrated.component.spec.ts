import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeolocalizacionIntegratedComponent } from './geolocalizacion-integrated.component';

describe('GeolocalizacionIntegratedComponent', () => {
  let component: GeolocalizacionIntegratedComponent;
  let fixture: ComponentFixture<GeolocalizacionIntegratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeolocalizacionIntegratedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeolocalizacionIntegratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
