import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MonitoredCard } from 'src/app/models/monitoredCard';
import { MessageService } from 'src/app/services/message.service';
import { MonitoredCardsService } from 'src/app/services/monitored-cards.service';
import { SuiteService } from 'src/app/services/suite.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-geolocalizacion-integrated',
  templateUrl: './geolocalizacion-integrated.component.html',
  styleUrls: ['./geolocalizacion-integrated.component.scss']
})
export class GeolocalizacionIntegratedComponent implements OnInit {

  @Input() serviceName: string;
  @Input() serviceIcon: string;
  public staticContentUrl = environment.STATIC_CONTENT;
  constructor() { }

  ngOnInit(): void {
  }

}
