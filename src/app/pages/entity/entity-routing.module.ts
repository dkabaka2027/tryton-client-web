import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EntityComponent } from './entity.component';
import { EntityListComponent } from './list/entity.list.component';
import { EntityFormComponent } from './form/entity.form.component';
import { EntityViewComponent } from './view/entity.view.component';

const routes: Routes = [
  {
    path: ':model',
    component: EntityComponent,
    children: [
      {
        path: '',
        component: EntityListComponent,
      },
      {
        path: ':id/view',
        component: EntityViewComponent,
      },
      {
        path: ':id/edit',
        component: EntityFormComponent,
      },
      {
        path: 'create',
        component: EntityFormComponent,
      }
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class EntityRoutingModule {
}

