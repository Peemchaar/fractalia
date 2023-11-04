import { UserServiceLicense } from "./userServiceLicense";

export class UserStaticalData {
  creationDate: Date;
  activationDate: Date;
  termsAcceptDate: Date;
  lastAccessDate: Date;
  lastPreviousAccessDate: Date;
  listaExternalLicense:string[];
  listaLicense:string[];
  userServiceLicenses:UserServiceLicense[];
}
