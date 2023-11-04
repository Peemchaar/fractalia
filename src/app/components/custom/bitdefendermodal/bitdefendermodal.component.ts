import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LicenceService } from 'src/app/services/licence.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { BitdefendermspService} from 'src/app/services/bitdefendermsp.service'

@Component({
  selector: 'app-bitdefendermodal',
  templateUrl: './bitdefendermodal.component.html',
  styleUrls: ['./bitdefendermodal.component.scss']
})
export class BitdefendermodalComponent implements OnInit {
  public staticContentUrl = environment.STATIC_CONTENT;
  public license: '';
  @Input() isBMS: boolean;

  public qrImage = '';
  public qrAlt = '';
  public isMobile = false;
  public osValue = -1;

  constructor(
    public activeModal: NgbActiveModal,
    public licenseService: LicenceService,
    public userService: UserService,
    public bitdefendermspService: BitdefendermspService) { }

  async ngOnInit() {
    this.onChangeDevice()
    this.onChangeOS()
  }

  onChangeOS() {
    switch (+this.osValue) {
      case 1:
        this.qrImage = `${this.staticContentUrl}img/art/qr_bitdefender_android.png`;
        this.qrAlt = 'QR BitDefender para Android';
        this.isMobile = true
        break;
      case 2:
        this.qrImage = `${this.staticContentUrl}img/art/qr_bitdefender_iphone.png`;
        this.qrAlt = 'QR BitDefender para iOS';
        this.isMobile = true
        break;
      case 3:
      case 4:
        this.isMobile = false
        break;
      default: break;
    }
  }

  onChangeDevice(device: number = -1) {
    switch (device) {
      case 1: this.isMobile = true; this.osValue = -1; break;
      case 2: this.isMobile = false; this.osValue = -1; break;
      default: break;
    }
  }

  goToDownloadPage() {
    this.bitdefendermspService.clientDownloaded = true;
    switch (+this.osValue) {
      case 1: window.open("https://play.google.com/store/apps/details?id=com.bitdefender.security"); break;
      case 2: window.open("https://apps.apple.com/es/app/bitdefender-mobile-security/id1255893012"); break;
      case 3: window.open("https://download.bitdefender.com/windows/installer/es-es/bitdefender_tsecurity.exe"); break;
      case 4: window.open("https://download.bitdefender.com/mac/av/es/bitdefender_antivirus_for_mac.dmg"); break;
      default: break;
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

}
