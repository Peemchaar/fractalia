import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PartnerService } from 'src/app/services/partner.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-policy-cookies',
  templateUrl: './policy-cookies.component.html',
  styleUrls: ['./policy-cookies.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PolicyCookiesComponent implements OnInit {

  constructor(public partnerService: PartnerService,
    public userService: UserService) { }

  ngOnInit(): void {
  }

  goBack(){
    javascript:history.back();
  }

}
