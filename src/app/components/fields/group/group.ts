import { Component } from '@angular/core';

@Component({
	selector: 'group',
	styleUrls: ['./group.scss'],
	template: `
		<fieldset>
			<ng-content></ng-content>
		</fieldset>
	`
})
export class GroupComponent {

	constructor() {
		
	}

}