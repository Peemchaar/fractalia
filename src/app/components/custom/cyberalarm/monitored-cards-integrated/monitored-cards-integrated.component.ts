import { Component, ElementRef, HostListener, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { MonitoredCard } from 'src/app/models/monitoredCard';
import { DashboardUserService } from 'src/app/services/dashboard-user.service';
import { MessageService } from 'src/app/services/message.service';
import { MonitoredCardsService } from 'src/app/services/monitored-cards.service';
import { SuiteService } from 'src/app/services/suite.service';
import { UserService } from 'src/app/services/user.service';
import { ModalComponent } from '../../modal/modal.component';

declare var $: any;

@Component({
  selector: 'app-monitored-cards-integrated',
  templateUrl: './monitored-cards-integrated.component.html',
  styleUrls: ['./monitored-cards-integrated.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MonitoredCardsIntegratedComponent implements OnInit {
  @Input() serviceCard?: boolean = false;
  @ViewChild('numberCard') numberCard: ElementRef;
  @ViewChild('alias') alias: ElementRef;
  public dataCards: string[] = [];
  public cardsArray: Array<MonitoredCard>;
  public success: boolean = false
  public totalCards: string = "0/0"
  public cards = Array<MonitoredCard>();
  public compactCards: boolean = false;
  public showAddCard: boolean = false;
  public showMaxError: boolean = false;
  public aliasRequired: boolean = false

  public get messageService(): MessageService {
    return this._messageService;
  }
  public set messageService(value: MessageService) {
    this._messageService = value;
  }
  addCardForm: FormGroup;
  selectedCard: MonitoredCard = { alias: '', cardId: -1, numberCard: '', partnerSuiteId: -1, fraudDetected: false, lastAnalysisDate: '' }
  loading = false;
  constructor(
    public monitoredCardsService: MonitoredCardsService,
    private formBuilder: FormBuilder,
    public userService: UserService,
    private _messageService: MessageService,
    public translate: TranslateService,
    public suiteService: SuiteService,
    public modalService: NgbModal,
    public dashboardService: DashboardUserService
  ) {
    monitoredCardsService.maxCardsByUser = Number(localStorage.getItem('maxCardsByUser'));
    this.cardsArray = new Array<MonitoredCard>()
    this.loadData();
  }

  getSelectedCard(id) {
    this.selectedCard = this.monitoredCardsService.cards.find(card => card.cardId == id);
  }

  fakeArray(length: number) {
    (length > 0) ? this.showAddCard = true : this.showAddCard = false;
  }

  ngOnInit() {
    this.addCardForm = this.formBuilder.group({
      alias: new FormControl('', [
        Validators.required,
        Validators.pattern("^[A-Za-z0-9!@#-_?¿¡! \s\$]{4,}$")]),
      numberCard: new FormControl('', [
        Validators.pattern("^\\d{16,19}$")])
    });
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    /*     if (event.keyCode === 32) {
          event.preventDefault();
        } */
  }
  get addCardControls() { return this.addCardForm.controls; }

  get inputCard() {
    return this.addCardForm.get('numberCard')
  }
  get inputAlias() {
    return this.addCardForm.get('alias')
  }
  async loadData() {
    await this.monitoredCardsService.getMonitoredCardsByUser();
    this.monitoredCardsService.canAddCards = Number(localStorage.getItem('maxCardsByUser')) > this.monitoredCardsService.cards.length
    this.fakeArray(this.monitoredCardsService.maxCardsByUser - this.monitoredCardsService.cards.length)
    if (this.monitoredCardsService.canAddCards == true) {
      (this.monitoredCardsService.cards.length >= 3) ? this.compactCards = true : this.compactCards = false
    } else {
      (this.monitoredCardsService.cards.length > 3) ? this.compactCards = true : this.compactCards = false
    }
    this.totalCards = `${this.monitoredCardsService.cards.length}/${this.monitoredCardsService.maxCardsByUser}`
  }

  reloadForm() {
    this.addCardForm.reset()
    this.dataCards.length = 0;
    this.dataCards = []
    this.cardsArray = new Array<MonitoredCard>()
    this.success = false;
    this.showMaxError = false;
  }

  // Services calls
  sendCards() {
    this.loading = true;
    this.translate.get('REQUEST_SERVICE').subscribe(res => this.messageService.add(res, "ok"));

    this.cardsArray.forEach(element => {
      if (this.userService.selSuiteId)
        element.partnerSuiteId = this.userService.selSuiteId;
      else {
        element.partnerSuiteId = Number(localStorage.getItem('partnerSuiteId'));
      }
    });

    this.monitoredCardsService.addMonitoredCard(this.cardsArray).then(
      result => {
        this.loading = false;
        if (result) {
          this.messageService.add(this.translate.instant('CYBERALARM.CARDS.ADD_FORM.RESULT_OK'), "ok");
          this.loadData();
          this.dashboardService.getUserDashboard();
          this.success = true;
          this.showMaxError = false;
        }
        else {
          this.messageService.add(this.translate.instant('CYBERALARM.CARDS.ADD_FORM.RESULT_ERROR'), "error");
        }
      })
  }

  closeAddModal() {
    this.reloadForm();
    document.getElementById('addModalClose').click();
  }

  addCard(card) {
    if (card != "") {
      if (this.inputAlias.value == "" || this.inputAlias.value == null) {
        
        this.addCardForm.controls.alias.markAsTouched({onlySelf:true})
        this.addCardForm.controls.alias.markAsDirty({onlySelf:true})
        //this.aliasRequired = true
      } else {
        this.showMaxError = false;
        if (this.inputCard.valid && this.dataCards.indexOf(card) == -1) {
          
          if ((this.monitoredCardsService.cards.length + this.cardsArray.length) < Number(localStorage.getItem('maxCardsByUser'))) {
            var tempCard = new MonitoredCard();
            tempCard.alias = this.addCardControls.alias.value
            tempCard.numberCard = card.trim()
            this.dataCards.push(card);
            this.cardsArray.push(tempCard)
            this.numberCard.nativeElement.value = '';
            this.alias.nativeElement.value = '';
            this.inputAlias.setValue('')
            this.inputCard.setValue('')
            this.inputAlias.markAsUntouched({onlySelf:true})
            this.inputAlias.markAsPristine({onlySelf:true})
            
            if((this.monitoredCardsService.cards.length + this.cardsArray.length) == Number(localStorage.getItem('maxCardsByUser'))) this.showMaxError = true;
          } else {
            this.showMaxError = true;
          }

        }
      }

    }
  }
  removeCard(card) {
    if (card != "") {
      if (this.dataCards.includes(card.numberCard)) {
        this.dataCards.splice(this.dataCards.indexOf(card.numberCard), 1);
        this.cardsArray.splice(this.cardsArray.indexOf(card.numberCard), 1);
        this.showMaxError = false;
      }
    }
  }

  deleteCard() {
    this.loading = true;
    this.translate.get('REQUEST_DELETE_SERVICE').subscribe(res => this.messageService.add(res, "ok"));
    this.monitoredCardsService.deleteMonitoredCard(this.selectedCard.cardId).then(
      result => {
        this.loading = false;
        if (result) {
          document.getElementById('closeModalRemove').click();
          this.messageService.add(this.translate.instant('CYBERALARM.CARDS.REMOVE_FORM.RESULT_OK'), "ok");
          this.loadData();
          this.dashboardService.getUserDashboard();

        }
        else {
          document.getElementById('closeModalRemove').click();
          this.messageService.add(this.translate.instant('CYBERALARM.CARDS.REMOVE_FORM.RESULT_ERROR'), "error");
        }

      })
  }

  open(name: string, desc: string, icon: string) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.desc = desc;
    modalRef.componentInstance.icon = icon;
  }
}
