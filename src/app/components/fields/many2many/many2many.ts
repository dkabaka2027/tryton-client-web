import { NbDialogService } from '@nebular/theme';
import { FormElement } from '../../../services/index';
import { Component, Input, Output } from '@angular/core';
import { ModelService } from '../../../services/model.service';
import { TrytonResponse } from '../../../services/admin.resources.service';
import { SearchDialogComponent } from '../../dialogs/search/search.dialog.component';
import { RelationDialogComponent } from '../../dialogs/relation/relation.dialog.component';

// TODO: Table
@Component({
	selector: 'many2many',
	styleUrls: ['./many2many.scss'],
	template: `
		<div class="form-control-group">
			<div *ngIf="isLoading" class="loading" style="display: table; width: 100%; margin: 0; text-align: center;">
				<nb-icon icon="loading" pack="misc" style="display: table-cell; vertical-align: middle; text-align: center;"></nb-icon>
			</div>
			<div *ngIf="!isLoading" class="table-responsive">
	  		<table #table class="table table-striped table-bordered table-hover table-sm">
					<thead class="thead-dark">
						<tr>
							<th *ngFor="let column of columns"><span (click)="openView(item.id)">{{column.title}}</span></th>
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
			<button nbButton fullWidth status="info" (click)="openCreate()">Create...</button>
		</div>
	`
})
export class Many2ManyComponent {

	@Input() field: FormElement;
	@Input() data: any[];

	payload: any;

	results: any[];

	columns: any[];

	isLoading: boolean;

	constructor(protected modelService: ModelService, protected dialogService: NbDialogService) {
	}

	private getIdField(): FormElement {
		let keys = Object.keys(this.field.views.tree.fields);
		
		for(var i = 0; i < keys.length; i++) {
			if(this.field.views.tree.fields[keys[i]].type == 'many2one') {
				return this.field.views.tree.fields[keys[i]];
			}
		}
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

	private fetchData() {
		let keys = Object.keys(this.field.views);
		// TODO: Create a domain that maps this items ID to its inverse field 
		this.modelService.read(this.data, Object.keys(this.field.views[keys[0]].fields))
			.subscribe((res: TrytonResponse) => {
				this.results = res.result;
				this.isLoading = false;
			});
	}

	private openView(id: number) {
		this.dialogService.open(RelationDialogComponent, {
			closeOnEsc: true,
			context: {
				data: this.data,
				field: this.field,
				id: id,
				isView: true
			}
		});
	}

	private openCreate() {
		this.dialogService.open(RelationDialogComponent, {
			closeOnEsc: true,
			context: {
				data: this.data,
				field: this.field,
				buttons: false,
				isView: false
			}
		}).onClose.subscribe((result: any[]) => {
			this.data.push(result[0]);
		});
	}

	submit() {
		return;
	}

	cancel() {}

}