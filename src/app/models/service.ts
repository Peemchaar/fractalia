import { TagServiceModel } from './tagServiceModel';
import { ServiceLan } from './serviceLan';
import { TagLan } from './tagLan';

export class Service {
    id: number;
    name: string;
    internalName: string;
    desc: string;
    type: string;
    typeCode: string;
    typeId: number;
    uses: number;
    icon: string;
    longDesc: string;
    creation: Date;
    categoryId: number;
    category: string;
    active: boolean;
    code: string;
    color: string;
    gradColor: string;
    maxCardsByUser: number;
    iconId: number;
    languageId: number;
    serviceLan:ServiceLan;
    serviceLans: ServiceLan[];
    denyEmployeeAccess: boolean;
    originalCode: string;
    tagServices:TagServiceModel[];
    tags:TagLan[];
}
