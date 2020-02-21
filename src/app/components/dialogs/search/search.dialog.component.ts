import { NbDialogRef } from '@nebular/theme';
import { of as observableOf, fromEvent } from 'rxjs';
import { FormElement } from '../../../services/index';
import { ModelService } from '../../../services/model.service';
import { TrytonResponse } from '../../../services/admin.resources.service';
import { debounceTime, map, distinctUntilChanged, filter } from "rxjs/operators";
import { Component, Input, Output, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
	selector: 'search-dialog',
	styleUrls: ['./search.dialog.component.scss'],
	templateUrl: './search.dialog.component.html'
})
export class SearchDialogComponent implements OnInit, OnDestroy, AfterViewInit {

	@ViewChild('search', {read: ElementRef, static: true}) searchRef: ElementRef;

	@Input() field: FormElement;
	@Input() data: any;
	@Input() isMany: boolean;

	fields: string[];
	columns: any[];

	selected: any;

	searchValue: string;
	results: any[];
	isSearching: boolean;

	isLoading: boolean = true;

	payload: any[];

	errors: string[];

	constructor(protected dialogRef: NbDialogRef<SearchDialogComponent>, protected modelService: ModelService) {
		this.modelService.setModel(this.field.relation);
	}

	ngOnInit() {
		return;
	}

	ngOnDestroy() {
		return;
	}

	ngAfterViewInit() {
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
	}

	private parse(): void {
		console.log('Starting parse!');
		var parser: any;
		var parsed: XMLDocument;

		if(DOMParser) {
			parser = new DOMParser();
			parsed = parser.parseFromString(this.field.views.tree.arch, 'text/xml');
		} else {
			parser = new ActiveXObject('Microsoft.XMLDOM');
			parsed = parser.loadXML(this.field.views.tree.arch);
		}

		// console.log(parser, parsed);

		if(parsed.documentElement.tagName == 'tree') {
			for(var i = 0; i < parsed.documentElement.children.length; i++) {
				this.parseNode(parsed.documentElement.children[i]);
			}
			this.isLoading = false;
		}
	}

	private parseNode(node: Element): void {
		// console.log(node);
		if(node.tagName == 'field') {
			let field = this.field.views.tree.fields[node.getAttribute('name')];
			// consotl
			console.log('Parsing Node: ', node, field, node.getAttribute('name'));
			this.createColumn(node.getAttribute('name'), {
				title: field.string,
				type: field.type
			});
		} else if(node.tagName == 'button') {
			this.createColumn(node.getAttribute('name'), {
				title: node.getAttribute('string'),
				type: 'button',
				action: node.getAttribute('name'),
				states: node.getAttribute('states').replace("&quot;", "'"),
				node_type: node.getAttribute('type')
			});
		}
	}

	private createColumn(key: string, obj: any): void {
		// console.log(key, obj);
		obj.key = key;
		this.columns.push(obj);
	}

	private getFields() {
		this.isLoading = true;
		this.modelService.view(false, 'tree').subscribe((res: TrytonResponse) => {
			this.fields = Object.keys(res.result.fields);
			this.isLoading = true;
		});
	}

	private search(value: string) {
		let domain: any[][] = [
			['rec_name', 'ilike', '%' + value + '%']
		];
		JSON.parse(this.field.domain).map((d, i) => {
			domain.push(d)
		});
		this.modelService.search_read(
			domain,
			0,
			5,
			null,
			this.fields
		).subscribe((r: TrytonResponse) => {
			this.results = r.result;
			this.isSearching = false;
		});
	}

	private select(item: any) {
		let keys = Object.keys(this.data);
		if(this.isMany && this.results.length <= keys.length) {
			this.selected[item.id] = item;
		} else if(!this.isMany && !(keys.length > 1)) {
			this.selected[item.id] = item;
		}
	}

	private selectAll(event: any) {
		if(this.isMany) {
			this.results.map((r: any, i: number) => {
				this.selected[r.id] = r;
			});
		}
	}

	submit(ev: any): void {
		this.dialogRef.close(this.data);
	}

	cancel(ev: any): void {
		this.dialogRef.close();
	}

}