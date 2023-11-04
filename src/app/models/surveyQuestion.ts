import {SurveyAnswer} from "./surveyAnswer"
export class SurveyQuestion {
    answers: SurveyAnswer[];
    blockName: string;
    blockOrder: number;  
    color: string;
    image: string;
    question: string;
    questionId: number;
    questionOrder: number;
    answerId: number;
    totalBlocks: number;
    totalQuestions: number;
    userSurveyId: number;
    canNewSurvey: boolean;
}