import { Component, OnInit } from '@angular/core';
import { CallService } from 'src/app/services/call.service';
import { Call, Device } from '@twilio/voice-sdk';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss']
})
export class CallComponent implements OnInit {
  private device : Device;
  private call : Call;
  constructor(public callService:CallService,
    public activeModal: NgbActiveModal,) { }

  async ngOnInit() {
    await this.callService.getToken();
    this.device = new Device(this.callService.Token);
    this.device.connect().then((c:Call)=>{
      this.call = c;
    });
  }

  onColgar(){
    this.call.disconnect();
    this.device.disconnectAll();
    this.activeModal.close();
  }

  clickDigit(numero){
    this.call.sendDigits(numero);
  }

  onMute(){
    if(!this.call.isMuted) this.call.mute();
    else this.call.mute(false);
  }

}
