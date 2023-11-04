import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './components/common/layout/layout.component';
import { LandingComponent } from './components/custom/landing/landing.component';
import { MessagesComponent } from './components/common/messages/messages.component';
import { ChatComponent } from './components/custom/chat/chat.component';
import { FormComponent } from './components/custom/form/form.component';
import { AuthGuard } from './guards/auth.guard';
import { ServicesComponent } from './components/custom/services/services.component';
import { AgentComponent } from './components/custom/agent/agent.component';
import { OfflineComponent } from './components/common/offline/offline.component';
import { ProfileComponent } from './components/custom/profile/profile.component';
import { AddUserComponent } from './components/custom/add-user/add-user.component';
import { TermsComponent } from './components/custom/terms/terms.component';
import { DigitalLifeComponent } from './components/custom/digital-life/digital-life.component';
import { CertificateComponent } from './components/custom/certificate/certificate.component';
import { InternetComponent } from './components/custom/internet/internet.component';
import { ExpertConnectionComponent } from './components/custom/expert-connection/expert-connection.component';
import { LicenseComponent } from './components/custom/license/license.component';
import { LicenseinternetComponent } from './components/custom/licenseinternet/licenseinternet.component';
import { ExternalLicenseComponent } from './components/custom/externallicense/externallicense.component';
import { InformationComponent } from './components/custom/information/information.component';
import { BackupComponent } from './components/custom/backup/backup.component';
import { UserListComponent } from './components/custom/user-list/user-list.component';
import { EditUserComponent } from './components/custom/edit-user/edit-user.component';
import { RecoverpasswordComponent } from './components/custom/recoverpassword/recoverpassword.component';
import { ActivateUserComponent } from './components/custom/activate-user/activate-user.component';
import { AutomaticActivationComponent } from 'src/app/components/custom/automatic-activation/automatic-activation.component';
import { MonitoredCardsComponent } from './components/custom/cyberalarm/monitored-cards/monitored-cards.component';
import { MonitoredIdentitiesComponent } from './components/custom/cyberalarm/monitored-identities/monitored-identities.component';
import { BackupCiberComponent } from './components/cibersecurity/backup-ciber/backup-ciber.component';
import { LanAnalyzerComponent } from './components/cibersecurity/lan-analyzer/lan-analyzer.component';
import { ProtectionComponent } from './components/cibersecurity/protection/protection.component';
import { SignupComponent } from './components/custom/signup/signup.component';
import { ResetpasswordComponent } from './components/custom/resetpassword/resetpassword.component';
import { Office365Component } from './components/custom/office365/office365.component';
import { DigitalLegacyComponent } from './components/custom/externalapp-digital-legacy/digital-legacy.component';
import { PentestingComponent } from './components/cibersecurity/pentesting/pentesting.component';
import { PolicyCookiesComponent } from './components/custom/policy-cookies/policy-cookies.component';
import { PolicyPrivacyComponent } from './components/custom/policy-privacy/policy-privacy.component';
import { BitdefendermspComponent } from './components/custom/bitdefendermsp/bitdefendermsp.component';
import { CyberscoringComponent } from './components/custom/cyberscoring/cyberscoring.component';
import { BitdefendermodalComponent } from './components/custom/bitdefendermodal/bitdefendermodal.component';
import { GeolocalizacionComponent } from './components/custom/geolocalizacion/geolocalizacion.component';
import { NavegacionseguraComponent } from './components/custom/navegacionsegura/navegacionsegura.component';
//import { TranxferComponent } from './components/custom/tranxfer/tranxfer.component';
import { EmailsimulatorformComponent } from './components/custom/emailsimulatorform/emailsimulatorform.component';
import { GravityComponent } from './components/custom/gravity/gravity.component';
import { CybersecurityQuestionsComponent } from './components/custom/cybersecurity-questions/cybersecurity-questions.component';

