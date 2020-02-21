import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { DashboardFormComponent } from './dashboard/form/dashboard.form.component';
import { DashboardListComponent } from './dashboard/list/dashboard.list.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: '',
      component: DashboardComponent,
      children: [
        {
          path: '',
          component: DashboardListComponent
        },
        {
          path: 'dashboard/edit/:id',
          component: DashboardFormComponent
        },
        {
          path: 'dashboard/create',
          component: DashboardFormComponent
        }
      ]
    },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },
    {
      path: 'model',
      loadChildren: () => import('./entity/entity.module')
        .then(m => m.EntityModule),
    },
    {
      path: 'profile',
      component: ProfileComponent
    },
    {
      path: '',
      redirectTo: '',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
