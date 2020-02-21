import { Component } from '@angular/core';
import { NbResetPasswordComponent } from '@nebular/auth';

@Component({
  selector: 'reset-password',
  templateUrl: './reset.component.html',
})
export class ResetComponent extends NbResetPasswordComponent {
}