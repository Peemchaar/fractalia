import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SurveyQuestion } from '../models/surveyQuestion';
import { SurveyResult } from '../models/surveyResult';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  public serviceId: number;
  public serviceName: string = 'Cuestionario de ciberseguridad';
  public serviceIcon: string = "icon-formulario-ciberseguridad";
  public serviceDesc: string = 'Evalúa la situación de seguridad de tu empresa y averigua cómo puedes mejorarla. Al realizar este cuestionario podrás conocer con más claridad cómo impactan las políticas de seguridad de tu compañía y si es necesario revisarlas.';
  public longDesc: string = "Evalúa la situación de seguridad de tu empresa y averigua cómo puedes mejorarla. Al realizar este cuestionario podrás conocer con más claridad cómo impactan las políticas de seguridad de tu compañía y si es necesario revisarlas.";

  protectedIdentities = 0;
  breachedIdentities = 0;

  constructor(private http: HttpClient) { }


  public checkPendingSurvey(){
    return this.http.get<SurveyQuestion>(environment.apiEndpoint + "api/Survey/CheckPendingSurvey").toPromise();
  }

  public getSurveyQuestions(questionNumber: string, userSurveyId: string, blockOrder: string){
    let params = new HttpParams();
    params = params.set('QuestionNumber', questionNumber);
    params = params.set('UserSurveyId', userSurveyId);
    params = params.set('blockOrder', blockOrder);
    return this.http.get<SurveyQuestion>(environment.apiEndpoint + "api/Survey/GetSurveyQuestions", { params }).toPromise();
  }

  public setSurveyAnswer(questionId: any, answerId: any, userSurveyId: any){
    let params = new HttpParams();
    params = params.set('QuestionId', questionId); 
    params = params.set('AnswerId', answerId);
    params = params.set('UserSurveyId', userSurveyId);
    return this.http.post(environment.apiEndpoint + "api/Survey/SetSurveyAnswer?QuestionId="+questionId+"&AnswerId="+answerId+"&UserSurveyId="+userSurveyId, { params }).toPromise();
  }

  public getResults(){
    return this.http.get<SurveyResult>(environment.apiEndpoint + "api/Survey/GetResults").toPromise();
  }

  public getHistoric(){
    return this.http.get<SurveyResult[]>(environment.apiEndpoint + "api/Survey/GetHistoric").toPromise();
  }

  public getRecomendations(blockId: any, risk: any){
    return this.http.get<string>(environment.apiEndpoint + "api/Survey/GetRecomendations?BlockId="+blockId).toPromise();
  }
}
