import { Component } from '@angular/core';
import { NbRequestPasswordComponent } from '@nebular/auth';

@Component({
  selector: 'request-password',
  templateUrl: './request.component.html',
})
export class RequestComponent extends NbRequestPasswordComponent {
}