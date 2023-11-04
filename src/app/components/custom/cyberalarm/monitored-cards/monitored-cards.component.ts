import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MonitoredCard } from 'src/app/models/monitoredCard';
import { MessageService } from 'src/app/services/message.service';
import { MonitoredCardsService } from 'src/app/services/monitored-cards.service';
import { SuiteService } from 'src/app/services/suite.service';
import { UserService } from 'src/app/services/user.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-monitored-cards',
  templateUrl: './monitored-cards.component.html',
  styleUrls: ['./monitored-cards.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MonitoredCardsComponent {

  addCardForm: FormGroup;
  selectedCard: MonitoredCard = { alias: '', cardId: -1, numberCard: '', partnerSuiteId: -1, fraudDetected: false, lastAnalysisDate: "" }
  loading = false;
  constructor(
    public monitoredCardsService: MonitoredCardsService,
    private formBuilder: FormBuilder,
    public userService: UserService,
    public messageService: MessageService,
    public translate: TranslateService,
    public suiteService: SuiteService,
    private router: Router,
    private localService: LocalService
  ) {
    if (monitoredCardsService.serviceId) {
      if (this.getLocalStorage('currentService') == null) {
        this.router.navigate(['/']);
        return;
      }
      else { // If refresh
        let service = this.getLocalStorage('currentService');
        monitoredCardsService.serviceId = service.id;
        monitoredCardsService.serviceName = service.name;
        monitoredCardsService.serviceIcon = service.icon;
        monitoredCardsService.serviceDesc = service.desc;
        monitoredCardsService.longDesc = service.longDesc;
        monitoredCardsService.maxCardsByUser = Number(localStorage.getItem('maxCardsByUser'));
      }
    }
    else {
      let service = this.getLocalStorage('currentService');
      monitoredCardsService.serviceId = service.id;
      monitoredCardsService.serviceName = service.name;
      monitoredCardsService.serviceIcon = service.icon;
      monitoredCardsService.serviceDesc = service.desc;
      monitoredCardsService.longDesc = service.longDesc;
      monitoredCardsService.maxCardsByUser = Number(localStorage.getItem('maxCardsByUser'));

    }
    this.loadData();
  }

  getSelectedCard(id) {
    this.selectedCard = this.monitoredCardsService.cards.find(card => card.cardId == id);
  }

  ngOnInit() {
    this.addCardForm = this.formBuilder.group({
      alias: new FormControl('', [
        Validators.required,
        Validators.pattern("^[A-Za-z0-9!@#-_?¿¡!\$]{4,}$")]),
      numberCard: new FormControl('', [
        Validators.required,
        Validators.pattern("^\\d{16,19}$")])

    });
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
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
    this.monitoredCardsService.canAddCards = Number(localStorage.getItem('maxCardsByUser')) <= this.monitoredCardsService.cards.length
  }

  reloadForm() {
    this.addCardForm.reset()
  }

  // Services calls
  addCard() {
    this.loading = true;
    this.translate.get('REQUEST_SERVICE').subscribe(res => this.messageService.add(res, "ok"));
    var card = new MonitoredCard();
    card.alias = this.addCardControls.alias.value.trim()
    card.numberCard = this.addCardControls.numberCard.value.trim()
    if(this.userService.selSuiteId)
      card.partnerSuiteId =  this.userService.selSuiteId;
    else{
      card.partnerSuiteId = Number(localStorage.getItem('partnerSuiteId'));
    }
    let cards = new Array<MonitoredCard>();
    cards.push(card);
    this.monitoredCardsService.addMonitoredCard(cards).then(
      result => {
        this.loading = false;
        if (result) {
          this.messageService.add(this.translate.instant('CYBERALARM.CARDS.ADD_FORM.RESULT_OK'), "ok");
          this.loadData();
          this.reloadForm()
          document.getElementById('frmAddCard').style.display = "none";
        }
        else{
          this.messageService.add(this.translate.instant('CYBERALARM.CARDS.ADD_FORM.RESULT_ERROR'), "error");
          document.getElementById('frmAddCard').style.display = "none";
          this.reloadForm()
        }
      })
  }

  deleteCard() {
    this.loading = true;
    this.translate.get('REQUEST_DELETE_SERVICE').subscribe(res => this.messageService.add(res, "ok"));
    this.monitoredCardsService.deleteMonitoredCard(this.selectedCard.cardId).then(
      result => {
        this.loading = false;
        if (result) {
          this.messageService.add(this.translate.instant('CYBERALARM.CARDS.REMOVE_FORM.RESULT_OK'), "ok");
          this.loadData();
          document.getElementById('frmRemoveCard').style.display = "none";
        }
        else
          this.messageService.add(this.translate.instant('CYBERALARM.CARDS.REMOVE_FORM.RESULT_ERROR'), "error");
      })
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);
}

}
