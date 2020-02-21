import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'entity-form',
  styleUrls: ['./entity.form.component.scss'],
  templateUrl: './entity.form.component.html',
})
export class EntityFormComponent implements OnInit, OnDestroy {

	id: number;
	model: string;
	sub: Subscription;

	constructor(private route: ActivatedRoute) {}


	ngOnInit() {
		this.sub = this.route.parent.paramMap.subscribe(params => {
			this.model = params.get('model');
			this.id = +params.get('id');
			console.log(this.model, params.get('model'), this.id, params.get('id'),  params);
		});
		return;
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
		return;
	}

}