import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { RequestComponent } from './request/request.component';
import { ResetComponent } from './reset/reset.component';

const routes: Routes = [{
  path: '',
  component: AuthComponent,
  children: [{
    path: '',
    component: LoginComponent,
  }, {
    path: 'logout',
    component: LogoutComponent,
  }, {
    path: 'register',
    component: RegisterComponent,
  }, {
    path: 'reset-password',
    component: ResetComponent,
  }, {
    path: 'request-password',
    component: RequestComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }

export const routedComponents = [
  LoginComponent,
  LogoutComponent,
  RegisterComponent,
  RequestComponent,
  ResetComponent
];
