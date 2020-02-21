import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
  NbAlertModule,
  NbTabsetModule,
  NbStepperModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { EntityRoutingModule } from './entity-routing.module';
import { EntityComponent } from './entity.component';
import { EntityListComponent } from './list/entity.list.component';
import { EntityFormComponent } from './form/entity.form.component';
import { EntityViewComponent } from './view/entity.view.component';
import { 
  FcFormComponent,
  TableComponent,
  ViewComponent
} from '../../components/views/index';
import { FormsModule as ngFormsModule } from '@angular/forms';
import {
  BinaryComponent,
  BooleanComponent,
  BoundaryComponent,
  CharComponent,
  DateComponent,
  DateTimeComponent,
  DictComponent,
  FloatComponent,
  GroupComponent,
  IntegerComponent,
  Many2ManyComponent,
  Many2OneComponent,
  NewlineComponent,
  NumericComponent,
  One2ManyComponent,
  One2OneComponent,
  PointComponent,
  ReferenceComponent,
  SelectionComponent,
  TextComponent,
  TimeComponent,
  TimeDeltaComponent,
  NotebookComponent,
  PageComponent,
  WizardComponent
} from '../../components/fields/index';
import { FieldComponent } from '../../components/fields/field.component';

@NgModule({
  imports: [
    ThemeModule,
    NbAlertModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    EntityRoutingModule,
    NbSelectModule,
    NbIconModule,
    ngFormsModule,
    NbTabsetModule,
    NbStepperModule
  ],
  declarations: [
    BinaryComponent,
    BooleanComponent,
    BoundaryComponent,
    CharComponent,
    DateComponent,
    DateTimeComponent,
    DictComponent,
    FieldComponent,
    FloatComponent,
    GroupComponent,
    IntegerComponent,
    Many2ManyComponent,
    Many2OneComponent,
    NewlineComponent,
    NumericComponent,
    One2ManyComponent,
    One2OneComponent,
    PointComponent,
    ReferenceComponent,
    SelectionComponent,
    TextComponent,
    TimeComponent,
    TimeDeltaComponent,
    NotebookComponent,
    PageComponent,
    WizardComponent,
    FcFormComponent,
    TableComponent,
    ViewComponent,
    EntityComponent,
    EntityListComponent,
    EntityFormComponent,
    EntityViewComponent
  ],
  entryComponents: [
    BinaryComponent,
    BooleanComponent,
    BoundaryComponent,
    CharComponent,
    DateComponent,
    DateTimeComponent,
    DictComponent,
    FloatComponent,
    IntegerComponent,
    Many2ManyComponent,
    Many2OneComponent,
    NumericComponent,
    One2ManyComponent,
    One2OneComponent,
    PointComponent,
    ReferenceComponent,
    SelectionComponent,
    TextComponent,
    TimeComponent,
    TimeDeltaComponent,
    NotebookComponent,
    PageComponent,
    WizardComponent,
  ]
})
export class EntityModule { }
