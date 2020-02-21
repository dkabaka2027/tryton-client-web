import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
	selector: 'selection',
  templateUrl: './selection.dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionDialogComponent {}