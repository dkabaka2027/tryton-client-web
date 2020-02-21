export declare interface ActiveXObject {
	new (type: string): any;
	loadXml(type: string): XMLDocument;
}

// export declare var ActiveXObject: ActiveXObject;

export type Action = {
	id: number;
	name: string;
	type: string;
	usage: string;
	icon: string;
	keywords: ActionKeyword[];
	// groups: ActionGroup[];
	reports: ActionReport[];
	windows: ActionWindow[];
	wizards: ActionWizard[];
	urls: ActionURL[];
	active: boolean;
};

export type ActionKeyword = {
	id: number;
	keyword: string;
	model: string;
	// groups: ActionGroup[];
};

export type ActionReport = {
	id: number;
	model: string;
	report_name: string;
	report: string;
    report_content_custom: ArrayBuffer;
    is_custom: boolean;
    report_content: ArrayBuffer;
    report_content_name: string;
    action: number;
    direct_print: boolean;
    single: boolean;
    template_extension: string;
    extension: string;
    module: string;
    email: string;
    pyson_email: string;
};

export type ActionWindow = {
	id: number;
	domain: string;
    context: string;
    order: string;
    res_model: string;
    context_model: string;
    context_domain: string;
    act_window_views: ActionWindowView[];
    views: ArrayBuffer;
    act_window_domains: ActionWindowDomain[];
    domains: ArrayBuffer;
    limit: number;
    action: number;
    search_value: string;
    pyson_domain: string;
    pyson_context: string;
    pyson_order: string;
    pyson_search_value: string;
};

export type ActionWindowView = {
	id: number;
	sequence: number;
    view: UiView;
    act_window: number;
    active: boolean;
};

export type ActionWindowDomain = {
	name: string;
    sequence: number;
    domain: string;
    count: boolean;
    act_window: number;
    active: boolean;
};

export type ActionWizard = {
	wiz_name: string;
    action: number;
    model: string;
    email: string;
    window: boolean;
};

export type ActionURL = {
	url: string;
    action: number;
};

export type UiView = {

};

export type Access = {
	read: boolean;
	write: boolean;
	create: boolean;
	delete: boolean;
};

export type Configuration = {
	url?: string;
	root?: string;
	default?: boolean;
	database?: string;
	timeout?: number;
	inactive?: number;
};

export type Domain = {
	field: string;
	op: string;
	comp: string;
	id?: number;
};

export enum FieldType {
	CHAR = 'char',
	TEXT = 'text',
	FLOAT = 'float',
	INTEGER = 'integer',
	NUMERIC = 'numeric',
	BOOLEAN = 'boolean',
	ARRAY = 'array',
	DICT = 'dict',
	DATE = 'date',
	DATETIME = 'datetime',
	TIME = 'time',
	TIMEDELTA = 'timedelta',
	BINARY = 'binary',
	REFERENCE = 'reference',
	ONE2ONE = 'one2one',
	MANY2ONE = 'many2one',
	ONE2MANY = 'one2many',
	MANY2MANY = 'many2many',
	WIZARD = 'wizard',
	NOTEBOOK = 'notebook',
	PAGE = 'page',
	NEWLINE = 'newline',
	GROUP = 'group'
};

export type Fields = {
	[key: string]: Field;
};

export type Field = {
	name: string;
	string: string;
	help?: string;
	type: FieldType;
	required?: boolean;
	select?: boolean;
	selection?: [string, string][];
	relation?: string;
	relation_fields?: boolean;
	searchable?: boolean;
	readonly?: boolean;
	sort?: boolean;
	schema?: any;
	views?: any;
	states?: string;
	loading?: string;
	domain?: string;
	on_change?: string[];
	on_change_with?: string[];
	data?: any;
};

export type Form = {
	model: string;
	attributes: any;
	elements?: FormElement[];
};

export type FormElement = {
	name: string;
	string: string;
	help?: string;
	type: FieldType;
	label?: boolean;
	input?: boolean;
	mode?: string[];
	required?: boolean;
	select?: boolean;
	selection?: [string, string][];
	relation?: string;
	relation_fields?: boolean;
	searchable?: boolean;
	readonly?: boolean;
	sort?: boolean;
	schema?: any;
	views?: any;
	states?: string;
	loading?: string;
	domain?: string;
	on_change?: string[];
	on_change_with?: string[];
	data?: any;
	field?: Field;
	children?: FormElement[]
};

export type KeyValidation = {
	key: string;
	message: string;
};

export type Point = {
	lat: number;
	long: number;
	alt: number;
};

export type Bounday = Point[];