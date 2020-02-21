import { FormControl } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { of as observableOf, fromEvent } from 'rxjs';
import { FormElement } from '../../../services/index';
import { ModelService } from '../../../services/model.service';
import { TrytonResponse } from '../../../services/admin.resources.service';
import { debounceTime, map, distinctUntilChanged, filter } from "rxjs/operators";
import { SearchDialogComponent } from '../../dialogs/search/search.dialog.component';
import { RelationDialogComponent } from '../../dialogs/relation/relation.dialog.component';
import { Component, Input, Output, TemplateRef, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

// TODO: Search Field or New
@Component({
	selector: 'many2one',
	styleUrls: ['./many2one.scss'],
	template: `
		<div class="form-control-group">
			<label *ngIf="field.label" class="label" for="search-{{field.name}}">{{field.string}}</label>
			<input
				*ngIf="field.searchable"
				#search
				nbInput
				fullWidth
				type="text"
				name="search-{{field.name}}"
				placeholder="Search for {{field.string}}..."
				[(ngModel)]="model"
				[value]="payload[data]" />
			<div class="autocomplete" *ngIf="model.length > 3">
				<div *ngIf="isSearching" class="loading" style="display: table; width: 50px; height: 50px; margin: 0; text-align: center;">
					<nb-icon icon="loading" pack="misc" style="display: table-cell; vertical-align: middle; text-align: center;"></nb-icon>
				</div>
				<div *ngIf="!isSearching" class="results">
					<ul *ngFor="let result of results">
						<li *ngFor="let field of fields" (click)="select(result)">{{result[field]}}</li>
					</ul>
					<ul>
						<li><a nbButton fullWidth status="info" size="small" (click)="openSearch(dialogSearch)">Search...</a></li>
					</ul>
					<ul>
						<li><a nbButton fullWidth status="info" size="small" (click)="openCreate(dialogCreate)">Create...</a></li>
					</ul>
				</div>
			</div>
		</div>
	`
})
export class Many2OneComponent implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild('search', {read: ElementRef, static: true}) searchRef: ElementRef;

	@Input() field: FormElement;
	@Input() data: number;

	fields: string[];
	payload: any;

	model: string = '';
	isSearching: boolean = false;
	results: any[] = [];

	constructor(protected modelService: ModelService, protected dialogService: NbDialogService) {
		this.modelService.setModel(this.field.relation);
	}

	ngOnInit() {
		this.getFields();

		
		return;
	}

	ngAfterViewInit() {
		// console.log(this.searchRef);

		fromEvent(this.searchRef.nativeElement, 'keyup').pipe(
			map((event: any) => {
				return event.target.value;
			}),
			filter((res: string) => {
				return res.length > 3;
			}),
			debounceTime(1000),
			distinctUntilChanged()
		).subscribe((val: string) => {
			this.isSearching = true;
			this.search(val);
		});

		return;
	}

	ngOnDestroy() {
		return;
	}

	private getFields() {
		this.modelService.view(false, 'tree')
			.subscribe((res: TrytonResponse) => {
				this.fields = Object.keys(res.result.fields);
			});
	}

	private search(value: string) {
		let domain: any[][] = [
			['rec_name', 'ilike', '%' + this.model + '%']
		];
		JSON.parse(this.field.domain).map((f, i) => {
			domain.push(f);
		});
		this.modelService.search_read(domain, 0, 5, null, this.fields)
			.subscribe((res: TrytonResponse) => {
				this.results = res.result;
				this.isSearching = false;
			});
	}

	private openCreate() {
		this.dialogService.open(RelationDialogComponent, {
			closeOnEsc: true,
			context: {
				data: this.payload,
				field: this.field,
				buttons: false,
				isView: false
			}
		}).onClose.subscribe((res: any) => {
			this.data = +Object.keys(res)[0];
			this.payload = res;
		});
	}

	private openSearch() {
		this.dialogService.open(SearchDialogComponent, {
			closeOnEsc: true,
			context: {
				data: this.data,
				field: this.field,
				isMany: false
			}
		}).onClose.subscribe((res: any) => {
			this.data = +Object.keys(res)[0];
			this.payload = res;
		});
	}

}