import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
	selector: 'download',
  templateUrl: './download.dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadDialogComponent {}