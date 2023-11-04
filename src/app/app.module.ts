import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/common/header/header.component';
import { HeaderIntegratedComponent } from './components/common/header-integrated/header-integrated.component';
import { ServiceHeaderComponent } from './components/common/service-header/service-header.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { MessagesComponent } from './components/common/messages/messages.component';
import { LayoutComponent } from './components/common/layout/layout.component';
import { LandingComponent } from './components/custom/landing/landing.component';
import { MessageService } from './services/message.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxPaginationModule } from 'ngx-pagination';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { FormComponent } from './components/custom/form/form.component';
import { ChatComponent } from './components/custom/chat/chat.component';
import { AgentComponent } from './components/custom/agent/agent.component';
import { ChatService } from './services/chat.service';
import { AppConfigModule } from './app-config.module';
import { SuiteService } from './services/suite.service';
import { ServicesComponent } from './components/custom/services/services.component';
import { environment } from '../environments/environment';
import { CallbackPipe } from './pipes/callback.pipe';
import { ChatFormComponent } from './components/common/chat-form/chat-form.component';
import { SafePipe } from './pipes/safe.pipe';
import { OfflineComponent } from './components/common/offline/offline.component';
import { PartnerService } from './services/partner.service';
import { ProfileComponent } from './components/custom/profile/profile.component';
import { AddUserComponent } from './components/custom/add-user/add-user.component';
import { TermsComponent } from './components/custom/terms/terms.component';
import { CustomDatePipe } from './pipes/custom.datepipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DigitalLifeComponent } from './components/custom/digital-life/digital-life.component';
import { CertificateComponent } from './components/custom/certificate/certificate.component';
import { InternetComponent } from './components/custom/internet/internet.component';
import { DigitalContactComponent} from './components/custom/digitalcontact/digitalcontact.component'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LicenseComponent } from './components/custom/license/license.component';
import { LicenseinternetComponent } from './components/custom/licenseinternet/licenseinternet.component';
import { ExternalLicenseComponent } from './components/custom/externallicense/externallicense.component';
import { InformationComponent } from './components/custom/information/information.component';
import { UserListComponent } from './components/custom/user-list/user-list.component';
import { EditUserComponent } from './components/custom/edit-user/edit-user.component';
import { ModalComponent } from './components/custom/modal/modal.component';
import { DeleteUserModalComponent } from './components/custom/deleteusermodal/deleteusermodal.component';
import { BackupComponent } from './components/custom/backup/backup.component';
import { InfoModalComponent } from './components/custom/infomodal/infomodal.component';
import { RecoverpasswordComponent } from './components/custom/recoverpassword/recoverpassword.component';
import { ActivateUserComponent } from 'src/app/components/custom/activate-user/activate-user.component';
import { AutomaticActivationComponent } from 'src/app/components/custom/automatic-activation/automatic-activation.component';
import { MonitoredCardsComponent } from './components/custom/cyberalarm/monitored-cards/monitored-cards.component';
import { MonitoredIdentitiesComponent } from './components/custom/cyberalarm/monitored-identities/monitored-identities.component';
import { BackupCiberComponent } from './components/cibersecurity/backup-ciber/backup-ciber.component';
import { LanAnalyzerComponent } from './components/cibersecurity/lan-analyzer/lan-analyzer.component';
import { ProtectionComponent } from './components/cibersecurity/protection/protection.component';
import { FilterPipe } from './pipes/filter.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChartsModule } from 'ng2-charts';
import { PentestingComponent } from './components/cibersecurity/pentesting/pentesting.component';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from "ng-recaptcha";
import { SignupComponent } from './components/custom/signup/signup.component';
import { ResetpasswordComponent } from './components/custom/resetpassword/resetpassword.component';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { PasswordStrengthComponent } from './components/common/password-strength/password-strength.component';
import { Office365Component } from './components/custom/office365/office365.component';
import { ExpertConnectionComponent } from './components/custom/expert-connection/expert-connection.component';
import { DigitalLegacyComponent } from './components/custom/externalapp-digital-legacy/digital-legacy.component';
import { PolicyCookiesComponent } from './components/custom/policy-cookies/policy-cookies.component';
import { PolicyPrivacyComponent } from './components/custom/policy-privacy/policy-privacy.component';
import { ChatmodalComponent } from './components/custom/chatmodal/chatmodal.component';
import { BitdefendermspComponent } from './components/custom/bitdefendermsp/bitdefendermsp.component';
import { CallmebackComponent } from './components/custom/callmeback/callmeback.component';
import { DesactiveservicemodalComponent } from './components/custom/desactiveservicemodal/desactiveservicemodal.component';
import { MonitoredCardsIntegratedComponent } from './components/custom/cyberalarm/monitored-cards-integrated/monitored-cards-integrated.component';
import { MonitoredIdentitiesIntegratedComponent } from './components/custom/cyberalarm/monitored-identities-integrated/monitored-identities-integrated.component';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { CyberscoringComponent } from './components/custom/cyberscoring/cyberscoring.component';
import { CybersecurityQuestionsComponent } from './components/custom/cybersecurity-questions/cybersecurity-questions.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { BitdefendermodalComponent } from './components/custom/bitdefendermodal/bitdefendermodal.component';
import { MspmodalComponent } from './components/custom/automatic-activation/help-modal/msp-modal/mspmodal.component';
import { AcronismodalComponent } from './components/custom/automatic-activation/help-modal/acronis-modal/acronismodal.component';
import { GeolocalizacionComponent } from './components/custom/geolocalizacion/geolocalizacion.component';
import { NavegacionseguraComponent } from './components/custom/navegacionsegura/navegacionsegura.component';
import { AttacksimulatorIntegratedComponent } from './components/custom/attacksimulator-integrated/attacksimulator-integrated.component';
import { NavegacionseguraIntegratedComponent } from './components/custom/navegacionsegura-integrated/navegacionsegura-integrated.component';
import { GeolocalizacionIntegratedComponent } from './components/custom/cyberalarm/geolocalizacion-integrated/geolocalizacion-integrated.component';
import { EmailsimulatorformComponent } from './components/custom/emailsimulatorform/emailsimulatorform.component';
import { GravityIntegratedComponent } from './components/custom/gravity-integrated/gravity-integrated.component';
import { GravityComponent } from './components/custom/gravity/gravity.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CallComponent } from './components/common/call/call.component';
import { FilterSkillPipe } from './pipes/filter-skill.pipe';
import { DynamicRenderComponentModule } from './dynamic-render/dynamic-render-component.module';
import { NzSpinnerModule } from './components/common/nz-spinner/nz-spinner.module';
import { TabsModule } from './components/tabs/tabs.module';
import { FraTabsModule } from './components/fra-tabs/fra-tabs.module';
import { OwnNotificationComponent } from './components/common/header-integrated/notifications/own-notification/own-notification.component';
import { UserNotificationComponent } from './components/common/header-integrated/notifications/user-notification/user-notification.component';
import { SupportNotificationComponent } from './components/common/header-integrated/notifications/support-notification/support-notification.component';
import { SliderModule } from './components/slider/slider.module';
import { CbyFreemiumAlertModule } from './components/cby-freemium-alert/cby-freemium-alert.module';