export const routes: Routes = [
  { path: 'token/:token', component: LandingComponent },
  { path: '', component: LandingComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'resetpassword', component: ResetpasswordComponent },
  { path: 'recoverpassword', component: RecoverpasswordComponent},
  { path: 'activation', component: ActivateUserComponent},
  { path: 'auto-activation', component: AutomaticActivationComponent},
  { path: 'policyCookies', component: PolicyCookiesComponent},
  { path: 'policyPrivacy', component: PolicyPrivacyComponent},
  { path: 'offline', component: OfflineComponent },
  {
    path: '', component: LayoutComponent,
    children: [
      { path: 'services', component: ServicesComponent, canActivate: [AuthGuard] },
      { path: 'messages', component: MessagesComponent },
      { path: 'terms', component: TermsComponent },
      { path: 'chat', component: ChatComponent, canActivate: [AuthGuard]},
      { path: 'agent', component: AgentComponent, canActivate: [AuthGuard]},
      { path: 'form', component: FormComponent, canActivate: [AuthGuard]},
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
      { path: 'user-list', component: UserListComponent, canActivate: [AuthGuard]},
      { path: 'edit-user/:id', component: EditUserComponent, canActivate: [AuthGuard]},
      { path: 'add-user/:AdminUserId', component: AddUserComponent, canActivate: [AuthGuard]},
      { path: 'digital-life', component: DigitalLifeComponent, canActivate: [AuthGuard]},
      { path: 'Emailsimulatorform', component: EmailsimulatorformComponent, canActivate: [AuthGuard]},
      { path: 'certificate', component: CertificateComponent, canActivate: [AuthGuard]},
      { path: 'internet', component: InternetComponent, canActivate: [AuthGuard]},
      { path: 'backup', component: BackupComponent, canActivate: [AuthGuard]},
      { path: 'license', component: LicenseComponent, canActivate: [AuthGuard]},
      { path: 'licenseinternet', component: LicenseinternetComponent, canActivate: [AuthGuard]},
      { path: 'externallicense', component: ExternalLicenseComponent, canActivate: [AuthGuard]},
      { path: 'info', component: InformationComponent, canActivate: [AuthGuard]},
      { path: 'cyberalarm/monitored-cards', component: MonitoredCardsComponent, canActivate: [AuthGuard]},
      { path: 'cyberalarm/monitored-identities', component: MonitoredIdentitiesComponent, canActivate: [AuthGuard]},
      { path: 'backup-ciber', component: BackupCiberComponent, canActivate: [AuthGuard]},
      { path: 'pentesting', component: PentestingComponent, canActivate: [AuthGuard]},
      { path: 'pentesting/:param', component: PentestingComponent, canActivate: [AuthGuard]},
      { path: 'lan-analyzer', component: LanAnalyzerComponent, canActivate: [AuthGuard]},
      { path: 'lan-analyzer/:param', component: LanAnalyzerComponent, canActivate: [AuthGuard]},
      { path: 'protection', component: ProtectionComponent, canActivate: [AuthGuard]},
      { path: 'office365', component: Office365Component, canActivate: [AuthGuard]},
      { path: 'expert-connection', component: ExpertConnectionComponent, canActivate: [AuthGuard]},
      { path: 'gravity', component: GravityComponent, canActivate: [AuthGuard]},
      { path: 'bitdefendermsp', component: BitdefendermspComponent, canActivate: [AuthGuard]},
      { path: 'bitdefendemodal', component: BitdefendermodalComponent, canActivate: [AuthGuard]},
      { path: 'cyberscoring', component: CyberscoringComponent, canActivate: [AuthGuard]},
      { path: 'cyberSurvey', component: CybersecurityQuestionsComponent, canActivate: [AuthGuard]},
      { path: 'navegacionsegura', component: NavegacionseguraComponent, canActivate: [AuthGuard]},
      { path: 'geolocalizacion', component: GeolocalizacionComponent, canActivate: [AuthGuard]},
      { path: 'gravity', component: GravityComponent, canActivate: [AuthGuard]},
      //{ path: 'tranxfer', component: TranxferComponent, canActivate: [AuthGuard]},
      {
        path: 'external-app',
        children: [
          { path: 'digital-legacy', component: DigitalLegacyComponent, canActivate: [AuthGuard] },
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
