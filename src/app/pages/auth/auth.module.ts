import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthRoutingModule, routedComponents } from './auth-routing.module';

import { NbAlertModule, NbButtonModule, NbCheckboxModule, NbInputModule, NbSelectModule } from '@nebular/theme';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { RequestComponent } from './request/request.component';
import { ResetComponent } from './reset/reset.component';

import { 
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';

const components = [
  AuthComponent,
  LoginComponent,
  LogoutComponent,
  RegisterComponent,
  RequestComponent,
  ResetComponent,
];

@NgModule({
  imports: [
    AuthRoutingModule,
    ThemeModule,
    CommonModule,
    FormsModule,
    NbAlertModule,
    NbButtonModule,
    NbCheckboxModule,
    NbInputModule,
    NbSelectModule
  ],
  declarations: [...components],
})
export class AuthModule {}