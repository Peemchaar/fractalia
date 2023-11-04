import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ])
  ]
})
export class MessagesComponent implements OnInit {

  interval;
  constructor(public messageService: MessageService) { }

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.messageService.messages.length > 0) {
        this.messageService.messages.forEach(element => {
          element.timeLeft--;
        });
        this.messageService.messages.forEach((element, i) => {
          if (element.timeLeft <= 0) {
            this.messageService.messages.splice(i, 1);
          }
        });
      }
    }, 1000)
  }

  delete(index: number) {
    this.messageService.messages.splice(index, 1);
  }

}
