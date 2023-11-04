import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PartnerService } from 'src/app/services/partner.service';
import { LanguageService } from 'src/app/services/language.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TermsComponent implements OnInit {

  constructor(public partnerService: PartnerService, 
    public languageService: LanguageService,
    public userService: UserService) { 
    
  }  
  
  ngOnInit() {
  }

  goBack(){
    javascript:history.back();
  }
}
