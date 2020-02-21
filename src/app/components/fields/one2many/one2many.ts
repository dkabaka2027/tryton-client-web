import { NbDialogService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { DRIVERS, Locker } from 'angular-safeguard';
import { FormElement } from '../../../services/index';
import { ModelService } from '../../../services/model.service';
import { TrytonResponse } from '../../../services/admin.resources.service';
import { SearchDialogComponent } from '../../dialogs/search/search.dialog.component';
import { Component, Input, Output, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { RelationDialogComponent } from '../../dialogs/relation/relation.dialog.component';
// TODO: Table with Search field or New Button 
@Component({
	selector: 'one2many',
	styleUrls: ['./one2many.scss'],
	template: `
		<div class="form-control-group">
			<div *ngIf="isLoading" class="loading" style="display: table; width: 100%; margin: 0; text-align: center;">
				<nb-icon icon="loading" pack="misc" style="display: table-cell; vertical-align: middle; text-align: center;"></nb-icon>
			</div>
			<div *ngIf="!isLoading" class="table-responsive">
	  		<table #table class="table table-striped table-bordered table-hover table-sm">
					<thead class="thead-dark">
						<tr (click)="openView(dialogView, item.id)">
							<th *ngFor="let column of columns"><span>{{column.title}}</span></th>
						</tr>
					</thead>
					<tbody>
						<tr *ngFor="let item of data">
							<td *ngFor="let column of columns">
								<span>{{item[column.key]}}</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<button nbButton fullWidth status="info" (click)="openCreate()">Create new</button>
		</div>
	`
})
export class One2ManyComponent implements OnInit, OnDestroy {

	id: number;
	@Input() field: FormElement;
	@Input() data: any[];

	results: any[];

	columns: any[] = [];

	isLoading: boolean = true;

	constructor(protected modelService: ModelService, protected locker: Locker, protected dialogService: NbDialogService) {
		this.modelService.setModel(this.field.relation);
	}

	ngOnInit() {
		this.parse();
		this.fetchData();
		return;
	}

	ngOnDestroy() {
		return;
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

	getIdField(): FormElement {
		let keys = Object.keys(this.field.views.tree.fields);
		
		for(var i = 0; i < keys.length; i++) {
			if(this.field.views.tree.fields[keys[i]].type == 'many2one') {
				return this.field.views.tree.fields[keys[i]];
			}
		}
	}

	fetchData() {
		this.isLoading = true;
		this.modelService.read(this.data, Object.keys(this.field.views.tree.fields))
			.subscribe((res: TrytonResponse) => {
				this.results = res.result;
				this.isLoading = false;
			});
	}

	openView(id: number) {
		this.dialogService.open(RelationDialogComponent, {
			closeOnEsc: true,
			context: {
				id: id,
				data: this.data,
				field: this.field,
				isView: true
			}
		});
	}

	openCreate() {
		this.dialogService.open(RelationDialogComponent, {
			closeOnEsc: true,
			context: {
				data: this.data,
				field: this.field,
				buttons: false,
				isView: false
			}
		}).onClose.subscribe((result: any) => {
			let keys: string[] = Object.keys(result);
			keys.map((k, i) => {
				this.data.push(result[k].id);
			})
		});
	}

	submit() {
		return;
	}

	cancel() {}

}