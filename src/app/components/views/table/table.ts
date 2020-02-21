import { DRIVERS, Locker } from 'angular-safeguard';
import { Decoder } from '../../../services/pyson/index';
import { ActivatedRoute, Router } from '@angular/router';
// import { TrytonDatasource } from './tryton.datasource';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { ModelService } from '../../../services/model.service';
import { Actions, TrytonAction } from '../../../services/action';
import { of as observableOf, Subscription, fromEvent } from 'rxjs';
import { Action, Fields, ActiveXObject } from '../../../services/index';
import { TrytonResponse } from '../../../services/admin.resources.service';
import {  debounceTime, map, catchError, distinctUntilChanged, filter } from 'rxjs/operators';
import { Component, Input, Output, ViewChild, ComponentRef, TemplateRef, ElementRef, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';

@Component({
	selector: 'fc-table',
	styleUrls: ['./table.component.scss'],
	templateUrl: './table.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild('search', { read: ElementRef, static: true }) searchRef: ElementRef;
	
	@Input() model: string;
	@Input() pagination: boolean = true;
	@Input() limits: boolean = true;

	decoder: Decoder = new Decoder({});

	sub: Subscription;

	searchResults: any[] = [];
	allSelected: boolean = false;
	selected: any = {};

	size: string = 'tiny';

	fields: Fields;
	acts: any[] = [
		{
			id: 1,
			name: 'New',
			icon: 'plus-outline',
			link: 'create'
		}, {
			id: 2,
			name: 'Switch',
			icon: 'toggle-right-outline'
		}, {
			id: 3,
			name: 'Save',
			icon: 'save-outline'
		}, {
			id: 4,
			name: 'Duplicate',
			icon: 'copy-outline',
			click: 'duplicate($event)'
		}, {
			id: 5,
			name: 'Reload',
			icon: 'refresh-outline',
			click: 'reload($event)'
		}, {
			id: 6,
			name: 'Search',
			icon: 'search-outline'
		}, {
			id: 7,
			name: 'Attachment',
			icon: 'attach-outline',
			click: 'attach($event)'
		}, {
			id: 8,
			name: 'Import',
			icon: 'upload-outline',
			click: 'import($event)'
		}, {
			id: 9,
			name: 'Export',
			icon: 'download-outline',
			click: 'export($event)'
		}, {
			id: 10,
			name: 'Action',
			icon: 'activity-outline',
			children: []
		}, {
			id: 11,
			name: 'Print',
			icon: 'printer-outline',
			children: [
				{
					id: 10,
					name: 'PDF',
					icon: 'activity-outline'
				}, {
					id: 10,
					name: 'Print',
					icon: 'activity-outline'
				}
			]
		}, {
			id: 12,
			name: 'Relate',
			icon: 'arrow-forward-outline',
			children: [
				{
					id: 10,
					name: 'Action',
					icon: 'activity-outline',
					children: []
				}, {
					id: 10,
					name: 'Action',
					icon: 'activity-outline',
					children: []
				}
			]
		}, {
			id: 13,
			name: 'View Logs',
			icon: 'file-text-outline',
			click: 'viewLogs($event)'
		}, {
			id: 14,
			name: 'Show Revisions',
			icon: 'clock-outline',
			click: 'showRevisions($event)'
		}, {
			id: 15,
			name: 'Undo',
			icon: 'undo-outline',
			click: 'undo($event)'
		}
	];

	user: any;
	
	columns: any[] = [];

	count: number;

	pages: number;
	ps: number[] = [];

	page: number = 1;
	limit: number = 25;
	sort: string = '';

	filter: string = '';

	data: any[] = [];

	view: any;

	isSearching: boolean = false;
	isLoading: boolean = true;

	constructor(
		protected dialogService: NbDialogService,
		protected modelService: ModelService,
		protected locker: Locker,
		protected actions: Actions,
		protected route: ActivatedRoute,
		protected router: Router,
		protected cd: ChangeDetectorRef
	) {

	}

	ngOnInit() {
		this.modelService.setModel(this.model);

		this.fetchView();

		this.route.params.subscribe(params => {
			if(params['model'] !== this.model) {
				console.log(params['model'], this.model);
				this.columns = [];
				this.data = [];
				this.model = params['model'];
				this.modelService.setModel(this.model);
				this.fetchView();
			}
		});

		// Set activated route params to page, limit
		// TODO: Figure a better way to compose search -> counts -> read
		this.sub = this.route.queryParams.subscribe(params => {
			console.log(params['page'], params['limit']);
			if((this.page !== +params['page'] || this.limit !== +params['limit']) && (params['page'] !== undefined && params['limit'] !== undefined)) {
				console.log("Refetching!");
				this.page = +params['page'];
				this.limit = +params['limit'];

				this.fetchData();
				this.fetchCount();

				this.isLoading = false;
			}
		});

		this.user = this.locker.get(DRIVERS.LOCAL, 'user');

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
		this.sub.unsubscribe();

		return;
	}

	parse(): void {
		console.log('Starting parse!');
		var parser: any;
		var parsed: XMLDocument;

		if(DOMParser) {
			parser = new DOMParser();
			parsed = parser.parseFromString(this.view.arch, 'text/xml');
		} else {
			parser = new ActiveXObject('Microsoft.XMLDOM');
			parsed = parser.loadXML(this.view.arch);
		}

		// console.log(parser, parsed);

		if(parsed.documentElement.tagName == 'tree') {
			for(var i = 0; i < parsed.documentElement.children.length; i++) {
				this.parseNode(parsed.documentElement.children[i]);
			}
		}
	}

	parseNode(node: Element): void {
		// console.log(node);
		if(node.tagName == 'field') {
			let field = this.fields[node.getAttribute('name')];
			// console.log(field, node.getAttribute('name'));

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

	createColumn(key: string, obj: any): void {
		// console.log(key, obj);
		obj.key = key;
		this.columns.push(obj);
	}

	search(val: string): void {
		this.modelService.search(
			'rec_name,=,' + val,
			0,
			1000,
			null
		).subscribe((res: TrytonResponse) => {
			this.modelService.read(
				res.result,
				Object.keys(this.fields)
			).subscribe((r: TrytonResponse) => {
				this.searchResults = r.result;
			})
		});
	}

	onDeleteConfirm(dialog: TemplateRef<any>, id: number) {
		this.dialogService.open(dialog, { context: {
			id: id,
			model: this.model
		}}).onClose.subscribe((r: number) => {
			this.modelService.delete([r]);
		});
	}

	setAction(a: Action): void {
		this.acts[9].children.push(a);
	}

	setRelation(a: Action): void {
		this.acts[11].children.push(a);
	}

	executeAction(id: number, action: string, type: string): void {
		let a: TrytonAction = {
			id: id,
			domains: [],
			res_id: id,
			res_model: this.model,
			view_id: this.view.view_id,
			view_ids: [],
			views: this.view,
			name: action,
			type: type
		};

		this.actions.exec_action(a, id, this.user.context);
	}

	fetchView() {
		this.modelService.view(false, 'tree')
			.subscribe((res: TrytonResponse) => {

				this.fields = res.result.fields;
				this.view = res.result;
				this.modelService.setFields(this.fields);
				this.parse();

				console.log(this.view, this.fields, this.columns);

				this.fetchData();
				this.fetchCount();

				this.isLoading = false;

				this.cd.detectChanges();

				return res;
			});
	}

	fetchData() {
		this.modelService.search(this.filter, (this.page - 1) * this.limit, this.limit, this.sort).pipe(
  		map((res: TrytonResponse) => {
  			this.modelService.read(res.result, Object.keys(this.fields))
  				.subscribe((res: TrytonResponse) => {
	  				this.data = res.result;
	  				// console.log(res);
	  				this.cd.detectChanges();

						this.isLoading = false;
	  			});
  			return res;
  		}),
  		catchError((res: TrytonResponse) => {
  			return observableOf(res);
  		})
  	).subscribe();
	}

	fetchCount() {
		this.modelService.count('').subscribe((res: TrytonResponse) => {
			this.count = res.result;
			this.pages = Math.floor(this.count / this.limit);
			// console.log(this.count, this.limit, this.pages);
			this.ps = new Array(this.pages).fill(0).map((x, i) => {
				return i+1;
			});

			this.isLoading = false;

			this.cd.detectChanges();
		});
	}

	select(id: number): boolean {
		if(this.selected[id] == id) {
			delete this.selected[id];
			return false;
		} else {
			this.selected[id] = id
			return true;
		}
	}

	selectAll(ev: any): boolean {
		if(!this.allSelected) {
			this.allSelected = true;
			this.data.map((o: any) => {
				this.selected[o.id] = o.id;
			});
		} else {
			this.allSelected = false;
			this.selected = {};
		}
		return this.allSelected;
	}

	openView(id: number): void {
		this.router.navigate(['admin', 'model', this.model, id, 'view']);
	}

	// Actions
	duplicate(ev: any) {
		return;
	}

	reload(ev: any) {
		return;
	}

	attach(ev: any) {
		return;
	}

	import(ev: any) {
		return;
	}

	export(ev: any) {
		return;
	}

	viewLogs(ev: any) {
		return;
	}

	showRevisions(ev: any) {
		return;
	}

	undo(ev: any) {
		return;
	}

}