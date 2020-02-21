import { Router } from '@angular/router';
import { ModelService } from '../../../services/model.service';
import { TrytonResponse } from '../../../services/admin.resources.service';
import { ActiveXObject, Field, Fields, FieldType, Form, FormElement, KeyValidation } from '../../../services/index';
import {
  Component,
  ComponentFactoryResolver,
  ComponentRef, ElementRef, EmbeddedViewRef,
  Injector,
  Input,
  ViewChild,
  ViewContainerRef,
  OnInit,
  OnDestroy, ComponentFactory
} from '@angular/core';
import {
  BinaryComponent,
  BooleanComponent,
  BoundaryComponent,
  CharComponent,
  DateComponent,
  DateTimeComponent,
  DictComponent,
  FloatComponent,
  IntegerComponent,
  Many2ManyComponent,
  Many2OneComponent,
  NumericComponent,
  One2ManyComponent,
  One2OneComponent,
  PointComponent,
  ReferenceComponent,
  SelectionComponent,
  TextComponent,
  TimeComponent,
  TimeDeltaComponent,
  NotebookComponent,
  PageComponent,
  WizardComponent
} from '../../fields/index';

const COMPONENTS: any = {
	'binary': BinaryComponent,
	'boolean': BooleanComponent,
	'boundary': BoundaryComponent,
	'char': CharComponent,
	'date': DateComponent,
	'datetime': DateTimeComponent,
	'dict': DictComponent,
	'float': FloatComponent,
	'integer': IntegerComponent,
	'many2many': Many2ManyComponent,
	'many2one': Many2OneComponent,
	'numeric': NumericComponent,
	'one2many': One2ManyComponent,
	'one2one': One2OneComponent,
	'point': PointComponent,
	'reference': ReferenceComponent,
	'selection': SelectionComponent,
	'text': TextComponent,
	'time': TimeComponent,
	'timedelta': TimeDeltaComponent,
  'notebook': NotebookComponent,
  'page': PageComponent,
  'wizard': WizardComponent
};

@Component({
	selector: 'fc-form',
	styleUrls: ['./form.component.scss'],
	templateUrl: './form.component.html'
})
export class FcFormComponent implements OnInit, OnDestroy {
	// @ViewChild('form', {read: ViewContainerRef}) form: ViewContainerRef;

	@Input() model: string;
	@Input() id: number;
	@Input() buttons: boolean = true;

	edit: boolean = false;
	
	fields: Fields;
	form: Form = { model: null, attributes: null, elements: [] };
	// formKeys: string[];
	payload: any = {};

	xml: string;

	isLoading: boolean = true;
	submitted: boolean = false;
	validated: boolean = false;
	errors: KeyValidation[] = [];

	constructor(
		protected modelService: ModelService,
		protected router: Router
	) {}

	ngOnInit() {
		console.log(this.model);
		this.modelService.setModel(this.model);
		this.modelService.view(false, 'form').subscribe((res: TrytonResponse) => {
			this.xml = res.result.arch;
			this.fields = res.result.fields;

			if(this.id != null && this.id != 0) {
				this.edit = true;
				this.modelService.read([this.id], Object.keys(this.fields)).subscribe((res: TrytonResponse) => {
					this.payload = res.result[0];
					this.createForm();
					this.isLoading = false;
				});
			} else {
				this.isLoading = false
				this.createForm();
			}

		});

		return;
	}

	ngOnDestroy() {
		return;
	}

	private select(name: string, elements?: FormElement[]): any {
		var el: FormElement = null;
		var index: number = null;
		if(elements) {
			for(var i = 0; i < elements.length; i++) {
				if(elements[i].name == name && elements[i].type != 'newline') {
					el = elements[i];
					index = i;
					break;
				}
			}
		}
		return {el, index};
	}

