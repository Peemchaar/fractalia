import { PartnerService } from 'src/app/services/partner.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-policy-privacy',
  templateUrl: './policy-privacy.component.html',
  styleUrls: ['./policy-privacy.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PolicyPrivacyComponent implements OnInit {

  constructor(public partnerService:PartnerService,
    public userService: UserService) { }

  ngOnInit(): void {
  }

  goBack(){
    javascript:history.back();
  }

}
