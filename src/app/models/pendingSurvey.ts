import {SurveyAnswer} from "./surveyAnswer"
export class PendingSurvey {
    answers: SurveyAnswer[];
    blockName: string;
    blockOrder: number;
    canNewSurvey: boolean;
    color: string;
    image: string;
    question: string;
    questionId: number;
    questionOrder: number;
    totalBlocks: number;
    totalQuestions: number;
    userSurveyId: number;
}