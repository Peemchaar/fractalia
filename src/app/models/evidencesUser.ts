import { EvidencesService } from "./evidencesService";

export class EvidencesUser {
    userId: number;
    userName: string;
    userEmail: string;
    isAdmin: boolean;
    services: EvidencesService[];
}