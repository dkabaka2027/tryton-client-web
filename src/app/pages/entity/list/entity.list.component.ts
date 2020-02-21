import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'entity-list',
  styleUrls: ['./entity.list.component.scss'],
  templateUrl: './entity.list.component.html',
})
export class EntityListComponent implements OnInit, OnDestroy {

	model: string;
	sub: Subscription;

	constructor(private route: ActivatedRoute) {}


	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			this.model = params['model'];
			console.log(this.model, params['model'], params);
		});
		return;
	}

	ngOnDestroy() {
		return;
	}

}