registerLocaleData(es);

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

export function partnerInitializer(appInitService: PartnerService) {
  return (): Promise<any> => {
    return appInitService.Init();
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.translatePath);
  //return new TranslateHttpLoader(http, './assets/i18n/');
}

@NgModule({
  declarations: [
    AppComponent,
    TermsComponent,
    HeaderComponent,
    HeaderIntegratedComponent,
    ServiceHeaderComponent,
    FooterComponent,
    MessagesComponent,
    LayoutComponent,
    LandingComponent,
    SignupComponent,
    ResetpasswordComponent,
    FormComponent,
    ChatComponent,
    AgentComponent,
    ServicesComponent,
    CallbackPipe,
    ChatFormComponent,
    SafePipe,
    OfflineComponent,
    ProfileComponent,
    AddUserComponent,
    UserListComponent,
    EditUserComponent,
    CustomDatePipe,
    DigitalLifeComponent,
    EmailsimulatorformComponent,
    CertificateComponent,
    InternetComponent,
    DigitalContactComponent,
    LicenseComponent,
    LicenseinternetComponent,
    ExternalLicenseComponent,
    InformationComponent,
    ModalComponent,
    DeleteUserModalComponent,
    InfoModalComponent,
    BackupComponent,
    RecoverpasswordComponent,
    ActivateUserComponent,
    AutomaticActivationComponent,
    CyberscoringComponent,
    CybersecurityQuestionsComponent,
    MonitoredCardsComponent,
    MonitoredCardsIntegratedComponent,
    MonitoredIdentitiesComponent,
    MonitoredIdentitiesIntegratedComponent,
    BackupCiberComponent,
    LanAnalyzerComponent,
    ProtectionComponent,
    FilterPipe,
    PentestingComponent,
    PasswordStrengthComponent,
    Office365Component,
    ExpertConnectionComponent,
    DigitalLegacyComponent,
    PolicyCookiesComponent,
    PolicyPrivacyComponent,
    ChatmodalComponent,
    BitdefendermspComponent,
    BitdefendermodalComponent,
    MspmodalComponent,
    AcronismodalComponent,
    CallmebackComponent,
    DesactiveservicemodalComponent,
    GeolocalizacionComponent,
    NavegacionseguraComponent,
    AttacksimulatorIntegratedComponent,
    NavegacionseguraIntegratedComponent,
    GeolocalizacionIntegratedComponent,
    GravityComponent,
    GravityIntegratedComponent,
    CallComponent,
    FilterSkillPipe,
    SupportNotificationComponent,
    UserNotificationComponent,
    OwnNotificationComponent
  ],
  entryComponents: [
    ModalComponent,
    DeleteUserModalComponent,
    InfoModalComponent,
  ],
  imports: [
    NgbModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    DragDropModule,
    NgSelectModule,
    FormsModule,
    NgxPaginationModule,
    AppConfigModule,
    NgxGaugeModule,
    ChartsModule,
    AngularDualListBoxModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ServiceWorkerModule.register('sw.js', { scope: '/suite/' ,enabled: environment.production, registrationStrategy: 'registerImmediately' }),
    RecaptchaV3Module,
    NzSpinModule,
    NzStepsModule,
    CKEditorModule,
    DynamicRenderComponentModule,
    NzSpinnerModule,
    TabsModule,
    FraTabsModule,
    SliderModule,
    CbyFreemiumAlertModule
  ],
  providers: [
    MessageService,
    NgbActiveModal,
    CookieService,
    ModalComponent,
    ChatService,
    DatePipe,
    SuiteService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: partnerInitializer, deps: [PartnerService], multi: true },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: "6LcQKUsaAAAAAEm58xRN6A2dIHZnzDcd3Lmv_K_m" },
    { provide: NZ_I18N, useValue: es }, { provide: NZ_ICONS, useValue: icons }
  ],
  bootstrap: [AppComponent],
  exports: [
    TranslateModule
  ]
})
export class AppModule { }