	private parse(): Form {
		var parser: any;
		var parsed: XMLDocument;
		var json: Form = { 
			model: this.model,
	    attributes: {},
			elements: []
		};

		if(DOMParser) {
			parser = new DOMParser();
			parsed = parser.parseFromString(this.xml, 'text/xml');
		} else {
			parser = ActiveXObject('Microsoft.XMLDOM');
			parsed = parser.loadXML(this.xml);
		};
		
		console.log(parsed.documentElement.tagName);

		// var j: number = 0;

		if(parsed.documentElement.tagName == 'form') {
			json['attributes'] = parsed.documentElement.attributes;
    	let children = parsed.documentElement.children;
    	for (var i = 0; i < children.length; i++) {
    		let {el, index} = this.select(children[i].getAttribute('name'), json.elements);

    		console.log("Parsing:", children[i], el);
    		let p = this.parseNode(children[i], el);
    		if(index && el) {
    			json.elements[index] = p;
    		} else {
      		json.elements.push(p);
    		}
    	}
		}
		console.log(json);
		return json;
	}

	private parseNode(node: Element, el?: FormElement): FormElement {
		console.log("Parsing: ", node, el);
    var element: FormElement = {name: '', string: '', type: null, children: []};
    let attributes = node.attributes;
    // If tagName !== ['input', 'label']
    let field: Field = node.tagName == 'field' || node.tagName == 'label' ? this.fields[node.getAttribute('name')]:null;
    // console.log('Field: ', field);
    if(node.tagName == 'label' && node.getAttribute(name)) {
    	if(el) {
    		el.label = true;
    	} else {
	      element = {
	        name: field.name,
	        string: field.string,
	        type: field.type,
	        help: field.help,
	        label: node.getAttribute('name') ? true:false,
	        mode: node.getAttribute('mode') ? node.getAttribute('mode').split(','):null,
	        required: field.required,
	        select: field.select,
	        selection: field.selection,
	        relation: field.relation,
	        relation_fields: field.relation_fields,
	        searchable: field.searchable,
	        readonly: field.readonly,
	        sort: field.sort,
	        schema: field.schema,
	        views: field.views,
	        states: node.getAttribute('states') ? node.getAttribute('states'):null,
					loading: field.loading,
					domain: field.domain,
					on_change: field.on_change,
					on_change_with: field.on_change_with,
	        data: this.payload[field.name],
	        field: field
	      };
    	}
    } else if(node.tagName == 'field') {
    	if(el) {
    		el.input = true;
    	} else {
	      element = {
	        name: field.name,
	        string: field.string,
	        type: field.type,
	        help: field.help,
	        input: node.getAttribute('name') ? true:false,
	        mode: node.getAttribute('mode') ? node.getAttribute('mode').split(','):null,
	        required: field.required,
	        select: field.select,
	        selection: field.selection,
	        relation: field.relation,
	        relation_fields: field.relation_fields,
	        searchable: field.searchable,
	        readonly: field.readonly,
	        sort: field.sort,
	        schema: field.schema,
	        views: field.views,
	        states: node.getAttribute('mode') ? node.getAttribute('name'):null,
	        loading: field.loading,
					domain: field.domain,
					on_change: field.on_change,
					on_change_with: field.on_change_with,
	        data: this.payload[field.name],
	        field: field
    		};
	    }
    } else if(node.tagName == 'notebook' || node.tagName == 'page' || node.tagName == 'group') {
      // Set children form element
      let tags = ['notebook', 'group'];
      let tagType = [FieldType.NOTEBOOK, FieldType.GROUP];
      let children = node.children;
      element.name = tags.indexOf(node.tagName) >= 0 ? tags[tags.indexOf(node.tagName)]:node.getAttribute('string'),
      element.string = tags.indexOf(node.tagName) >= 0 ? tags[tags.indexOf(node.tagName)]:node.getAttribute('string'),
      element.type = tags.indexOf(node.tagName) >= 0 ? tagType[tags.indexOf(node.tagName)]:FieldType.PAGE,
      element.children = []
      // Check if node has children
      if(children.length > 0) {
        // Loop again on children nodes if parent is not equal notebook
        for(var i = 0; i < children.length; i++) {
        	let {el, index} = this.select(children[i].getAttribute('name'), element.children);
    		
	    		// console.log("Parsing:", children[i], el);
	    		let parsed = this.parseNode(children[i], el)
	    		if(index && el) {
	    			element.children[index] = parsed;
	    		} else {
	      		element.children.push(parsed);
	    		}
        }
      }
    } else if (node.tagName == 'newline') {
    	element.name = 'newline';
    	element.string = 'newline';
    	element.type = FieldType.NEWLINE;
    }
    console.log('Form Element: ', element, el);
    return el ? el:element;
	}

