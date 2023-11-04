import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common'
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';
import { PartnerService } from 'src/app/services/partner.service';
import { LocalService } from 'src/app/services/local.service';
import { ModalComponent } from '../modal/modal.component';
import { environment } from 'src/environments/environment';
import { SurveyService } from 'src/app/services/survey.service';
import { SurveyQuestion } from 'src/app/models/surveyQuestion';
import { SurveyResult } from 'src/app/models/surveyResult';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, first, takeUntil } from 'rxjs/operators';
import { StringUtils } from 'src/app/utils/string-utils';
import { ChartType } from 'chart.js';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

declare var $ : any;
 
@Component({
  selector: 'app-cybersecurity-questions',
  templateUrl: './cybersecurity-questions.component.html',
  styleUrls: ['./cybersecurity-questions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CybersecurityQuestionsComponent implements OnInit {
  @Input() serviceCard?: boolean = false;
  public staticContentUrl = environment.STATIC_CONTENT;

  public loading = false;
  public surveyLoading = false;

  public showMessage: boolean = false;
  public errorDomain: boolean = false;
  public errorBusinessName: boolean = false;
  public errorCnae: boolean = false;
  public errorNoDomain: boolean = false;
  public message: string = "";
  public readonlyFields = false;
  public success: boolean = false
  public historic: SurveyResult[] = [];
  public results: SurveyResult = new SurveyResult;
  public question: SurveyQuestion = new SurveyQuestion;
  public actualProgress: string = "0%";
  public hasPending: boolean = false;
  public isCheckedId: string = '';
  public mobile: boolean = false;
  public showResults: boolean = false;
  public showResultsDesk: boolean = false;
  public stopModal: boolean = false;
  public answerCheck: boolean = false;

  // ---- bars values -----
  public globalScore: any = 0;
  public globalProgress: string = '0%';
  public personsScore: any = 0;
  public personsProgress: string = '0%';
  public processScore: any = 0;
  public processProgress: string = '0%';
  public techScore: any = 0;
  public techProgress: string = '0%';
  public lastSurveyDate: string = '';
  public nextSurveyDate: string = '';

  // recomendations
  public block1rec: SafeHtml;
  public block2rec: SafeHtml;
  public block3rec: SafeHtml;
  public rec1: boolean = false;
  public rec2: boolean = false;
  public rec3: boolean = false;
  public acord1Loaded: boolean = false;
  public acord2Loaded: boolean = false;
  public acord3Loaded: boolean = false;

  // Historical chart
  public showPerson: boolean = true;
  public showProcess: boolean = true;
  public showTech: boolean = true;
  public personData: any
  public processData: any
  public techData: any
  public chartDataset: Array<any> = [];
  public chartType: ChartType = 'line';
  public chartColor: any[] = [{ backgroundColor: ["#ffffff"] }];
  public chartLabels: Array<any> = [];
  public chartOptions = {
    scales: {
      xAxes: [{
        ticks: {
          callback: function (value) {
            return value
          },
        }
      }],

      yAxes: [{
        ticks: {
           steps : 5,
           stepValue : 25,
           max : 100,
           min: 0
         }
     }]
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: true,
      mode: 'label',
      callbacks: {
        title: function (tooltipItems, data) {
          var idx = tooltipItems[0].index;
          return data.labels[idx];
        }
      }
    }
  };



  private readonly unsubscriber$: Subject<any> = new Subject();
  screenWidth$: BehaviorSubject<number> = new BehaviorSubject(null);

  constructor(
    public router: Router,
    public userService: UserService,
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public translate: TranslateService,
    public messageService: MessageService,
    public partnerService: PartnerService,
    public surveyService: SurveyService,
    public datepipe: DatePipe,
    private localService: LocalService,
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef) { }

  async ngOnInit() {
    //this.surveyLoading = true;
    this._setScreenWidth(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(300),
        takeUntil(this.unsubscriber$)
      ).subscribe((evt: any) => {
        this._setScreenWidth(evt.target.innerWidth);
      });

    this.checkSurvey()
    this.checkHistoric()
  }


  onChange(val, e){
    this.answerCheck = e.target.checked;
    (e.target.checked ==true)? this.isCheckedId = val.answerId : this.isCheckedId = '';
  }

  private _setScreenWidth(width: number): void {
    this.screenWidth$.next(width);
    (this.screenWidth$.value > 767) ? this.mobile = false : this.mobile = true;
  }
  
  ngAfterViewChecked() {
    if(this.rec1 == true && this.acord1Loaded == false){
      let persons = true
      let indexPerson = 1
      do {   
        if (document.getElementById(`person-${indexPerson}`) != null) {
          document.getElementById(`person-${indexPerson}`).addEventListener("click", this.toggleRecoAcord.bind(this,`person-${indexPerson}`));
          if (indexPerson == 1) this.toggleRecoAcord(`person-${indexPerson}`)
          indexPerson++
        }else {
          persons = false;
          this.acord1Loaded = true
        }
      } while (persons == true);
    }

    if(this.rec3 == true && this.acord3Loaded == false){
      let tecno = true
      let indexTecno = 1
      do {   
        if (document.getElementById(`tecno-${indexTecno}`) != null) {
          document.getElementById(`tecno-${indexTecno}`).addEventListener("click", this.toggleRecoAcord.bind(this,`tecno-${indexTecno}`));
          indexTecno++
        }else {
          tecno = false;
          this.acord3Loaded = true
        }
      } while (tecno == true);
    }

    if(this.rec2 == true && this.acord2Loaded == false){
      let process = true
      let indexProcess = 1
      do {   
        if (document.getElementById(`process-${indexProcess}`) != null) {
          document.getElementById(`process-${indexProcess}`).addEventListener("click", this.toggleRecoAcord.bind(this,`process-${indexProcess}`));
          indexProcess++
        }else {
          process = false;
          this.acord2Loaded = true
        }
      } while (process == true);
    }
  }

  iterateProgress(value: string,actualValue, topValue){
    actualValue += 1;
    if (actualValue <= topValue){
      if(value == 'global'){
        setTimeout(() =>{
          this.globalScore = actualValue;
          this.globalProgress = `${this.globalScore}%`;
          this.iterateProgress('global',actualValue,topValue);
          
        }, 10);
      }
      if(value == 'persons'){
        setTimeout(() =>{
          this.personsScore = actualValue;
          this.personsProgress = `${this.personsScore}%`;
          this.iterateProgress('persons',actualValue,topValue);
          
        }, 10);
      }
      if(value == 'process'){
        setTimeout(() =>{
          this.processScore = actualValue;
          this.processProgress = `${this.processScore}%`;
          this.iterateProgress('process',actualValue,topValue);
         
        }, 10);
      }
      if(value == 'tech'){
        setTimeout(() =>{
          this.techScore = actualValue;
          this.techProgress = `${this.techScore}%`;
          this.iterateProgress('tech',actualValue,topValue);
          
        }, 10);
      }
    }
    
  }

  async checkSurvey(){
    await this.surveyService.checkPendingSurvey().then(survey => {
      this.question = survey
      if(survey.userSurveyId != 0){
        this.hasPending = true
        var progress = ((this.question.blockOrder-1)*100)/this.question.totalBlocks;
        this.actualProgress = `${progress}%`
      }
    });
  }
  async checkHistoric(){
    await this.surveyService.getHistoric().then(historic => {
      if(historic.length > 0){
        this.historic = historic
        this.results = this.historic[this.historic.length-1]
        this.lastSurveyDate = StringUtils.convertDateWithHour(this.results.datetime);
        this.nextSurveyDate = StringUtils.addDaysAndFormat(this.results.datetime,7);
        this.showResultsDesk = true;
        this.iterateProgress('global',0,this.results.globalPercentage);
        this.iterateProgress('persons',0,this.results.block1Percentage);
        this.iterateProgress('process',0,this.results.block2Percentage);
        this.iterateProgress('tech',0,this.results.block3Percentage);
        (this.serviceCard == false)? this.obtainRecomendations() : null;
        (!this.serviceCard && historic.length > 1)? this.fillChart() : null;
      }
    });
  }

  obtainRecomendations(){
    this.getRecomendations(1, this.results.block1+1).toString()
    this.getRecomendations(2, this.results.block2+1).toString()
    this.getRecomendations(3, this.results.block3+1).toString()
  }

  fillChart(){
    var data: any[] = [];
/*     let newData: SurveyResult = new SurveyResult;

    newData.block1 = '1'
    newData.block1Name = 'Personas'
    newData.block1Value = 700

    newData.block2 = '0'
    newData.block2Name = 'Procesos'
    newData.block2Value = 900

    newData.block3 = '2'
    newData.block3Name = 'Tecnología'
    newData.block3Value = 200

    newData.global = '1'
    newData.globalValue = 650
    newData.datetime = new Date().toString();

    this.historic.push(newData) */
    
    data = this.historic.map(e => {
      return this.datepipe.transform(new Date(e.datetime), 'MM/dd');
    })
    this.chartLabels = data;

    let persons = this.historic.map(e => {
      return e.block1Percentage
    })
    this.personData = {
      data: persons, 
      label: "Personas",
      fill: false,
      borderColor: '#FF981F',
      pointBackgroundColor: '#FF981F',
      pointRadius: 6,
      tension: 0.1 
    }
    this.chartDataset.push(this.personData)

    let process = this.historic.map(e => {
      return e.block2Percentage
    })
    this.processData = {
      data: process, 
      label: "Procesos",
      fill: false,
      borderColor: '#0349FE',
      pointBackgroundColor: '#0349FE',
      pointRadius: 6,
      tension: 0.1 
    }
    this.chartDataset.push(this.processData)

    let tech = this.historic.map(e => {
      return e.block3Percentage
    })
    this.techData = {
      data: tech, 
      label: "Tecnología",
      fill: false,
      borderColor: '#FD96FF',
      pointBackgroundColor: '#FD96FF',
      pointRadius: 6,
      tension: 0.1  
    }
    this.chartDataset.push(this.techData)
  }

  filterChart(per,pro,tec){
    this.chartDataset = [];
    if(per == 1){
      this.showPerson = !this.showPerson
    }
    if(pro == 1){
      this.showProcess = !this.showProcess
    }
    if(tec == 1){
      this.showTech = !this.showTech
    }
    if(this.showPerson == true) this.chartDataset.push(this.personData)
    if(this.showProcess == true) this.chartDataset.push(this.processData)
    if(this.showTech == true) this.chartDataset.push(this.techData)

  }

  async openSurvey(){
   
    this.showResults = false;
    this.stopModal = false;
    if(this.question.canNewSurvey == true || this.hasPending){
      this.surveyLoading = true
      document.getElementById('openSurveyModal').click();
      if(this.hasPending == false){
        await this.surveyService.getSurveyQuestions('1','0','1').then(question => {
          this.question = question;
          this.surveyLoading = false
        })
      }else{
        let block = (this.question.blockOrder > 1)? (this.question.blockOrder-1)*10 : this.question.blockOrder;
        let progress = ((this.question.questionOrder-1+block)*100)/(this.question.totalBlocks*10);
        this.actualProgress = `${progress.toFixed(1)}%`
        this.surveyLoading = false

      }
    }else{
      document.getElementById('openInfoModal').click();
    }
  }

  async previousQuestion(){
    this.surveyLoading = true;
    var question = (this.question.questionOrder == 1)? 10 : this.question.questionOrder-1
    var block = (question == 10)? this.question.blockOrder-1 : this.question.blockOrder
    await this.surveyService.getSurveyQuestions(question.toString(),this.question.userSurveyId.toString(),block.toString()).then(question => {
      this.question = question;
      this.isCheckedId = question.answerId.toString()
      this.answerCheck = true
      this.surveyLoading = false
    })
  }

  async nextQuestion(){
    this.surveyLoading = true;
    var question = (this.question.questionOrder < this.question.totalQuestions)? this.question.questionOrder+1 : 1
    var block = (question == 1)? this.question.blockOrder+1 : this.question.blockOrder
    await this.surveyService.getSurveyQuestions(question.toString(),this.question.userSurveyId.toString(),block.toString()).then(question => {
      this.question = question;
      this.isCheckedId = question.answerId.toString()
      this.answerCheck = true
      this.surveyLoading = false
    })
  }

  async getResults(){
    this.surveyLoading = true;
    await this.surveyService.getResults().then(results => {
      this.results = results;
      this.showResults = true;
      this.showResultsDesk = true;
      this.iterateProgress('global',0,this.results.globalPercentage);
      this.iterateProgress('persons',0,this.results.block1Percentage);
      this.iterateProgress('process',0,this.results.block2Percentage);
      this.iterateProgress('tech',0,this.results.block3Percentage);
      this.surveyLoading = false;
    })
  }

  async sendAnswer(){
    this.loading = true;
    await this.surveyService.setSurveyAnswer(
      this.question.questionId,
      this.isCheckedId,
      this.question.userSurveyId).then(res => {
        this.loading = false
        if(res == true){
          this.isCheckedId = '';
          this.answerCheck = false;
          if(this.question.questionOrder < this.question.totalQuestions){
            let block = (this.question.blockOrder > 1)? (this.question.blockOrder-1)*10 : this.question.blockOrder;
            let progress = ((this.question.questionOrder+block)*100)/(this.question.totalBlocks*10);
            this.actualProgress = `${progress.toFixed(1)}%`
            this.nextQuestion()
          }else if(this.question.questionOrder == this.question.totalQuestions){
            if(this.question.blockOrder < this.question.totalBlocks){
              let progress = ((this.question.questionOrder*this.question.blockOrder)*100)/(this.question.totalBlocks*10);
              this.actualProgress = `${progress.toFixed(1)}%`
              this.nextQuestion()
            }else{
              this.getResults()
            }
          }
        }
    })
  }

  async getRecomendations(blockId, risk){
    await this.surveyService.getRecomendations(blockId, risk).then(res => {
      if (blockId == 1) this.block1rec = this.sanitizer.bypassSecurityTrustHtml(res.toString()), this.togglePerRec();
      if (blockId == 2) this.block2rec = this.sanitizer.bypassSecurityTrustHtml(res.toString())
      if (blockId == 3) this.block3rec = this.sanitizer.bypassSecurityTrustHtml(res.toString())
    })

  }

  open(name: string, desc: string, icon: string) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.desc = desc;
    modalRef.componentInstance.icon = icon;
  }

  toggleClose(){
    if(!this.showResults){
      this.stopModal = !this.stopModal
    }else{
      document.getElementById('closeModalResults').click()
    }
    
  }

  async togglePerRec(){
    await (this.rec1 == false)? this.rec1 = true : this.rec1 = false, this.acord1Loaded = false;
  }
  async toggleProcRec(){
    await (this.rec2 == false)? this.rec2 = true : this.rec2 = false, this.acord2Loaded = false;
  }
  async toggleTechRec(){
    await (this.rec3 == false)? this.rec3 = true : this.rec3 = false, this.acord3Loaded = false;
  }

  goToDetails(){
    (this.serviceCard)? this.router.navigate(["/cyberSurvey"]) : this.checkHistoric(),document.getElementById('closeResultModal').click();
  }


  toggleRecoAcord(name: string){
    $('#'+name+'-chev-down').toggleClass('hidden')
    $('#'+name+'-chev-up').toggleClass('hidden')
    $('#'+name+'-body').toggleClass('hidden')
    $('#'+name+'-chev-down').toggleClass('d-flex')
    $('#'+name+'-chev-up').toggleClass('d-flex')
  }
}