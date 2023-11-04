import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

@Injectable( {
    providedIn:'root'
})
export class NotificationService {
openNotification$: BehaviorSubject<boolean> = new BehaviorSubject(false);
showBell$: BehaviorSubject<boolean> = new BehaviorSubject(false);
isOpen: boolean = false;
showBell = false;
constructor() { }

toogleNotification(){
  this.isOpen = !this.isOpen;
  this.openNotification$.next(this.isOpen);
}

closeNotification() {
  if(this.isOpen) {
    this.isOpen =false;
    this.openNotification$.next(this.isOpen);
  }
}

setShowBell(value){
  this.openNotification$.next(this.isOpen);
}

}