	private createForm(): void {
		console.log("Parse start!")
		this.form = this.parse();
    // this.keys = Object.keys(this.form.elements);

    // for(var i = 0; i < keys.length; i++) {
    // 	console.log("Appending: ", parsed.elements[keys[i]]);	
    //   this.appendComponentToDom(parsed.elements[keys[i]]);
    // }
	}

	// private appendComponentToDom(component: FormElement, ref?: ComponentFactory<any>): void {
	// 	// 1. Create a component reference from the component 
 //    const componentRef: ComponentFactory<any> = this.componentFactoryResolver
 //      .resolveComponentFactory(COMPONENTS[component.type]);
 //      // .create(this.injector);

 //    // 2. Assign inputs to component
 //    if([FieldType.NOTEBOOK, FieldType.PAGE].indexOf(component.type) != -1 && this.edit) {
 //      componentRef.inputs['field'] = {
 //        name: component.name,
 //        string: component.string,
 //        help: component.help,
 //        type: component.type,
 //        label: component.label,
 //        input: component.input,
 //        required: component.required,
 //        select: component.select,
 //        selection: component.selection,
 //        relation: component.relation,
 //        relation_fields: component.relation_fields,
 //        searchable: component.searchable,
 //        readonly: component.readonly,
 //        sort: component.sort,
 //        data: component.data
 //      };
 //      componentRef.inputs['data'] = this.payload[component.name];
 //    }

 //    // 3. Check for children components
 //    if (component.children && component.children.length != 0) {
 //      let keys: string[] = Object.keys(component.children);
 //      for(var i = 0; i < keys.length; i++) {
 //        this.appendComponentToDom(component.children[keys[i]], componentRef);
 //      }
 //    }

 //    // 4. Attach component to the ref so that it's inside the ng component tree
 //    if(ref) {
 //      // let r: ElementRef = <ElementRef> ref.instance;
 //      // r.nativeElement.attachView(componentRef.hostView);
 //      // 5. Get DOM element from component
 //      const domElem = (componentRef.create(this.injector).hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
 //      // 6. Append DOM element to the body
 //      ref.create(this.injector).instance.appendChild(domElem);
 //    } else {
 //      // this.form.element.nativeElement.attachView(componentRef.hostView);
 //      // 5. Get DOM element from component
 //      // const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
 //      // 6. Append DOM element to the body
 //      this.form.createComponent(componentRef);
 //    }
	// }

	validate(data: any[]): KeyValidation[] {
		return [];
	}

	submit() {
		this.errors = this.validate(this.payload);
		if(this.errors.length > 0) {
			this.submitted = true;
			if(this.edit) {
				this.modelService.write(
					this.payload
				).subscribe((res: TrytonResponse) => {
					// this.submitted = true;
					this.router.navigateByUrl('/admin/' + this.model);
				}, (res: TrytonResponse) => {
					this.submitted = false;
				});
			} else {
				this.modelService.create(
					this.payload
				).subscribe((res: TrytonResponse) => {
					// this.submitted = false;
					this.router.navigateByUrl('/admin/' + this.model);
				}, (res: TrytonResponse) => {
					this.submitted = false;
				});
			}
		}
	}

	cancel() {
		this.payload = {};
		this.router.navigate(['admin', 'model', this.model]);
	}

}
