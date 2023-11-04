import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LicenceService } from 'src/app/services/licence.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { BitdefendermspService} from 'src/app/services/bitdefendermsp.service'
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, first, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-mspmodal',
  templateUrl: './mspmodal.component.html',
  styleUrls: ['./mspmodal.component.scss']
})
export class MspmodalComponent implements OnInit {
  public staticContentUrl = environment.STATIC_CONTENT;
  public license: '';
  public step: number = 1
  public mobile: boolean = false;
  public qrImage = '';
  public qrAlt = '';
  public isMobile = false;
  public osValue = -1;

  private readonly unsubscriber$: Subject<any> = new Subject();
  screenWidth$: BehaviorSubject<number> = new BehaviorSubject(null);

  constructor(
    public activeModal: NgbActiveModal,
    public licenseService: LicenceService,
    public userService: UserService,
    public bitdefendermspService: BitdefendermspService) { }

  ngOnInit() {
    this._setScreenWidth(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(300),
        takeUntil(this.unsubscriber$)
      ).subscribe((evt: any) => {
        this._setScreenWidth(evt.target.innerWidth);
      });
  }


  nextStep(){
    this.step += 1
  }

  previousStep(){
    this.step -= 1
  }
  
  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  private _setScreenWidth(width: number): void {
    this.screenWidth$.next(width);
    (this.screenWidth$.value > 767) ? this.mobile = false : this.mobile = true;
  }

}
