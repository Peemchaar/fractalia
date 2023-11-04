import { suiteService } from './suiteService';

export class Suite {
    id: number;
    name: string;
    code: string;
    desc: string;
    color: string;
    gradColor: string;
    icon: string;
    image: string;
    checked: boolean;
    maxCardsByUser: number;
    maxIdentitiesByUser: number;
    services: suiteService[];
}