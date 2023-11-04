import { HistoricalItem } from "./historicalItem";
import { Report } from "./report";
import { SummaryAffectedAssets } from "./summaryAffectedAssets";
import { SummaryAssetTypes } from "./summaryAssetTypes";
import { SummaryCriticalityByCatItem } from "./summaryCriticalityByCatItem";
import { SummaryCriticalityItem } from "./summaryCriticalityItem";

export class CyberscoringCompanyInfo {
    businessName: string = '';
    cyberscoringId: number = 0;
    domains: string[] = [];
    cnae: number = -1;
    emails: string[] = [];
    alreadyCreated: boolean;
    summaryCriticality: SummaryCriticalityItem[];
    summaryAssetTypes: SummaryAssetTypes;
    summaryAffectedAssets: SummaryAffectedAssets;
    summaryCriticalityByCat: SummaryCriticalityByCatItem[];
    historicalRating: HistoricalItem[];
    reports: Report[];
    maxDomains: number = 0;
    maxEmails: number = 0;
    maxAnalysis: number = 0;
    status: number;
    analysisDate: string;
    product: number;
    nextAnalysisDate: string;
    nextBusinessName: string = '';
    nextCnae: number = -1;
    nextDomains: string[] = [];
    nextStatus: number = 0;
}