import { FormElement } from '../../../services/index';;
import { Component, Input, Output } from '@angular/core';

@Component({
	selector: 'notebook',
	styleUrls: ['./notebook.scss'],
	template: `
		<nb-tabset>
			<ng-content select="page"></ng-content>
		</nb-tabset>
	`
})
export class NotebookComponent {

	@Input() field: FormElement;

	constructor() {}

}