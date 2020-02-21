import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';
import { NbAccordionModule } from '@nebular/theme';
import { NbTabsetModule } from '@nebular/theme';
import { NbInputModule } from '@nebular/theme';
import { NbSelectModule } from '@nebular/theme';
import { NbIconModule } from '@nebular/theme';
import { NbButtonModule } from '@nebular/theme';
import { NbCheckboxModule } from '@nebular/theme';
import { NbDatepickerModule } from '@nebular/theme';

import { NgSelectModule } from '@ng-select/ng-select';

import { FormsModule } from '@angular/forms';

import { ThemeModule } from '../@theme/theme.module';
import { GridsterModule } from 'angular-gridster2';

import { PagesComponent } from './pages.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardFormComponent } from './dashboard/form/dashboard.form.component';
import { DashboardListComponent } from './dashboard/list/dashboard.list.component';

import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    // NbMenuModule,
    NgSelectModule,
    FormsModule,
    NbAccordionModule,
    NbInputModule,
    NbSelectModule,
    NbTabsetModule,
    NbIconModule,
    NbButtonModule,
    NbCheckboxModule,
    GridsterModule,
    ECommerceModule,
    NbDatepickerModule,
    MiscellaneousModule,
  ],
  declarations: [
    PagesComponent,
    ProfileComponent,
    DashboardComponent,
    DashboardFormComponent,
    DashboardListComponent
  ],
})
export class PagesModule {
}
