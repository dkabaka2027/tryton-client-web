import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';

import { AuthGuard } from './services/auth.guard.service';

import {AuthComponent} from './pages/auth/auth.component';
import {LoginComponent} from './pages/auth/login/login.component';
import {LogoutComponent} from './pages/auth/logout/logout.component';
import {RegisterComponent} from './pages/auth/register/register.component';
import {RequestComponent} from './pages/auth/request/request.component';
import {ResetComponent} from './pages/auth/reset/reset.component';


const routes: Routes = [
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => import('app/pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      }, {
        path: 'login',
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
      }
    ],
    // loadChildren: () => import('app/pages/auth/auth.module')
    //  .then(m => m.AuthModule),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'auth'
  },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
