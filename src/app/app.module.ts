/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './pages/auth/auth.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { LogoutComponent } from './pages/auth/logout/logout.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { RequestComponent } from './pages/auth/request/request.component';
import { ResetComponent } from './pages/auth/reset/reset.component';
import { AppRoutingModule } from './app-routing.module';
import { LockerModule, LockerConfig, DRIVERS } from 'angular-safeguard';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
  NbTabsetModule,
  NbRadioModule,
  NbIconModule,
  NbAccordionModule
} from '@nebular/theme';

import { NbEvaIconsModule } from '@nebular/eva-icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { TrytonInterceptor } from './services/session';
import { AuthGuard } from './services/auth.guard.service';

import { GridsterModule } from 'angular-gridster2';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardFormComponent } from './pages/dashboard/form/dashboard.form.component';
import { DashboardListComponent } from './pages/dashboard/list/dashboard.list.component';

import { NbAlertModule, NbButtonModule, NbCheckboxModule, NbInputModule, NbSelectModule } from '@nebular/theme';

const lockerConfig: LockerConfig = {
  driverNamespace: '',
  driverFallback: [DRIVERS.LOCAL, DRIVERS.SESSION, DRIVERS.COOKIE],
  namespaceSeparator: '_'
};

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    RequestComponent,
    ResetComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    NgSelectModule,

    AgmCoreModule.forRoot({
      apiKey: '',
      libraries: ['places']
    }),
    GridsterModule,

    ThemeModule.forRoot(),

    LockerModule.withConfig(lockerConfig),

    CommonModule,
    FormsModule,
    NbAlertModule,
    NbButtonModule,
    NbCheckboxModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbDatepickerModule.forRoot(),
    NbEvaIconsModule,
    NbIconModule,

    NbAccordionModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    NbTabsetModule,
    CoreModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TrytonInterceptor,
      multi: true
    },
    AuthGuard
  ]
})
export class AppModule {
}
