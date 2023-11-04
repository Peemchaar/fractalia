import { Injectable } from '@angular/core';//
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DashboardUser } from '../models/DashboardUser';
import { BytesValidator } from '../validators/bytes.validator';
import { DashboardUserProteccionDispositivo } from '../models/DashboardUserProteccionDispositivo';
import { DashboardUserSeguridadUsuario } from '../models/DashboardUserSeguridadUsuario';
import { DashboardUserProteccionRed } from '../models/DashboardUserProteccionRed';
import { ServicesService } from 'src/app/services/services.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardUserService {

  private minDate = new Date("1/1/0001 12:00:00");

  public listDashboardUser: DashboardUser[];
  public listDashboardUserProteccionDispositivo: DashboardUserProteccionDispositivo[];
  public listDashboardUserSeguridadUsuario: DashboardUserSeguridadUsuario[];
  public listDashboardUserProteccionRed: DashboardUserProteccionRed[];

  public deviceProtectionAll = { devices: 0, alerts: 0, dateLast: this.minDate }
  public backupAll = { licences: 0, spacedUsed: '', isNotification: false, dangerAlerts: 0, koAlerts: 0, dangerAlertsDate: this.minDate, koAlertsDate: this.minDate, okAlertsDate: this.minDate }
  public CreditCardAll = { cards: 0, alerts: 0, alertsDate: this.minDate }
  public CredentialsAll = { credentials: 0, alerts: 0, alertsDate: this.minDate }
  public NetProtectionAll = { devices: 0, alerts: 0, dangerAlerts: 0, dangerAlertsDate: this.minDate, koAlertsDate: this.minDate, dateLast: this.minDate };
  public VulnerabilitiesAll = { alerts: 0, alertsDate: this.minDate, dangerAlerts: 0, dangerAlertsDate: this.minDate, dateLast: this.minDate, isAcunetix: false };

  public deviceProtectionSingle = { devices: 0, alerts: 0, dateLast: this.minDate }
  public backupSingle = { licences: 0, spaceAssigned: '', spacedUsed: '', isNotification: false, dangerAlerts: 0, koAlerts: 0, dangerDate: this.minDate, koDate: this.minDate, backupPercent: 0, okDate: this.minDate }
  public CreditCardSingle = { cards: 0, alerts: 0, alertsDate: this.minDate }
  public CredentialsSingle = { credentials: 0, alerts: 0, alertsDate: this.minDate }
  public NetProtectionSingle = { devices: 0, alerts: 0, dangerAlerts: 0, alertsDate: this.minDate };
  public VulnerabilitiesPageSingle = { alerts: 0, dangerAlerts: 0, alertsDate: this.minDate, isAcunetix: false };

  public deviceProtectionName:string;
  public backupName:string;
  public CreditCardName:string;
  public CredentialName:string;
  public NetProtectionName:string;
  public VulnerabilitiesName:string;


  constructor(private http: HttpClient,private serviceService: ServicesService) { }

  public async getUserDashboard(): Promise<any> {
    return this.http.get<any>(environment.apiEndpoint + "api/user/GetUserDashboard").toPromise().then(result => {
      this.listDashboardUser = result;

      this.deviceProtectionSingle.devices = 0;
      this.deviceProtectionSingle.alerts = 0;
      this.deviceProtectionAll.devices = 0;
      this.deviceProtectionAll.alerts = 0;
      this.backupSingle.licences = 0;

      this.backupAll.licences = 0;
      this.backupAll.spacedUsed = '';
      this.CreditCardAll.cards = 0;
      this.CreditCardAll.alerts = 0;
      this.CredentialsAll.credentials = 0;
      this.CredentialsAll.alerts = 0;

      this.NetProtectionAll.alerts = this.NetProtectionAll.dangerAlerts = this.NetProtectionAll.devices = 0
      this.VulnerabilitiesAll.alerts = this.VulnerabilitiesAll.dangerAlerts = 0

      this.CreditCardSingle = { cards: 0, alerts: 0, alertsDate: this.minDate }
      this.CredentialsSingle = { credentials: 0, alerts: 0, alertsDate: this.minDate }

      if (this.listDashboardUser) {
        let dashboardUser: DashboardUser;
        this.listDashboardUserProteccionDispositivo = [];
        this.listDashboardUserSeguridadUsuario = [];
        this.listDashboardUserProteccionRed = [];
        let dashboardUserProteccionDispositivo: DashboardUserProteccionDispositivo;
        let dashboardUserSeguridadUsuario: DashboardUserSeguridadUsuario;
        let dashboardUserProteccionRed: DashboardUserProteccionRed;
        let device;

        let dateScanned: Date;
        let dateLast: Date;
        let alertmsp: number;
        this.backupAll.dangerAlerts = 0;
        this.backupAll.koAlerts = 0;
        this.NetProtectionSingle.alerts = 0;
        this.NetProtectionSingle.dangerAlerts = 0;

        var auxAcronisData = 0;

        for (let i = 0; i < this.listDashboardUser.length; i++) {
          dashboardUser = this.listDashboardUser[i];
          dashboardUserProteccionDispositivo = new DashboardUserProteccionDispositivo();
          dashboardUserProteccionDispositivo.name = dashboardUser.name;
          dashboardUserProteccionDispositivo.surname = dashboardUser.surname;
          dashboardUserProteccionDispositivo.deviceDesktop = -1;
          dashboardUserProteccionDispositivo.deviceMobile = -1;
          dashboardUserProteccionDispositivo.latestScan = this.minDate;
          dashboardUserProteccionDispositivo.profileImage = dashboardUser.profileImage;
          dashboardUserProteccionDispositivo.isActive = dashboardUser.isActive;
          dashboardUserProteccionDispositivo.isAdmin = dashboardUser.isAdmin;

          dashboardUserSeguridadUsuario = new DashboardUserSeguridadUsuario();
          dashboardUserSeguridadUsuario.name = dashboardUser.name;
          dashboardUserSeguridadUsuario.surname = dashboardUser.surname;
          dashboardUserSeguridadUsuario.profileImage = dashboardUser.profileImage;
          dashboardUserSeguridadUsuario.isActive = dashboardUser.isActive;
          dashboardUserSeguridadUsuario.isAdmin = dashboardUser.isAdmin;
          dashboardUserSeguridadUsuario.dangerAlerts = 0;
          dashboardUserSeguridadUsuario.koAlerts = 0;
          dashboardUserSeguridadUsuario.isNotification = false;

          dashboardUserProteccionRed = new DashboardUserProteccionRed();
          dashboardUserProteccionRed.id = dashboardUser.id;
          dashboardUserProteccionRed.name = dashboardUser.name;
          dashboardUserProteccionRed.surname = dashboardUser.surname;
          dashboardUserProteccionRed.profileImage = dashboardUser.profileImage;
          dashboardUserProteccionRed.isActive = dashboardUser.isActive;
          dashboardUserProteccionRed.isAdmin = dashboardUser.isAdmin;
          dashboardUserProteccionRed.koAlerts = 0;
          dashboardUserProteccionRed.dangerAlerts = 0;
          dashboardUserProteccionRed.createDate = this.minDate;
          dashboardUserProteccionRed.dangerAlertsDate = this.minDate;
          dashboardUserProteccionRed.koAlertsDate = this.minDate;

          if (dashboardUser.devices && dashboardUser.devices.length > 0) {
            dashboardUserProteccionDispositivo.deviceDesktop = 0;
            dashboardUserProteccionDispositivo.deviceMobile = 0;
            dashboardUserProteccionDispositivo.deviceAlertHigh = 0;
            dashboardUserProteccionDispositivo.deviceCheck = 0;

            for (let j = 0; j < dashboardUser.devices.length; j++) {
              device = dashboardUser.devices[j];

              if (device.os == "windows" || device.os == "osx")
                dashboardUserProteccionDispositivo.deviceDesktop++;
              else dashboardUserProteccionDispositivo.deviceMobile++;

              if (dashboardUser.isMsp) {
                alertmsp = 0;
                if (device.tasks != null && device.tasks.length > 0) {
                  dateScanned = this.minDate;
                  for (let task of device.tasks) {
                    alertmsp += task.filesUnresolved;
                    dateLast = new Date(task.dt);
                    dateScanned = dateLast > dateScanned ? dateLast : dateScanned;
                  }
                  dashboardUserProteccionDispositivo.deviceAlertHigh += alertmsp;
                  dashboardUserProteccionDispositivo.latestScan = dateScanned > dashboardUserProteccionDispositivo.latestScan ? dateScanned : dashboardUserProteccionDispositivo.latestScan;

                  this.deviceProtectionAll.dateLast = dashboardUserProteccionDispositivo.latestScan > this.deviceProtectionAll.dateLast ? dashboardUserProteccionDispositivo.latestScan : this.deviceProtectionAll.dateLast;
                }
              }
              else {
                device.qsDate = device.qsDate != null ? new Date(device.qsDate) : this.minDate;
                device.fsDate = device.fsDate != null ? new Date(device.fsDate) : this.minDate;

                if (device.fsDate > device.qsDate) {
                  if (device.fsUnresolved != 0) dashboardUserProteccionDispositivo.deviceAlertHigh++;
                  else dashboardUserProteccionDispositivo.deviceCheck++;
                  dateScanned = device.fsDate;
                }
                else if (device.fsDate < device.qsDate) {
                  if (device.qsUnresolved != 0) dashboardUserProteccionDispositivo.deviceAlertHigh++;
                  else dashboardUserProteccionDispositivo.deviceCheck++;
                  dateScanned = device.qsDate;
                }
                else if (device.fsDate === device.qsDate) // Show as bitdefender service as no error
                {

                }
                else
                  dashboardUserProteccionDispositivo.deviceAlertHigh++;


                if (dateScanned) {
                  dashboardUserProteccionDispositivo.latestScan = dateScanned > dashboardUserProteccionDispositivo.latestScan ? dateScanned : dashboardUserProteccionDispositivo.latestScan;
                  this.deviceProtectionAll.dateLast = dashboardUserProteccionDispositivo.latestScan > this.deviceProtectionAll.dateLast ? dashboardUserProteccionDispositivo.latestScan : this.deviceProtectionAll.dateLast;
                }
              }

              if (dashboardUser.isAdmin) {
                this.deviceProtectionSingle.devices = dashboardUserProteccionDispositivo.deviceDesktop + dashboardUserProteccionDispositivo.deviceMobile;
                this.deviceProtectionSingle.dateLast = dashboardUserProteccionDispositivo.latestScan;
                this.deviceProtectionSingle.alerts = dashboardUserProteccionDispositivo.deviceAlertHigh;
              }
            }
            this.deviceProtectionAll.devices += dashboardUserProteccionDispositivo.deviceDesktop + dashboardUserProteccionDispositivo.deviceMobile;
            this.deviceProtectionAll.alerts += dashboardUserProteccionDispositivo.deviceAlertHigh;
          }

          //acronis, se muestra las alertas y fechas de criticidad 3 y 4 sobre las de criticidad 2
          if (dashboardUser.isAcronis) {
            dashboardUserSeguridadUsuario.wksInstalled = dashboardUser.acronis.wksInstalled;
            dashboardUserSeguridadUsuario.mobInstalled = dashboardUser.acronis.mobInstalled;
            dashboardUserSeguridadUsuario.spacedUsed = BytesValidator.GetSpaceWithDecimals(dashboardUser.acronis.spacedUsed);
            auxAcronisData += dashboardUser.acronis.spacedUsed;
            dashboardUserSeguridadUsuario.dangerAlertsDate = this.minDate;
            dashboardUserSeguridadUsuario.koAlertsDate = this.minDate;
            this.backupAll.licences += 1;

            if (dashboardUser.acronis.events) {
              for (let ev of dashboardUser.acronis.events) {
                dateLast = new Date(ev.notificationDate);
                if (ev.criticity == 2) {
                  dashboardUserSeguridadUsuario.dangerAlerts++;
                  dashboardUserSeguridadUsuario.dangerAlertsDate = dateLast > dashboardUserSeguridadUsuario.dangerAlertsDate ? dateLast : dashboardUserSeguridadUsuario.dangerAlertsDate;
                }
                else if (ev.criticity == 3 || ev.criticity == 4) {
                  dashboardUserSeguridadUsuario.koAlerts++;
                  dashboardUserSeguridadUsuario.koAlertsDate = dateLast > dashboardUserSeguridadUsuario.koAlertsDate ? dateLast : dashboardUserSeguridadUsuario.koAlertsDate;
                }
                else {
                  dashboardUserSeguridadUsuario.okAlertsDate = dateLast > dashboardUserSeguridadUsuario.okAlertsDate ? dateLast : dashboardUserSeguridadUsuario.okAlertsDate;
                }
                dashboardUserSeguridadUsuario.isNotification = true;
              }
              this.backupAll.okAlertsDate = dashboardUserSeguridadUsuario.okAlertsDate > this.backupAll.okAlertsDate ? dashboardUserSeguridadUsuario.okAlertsDate : this.backupAll.okAlertsDate;
              this.backupAll.dangerAlertsDate = dashboardUserSeguridadUsuario.dangerAlertsDate > this.backupAll.dangerAlertsDate ? dashboardUserSeguridadUsuario.dangerAlertsDate : this.backupAll.dangerAlertsDate;
              this.backupAll.koAlertsDate = dashboardUserSeguridadUsuario.koAlertsDate > this.backupAll.koAlertsDate ? dashboardUserSeguridadUsuario.koAlertsDate : this.backupAll.koAlertsDate;
              this.backupAll.dangerAlerts += dashboardUserSeguridadUsuario.dangerAlerts;
              this.backupAll.koAlerts += dashboardUserSeguridadUsuario.koAlerts;
            }
            if (!this.backupAll.isNotification) {
              this.backupAll.isNotification = (this.backupAll.dangerAlerts + this.backupAll.koAlerts) > 0;
            }
            if (dashboardUserSeguridadUsuario.isAdmin) {
              this.backupSingle.isNotification = (dashboardUserSeguridadUsuario.dangerAlerts + dashboardUserSeguridadUsuario.koAlerts) > 0;
              this.backupSingle.spacedUsed = BytesValidator.GetSpaceWithDecimals(dashboardUser.acronis.spacedUsed);
              this.backupSingle.spaceAssigned = BytesValidator.GetSpaceWithDecimals(dashboardUser.acronis.spaceAssigned);
              this.backupSingle.koAlerts = dashboardUserSeguridadUsuario.koAlerts;
              this.backupSingle.dangerAlerts = dashboardUserSeguridadUsuario.dangerAlerts;
              this.backupSingle.dangerDate = dashboardUserSeguridadUsuario.dangerAlertsDate;
              this.backupSingle.koDate = dashboardUserSeguridadUsuario.koAlertsDate;
              this.backupSingle.okDate = dashboardUserSeguridadUsuario.okAlertsDate;
              this.backupSingle.backupPercent = ((dashboardUser.acronis.spacedUsed * 100) / dashboardUser.acronis.spaceAssigned);
              this.backupSingle.licences += 1;
            }
          }
          else {
            dashboardUserSeguridadUsuario.wksInstalled = "-";
            dashboardUserSeguridadUsuario.mobInstalled = "-";
            dashboardUserSeguridadUsuario.spacedUsed = "-";
          }

          //tarjetas
          dashboardUserSeguridadUsuario.cardLength = 0;

          if (dashboardUser.cards) {
            dashboardUserSeguridadUsuario.cardAlertHigh = 0;
            dashboardUserSeguridadUsuario.lastAnalysisDateCard = this.minDate;
            dashboardUserSeguridadUsuario.cardLength = dashboardUser.cards.length;
            dateLast = undefined;
            for (let j = 0; j < dashboardUserSeguridadUsuario.cardLength; j++) {
              if (dashboardUser.cards[j].detection)
                dashboardUserSeguridadUsuario.cardAlertHigh++;

              if (dashboardUser.cards[j].lastAnalysisDate != null)
                dateLast = new Date(dashboardUser.cards[j].lastAnalysisDate);

              if (dateLast != undefined) {
                dashboardUserSeguridadUsuario.lastAnalysisDateCard = dateLast > dashboardUserSeguridadUsuario.lastAnalysisDateCard ? dateLast : dashboardUserSeguridadUsuario.lastAnalysisDateCard;
              }
              this.CreditCardAll.cards++;
            }

            this.CreditCardAll.alertsDate = dashboardUserSeguridadUsuario.lastAnalysisDateCard > this.CreditCardAll.alertsDate ? dashboardUserSeguridadUsuario.lastAnalysisDateCard : this.CreditCardAll.alertsDate;
            this.CreditCardAll.alerts += dashboardUserSeguridadUsuario.cardAlertHigh;
            if (dashboardUserSeguridadUsuario.isAdmin) {
              this.CreditCardSingle.cards = dashboardUserSeguridadUsuario.cardLength;
              this.CreditCardSingle.alerts = dashboardUserSeguridadUsuario.cardAlertHigh;
              this.CreditCardSingle.alertsDate = dashboardUserSeguridadUsuario.lastAnalysisDateCard;
            }
          }

          //identidad
          dashboardUserSeguridadUsuario.identitiesLength = 0;
          if (dashboardUser.identities) {
            dashboardUserSeguridadUsuario.identityAlertHigh = 0;
            dashboardUserSeguridadUsuario.lastAnalysisDateIdentity = this.minDate;
            dashboardUserSeguridadUsuario.identitiesLength = dashboardUser.identities.length;
            dateLast = undefined;
            for (let j = 0; j < dashboardUserSeguridadUsuario.identitiesLength; j++) {
              if (dashboardUser.identities[j].lastAnalysisDate != null)
                dateLast = new Date(dashboardUser.identities[j].lastAnalysisDate);

              if (dateLast != undefined) {
                dashboardUserSeguridadUsuario.lastAnalysisDateIdentity = dateLast > dashboardUserSeguridadUsuario.lastAnalysisDateIdentity ? dateLast : dashboardUserSeguridadUsuario.lastAnalysisDateIdentity;
              }
              if (dashboardUser.identities[j].alertLength > 0) {
                dashboardUserSeguridadUsuario.identityAlertHigh += dashboardUser.identities[j].alertLength;
              }
              this.CredentialsAll.credentials++;
            }
            this.CredentialsAll.alerts += dashboardUserSeguridadUsuario.identityAlertHigh;
            this.CredentialsAll.alertsDate = dashboardUserSeguridadUsuario.lastAnalysisDateIdentity > this.CredentialsAll.alertsDate ? dashboardUserSeguridadUsuario.lastAnalysisDateIdentity : this.CredentialsAll.alertsDate;
            if (dashboardUserSeguridadUsuario.isAdmin) {
              this.CredentialsSingle.credentials = dashboardUserSeguridadUsuario.identitiesLength;
              this.CredentialsSingle.alerts = dashboardUserSeguridadUsuario.identityAlertHigh;
              this.CredentialsSingle.alertsDate = dashboardUserSeguridadUsuario.lastAnalysisDateIdentity;
            }
          }

          //Fractel
          if (dashboardUser.lstFractel != null) {
            const n = dashboardUser.lstFractel.length;
            dashboardUserProteccionRed.devicesLength += n;
            let FractelData;
            dateLast = this.minDate;
            let auxDangerDate = this.minDate;
            let auxKoDate = this.minDate;
            let adminDate = this.minDate;
            for (let i = 0; i < n; i++) {
              FractelData = dashboardUser.lstFractel[i];
              if (FractelData.memoryUsedPercent > 90) {
                if (dashboardUserProteccionRed.isAdmin) this.NetProtectionSingle.alerts += 1
                dashboardUserProteccionRed.koAlerts++;
                auxKoDate = new Date(FractelData.createDate)
              } else if (FractelData.hDiskUsedPercent > 90) {
                if (dashboardUserProteccionRed.isAdmin) this.NetProtectionSingle.alerts += 1
                dashboardUserProteccionRed.koAlerts++;
                auxKoDate = new Date(FractelData.createDate)
              } else if (FractelData.memoryUsedPercent > 80) {
                if (dashboardUserProteccionRed.isAdmin) this.NetProtectionSingle.dangerAlerts += 1
                dashboardUserProteccionRed.dangerAlerts++;
                auxDangerDate = new Date(FractelData.createDate)
              } else if (FractelData.hDiskUsedPercent > 80) {
                if (dashboardUserProteccionRed.isAdmin) this.NetProtectionSingle.dangerAlerts += 1
                dashboardUserProteccionRed.dangerAlerts++;
                auxDangerDate = new Date(FractelData.createDate)
              }

              dateLast = new Date(FractelData.createDate);
              dashboardUserProteccionRed.createDate = dateLast > dashboardUserProteccionRed.createDate ? dateLast : dashboardUserProteccionRed.createDate;
              dashboardUserProteccionRed.dangerAlertsDate = auxDangerDate > dashboardUserProteccionRed.dangerAlertsDate ? auxDangerDate : dashboardUserProteccionRed.dangerAlertsDate
              dashboardUserProteccionRed.koAlertsDate = auxKoDate > dashboardUserProteccionRed.koAlertsDate ? auxKoDate : dashboardUserProteccionRed.koAlertsDate
              if (dashboardUserProteccionRed.isAdmin)
                adminDate = dateLast > adminDate ? dateLast : adminDate
            }
            if (dashboardUserProteccionRed.isAdmin) {
              this.NetProtectionSingle.devices = n;
              this.NetProtectionSingle.alertsDate = dashboardUserProteccionRed.createDate;
            }
            this.NetProtectionAll.devices += n
            this.NetProtectionAll.dateLast = dashboardUserProteccionRed.createDate > this.NetProtectionAll.dateLast ? dashboardUserProteccionRed.createDate : this.NetProtectionAll.dateLast;
            this.NetProtectionAll.dangerAlertsDate = dashboardUserProteccionRed.dangerAlertsDate > this.NetProtectionAll.dangerAlertsDate ? dashboardUserProteccionRed.dangerAlertsDate : this.NetProtectionAll.dangerAlertsDate;
            this.NetProtectionAll.koAlertsDate = dashboardUserProteccionRed.koAlertsDate > this.NetProtectionAll.koAlertsDate ? dashboardUserProteccionRed.koAlertsDate : this.NetProtectionAll.koAlertsDate;
            this.NetProtectionAll.dangerAlerts += dashboardUserProteccionRed.dangerAlerts;
            this.NetProtectionAll.alerts += dashboardUserProteccionRed.koAlerts;

          }

          //Acunetix
          if (dashboardUser.acunetix) {
            this.VulnerabilitiesAll.isAcunetix = true;
            let dateLast = new Date(dashboardUser.acunetix.reportGenerated)
            if (dashboardUser.isAdmin) {
              this.VulnerabilitiesPageSingle.alerts = dashboardUser.acunetix.reportAlertsHigh;
              this.VulnerabilitiesPageSingle.dangerAlerts = dashboardUser.acunetix.reportAlertsMedium;
              this.VulnerabilitiesPageSingle.alertsDate = dateLast;
              this.VulnerabilitiesPageSingle.isAcunetix = true;
            }

            this.VulnerabilitiesAll.alerts += dashboardUser.acunetix.reportAlertsHigh
            this.VulnerabilitiesAll.dangerAlerts += dashboardUser.acunetix.reportAlertsMedium
            if (dashboardUser.acunetix.reportAlertsMedium && dashboardUser.acunetix.reportAlertsMedium > 0)
              this.VulnerabilitiesAll.dangerAlertsDate = dateLast > this.VulnerabilitiesAll.dangerAlertsDate ?
                dateLast : this.VulnerabilitiesAll.dangerAlertsDate;
            if (dashboardUser.acunetix.reportAlertsHigh && dashboardUser.acunetix.reportAlertsHigh > 0)
              this.VulnerabilitiesAll.alertsDate = dateLast > this.VulnerabilitiesAll.alertsDate ?
                dateLast : this.VulnerabilitiesAll.alertsDate;
            this.VulnerabilitiesAll.dateLast = dateLast > this.VulnerabilitiesAll.dateLast ?
              dateLast : this.VulnerabilitiesAll.dateLast;

          }

          this.listDashboardUserSeguridadUsuario.push(dashboardUserSeguridadUsuario);
          this.listDashboardUserProteccionDispositivo.push(dashboardUserProteccionDispositivo);
          this.listDashboardUserProteccionRed.push(dashboardUserProteccionRed);
        }
        this.backupAll.spacedUsed = BytesValidator.GetSpaceWithDecimals(auxAcronisData);

        for(let s of this.serviceService.userServices){
          if(s.typeCode=="CPR" || s.typeCode=="BMS") this.deviceProtectionName = s.name;
          else if(s.typeCode=="CAC") this.backupName=s.name;
          else if(s.typeCode=="CIT") this.CreditCardName=s.name;
          else if(s.typeCode=="CII") this.CredentialName =s.name;
          else if(s.typeCode=="CFR") this.NetProtectionName =s.name;
          else if(s.typeCode=="ACU") this.VulnerabilitiesName=s.name;
        }

      }
    });
  }
}
