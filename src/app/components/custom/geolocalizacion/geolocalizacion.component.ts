import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CiberalarmaService } from 'src/app/services/ciberalarma.service';
import { LocalService } from 'src/app/services/local.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-geolocalizacion',
  templateUrl: './geolocalizacion.component.html',
  styleUrls: ['./geolocalizacion.component.scss']
})
export class GeolocalizacionComponent {

  loading = false;
  error = false;
  urlSsoCiberalarma = "";
  public staticContentUrl = environment.STATIC_CONTENT;
  constructor(public ciberalarmaService: CiberalarmaService,
    private router: Router,
    private localService: LocalService) {
    if (this.getLocalStorage('currentService') == null) 
    {
      this.router.navigate(['/']);
      return;
    }
    else
    {
      let service = this.getLocalStorage('currentService');
      ciberalarmaService.serviceId = service.id;
      ciberalarmaService.serviceCode = service.code;
      ciberalarmaService.serviceName = service.name;
      ciberalarmaService.serviceIcon = service.icon;
      ciberalarmaService.serviceDesc = service.desc;
      ciberalarmaService.longDesc = service.longDesc;      
    }
    this.error = false;
  }

  async accessCiberalarma() {
    this.loading = true;
    this.ciberalarmaService.AccessCiberalarma().then(result => {
      // console.log(result);
      if(result != "")
        window.open(result, "_blank");
      else
        this.error = true;
      this.loading = false;
    });
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }

}
