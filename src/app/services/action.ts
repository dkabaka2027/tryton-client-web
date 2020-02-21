import _ from 'underscore';
import { I18n } from './i18n';
import * as utils from '../utils';
import { Decoder } from './pyson';
import { Injectable } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { Locker, DRIVERS } from 'angular-safeguard';
import { of as observableOf, Observable } from 'rxjs';
import { TrytonResponse } from './admin.resources.service';
import { switchMap, map, catchError } from 'rxjs/operators';

export type TrytonAction = {
	id: number;
	domains: string[];
	res_id: number;
	res_model: string;
	view_id: number;
	view_ids: number[];
	views: any[];
	name: string;
	type: string;
	mode?: string;
	pyson_domain?: string;
	pyson_order?: string;
	pyson_context?: any;
	pyson_email?: string;
	pyson_search_value?: any;
	limit?: number;
	context_model?: string;
	context_domain?: string;
	keyword?: string;
	wiz_name?: string;
	direct_print?: string;
	email?: string;
	email_print?: string;
	report_name?: string;
	url?: string;
	window?: any;
};

@Injectable({
	providedIn: 'root'
})
export class Actions {
	report_blob_url: any;
	session: any;

	constructor(protected http: HttpClient, protected locker: Locker, protected i18n: I18n, protected dialog: NbDialogService) {
		this.session = this.locker.get(DRIVERS.LOCAL, 'user');
	}

	public exec_action(action: TrytonAction, data: any, context: any) {
        if (!context) {
            context = {};
        } else {
            context = _.extend({}, context);
        }
        var session: any = this.locker.get(DRIVERS.LOCAL, 'user');
        
        if (!('date_format' in context)) {
            if (session.context.locale && session.context.locale.date) {
                context.date_format = session.context.locale.date;
            }
        }
        if (data === undefined) {
            data = {};
        } else {
            data = _.extend({}, data);
        }

        delete context.active_id;
        delete context.active_ids;
        delete context.active_model;

        const add_name_suffix: (name: string) => Observable<string[]> = (name: string) => {
            if (!data.model || !data.ids) {
                return name;
            }

            var max_records = 5;
            var ids = data.ids.slice(0, max_records);

            return this.http.post<TrytonResponse>(
            	'http://localhost:4200/tryton/' + session.database + '/',
	            {
                    id: Math.floor(Math.random() * 100 ),
	                'method': 'model.' + data.model + '.read',
	                'params': [ids, ['rec_name'], context]
	            }
	        ).pipe(
	        	map((res: TrytonResponse) => {
	                var name_suffix = res.result.map((record: any) => {
	                    return record.rec_name;
	                }).join(this.i18n.getText(', '));

	                if (data.ids.length > max_records) {
	                    name_suffix += this.i18n.getText(',\u2026');
	                }
	                return this.i18n.getText('%1 (%2)', name, name_suffix);
	            }),
	            catchError((e: TrytonResponse) => {
	            	return observableOf(e.error);
	            })
	        );
        };

        data.action_id = action.id;
        var params: any = {};
        var name_prm;
        switch (action.type) {
            case 'ir.action.act_window':
                params.view_ids = [];
                params.mode = null;
                if (!_.isEmpty(action.views)) {
                    params.view_ids = [];
                    params.mode = [];
                    action.views.map((x) => {
                        params.view_ids.push(x[0]);
                        params.mode.push(x[1]);
                    });
                } else if (!_.isEmpty(action.view_id)) {
                    params.view_ids = [action.view_id[0]];
                }

                if (action.pyson_domain === undefined) {
                    action.pyson_domain = '[]';
                }
                var ctx: any = {
                    active_model: data.model || null,
                    active_id: data.id || null,
                    active_ids: data.ids
                };
                ctx = _.extend(ctx, session.context);
                ctx._user = session.user_id;
                var decoder = new Decoder(ctx);
                params.context = _.extend(
                    {}, context,
                    decoder.decode( action.pyson_context || '{}'));
                ctx = _.extend(ctx, params.context);
                ctx = _.extend(ctx, context);

                ctx.context = ctx;
                decoder = new Decoder(ctx);
                params.domain = decoder.decode(action.pyson_domain);
                params.order = decoder.decode(action.pyson_order);
                params.search_value = decoder.decode(
                    action.pyson_search_value || '[]');
                params.tab_domain = [];
                action.domains.map((element: any) => {
                    params.tab_domain.push([element[0], decoder.decode(element[1]), element[2]]);
                });
                name_prm = action.name;
                params.model = action.res_model || data.res_model;
                params.res_id = action.res_id || data.res_id;
                params.context_model = action.context_model;
                params.context_domain = action.context_domain;
                if (action.limit !== null) {
                    params.limit = action.limit;
                } else {
                    params.limit = 1000;
                }
                params.icon = action['icon.rec_name'] || '';

                if ((action.keyword || '') === 'form_relate') {
                    name_prm = add_name_suffix(action.name);
                }
                name_prm.subscribe((name: string) => {
                    params.name = name;
                    // Sao.Tab.create(params);
                });
                return;
            case 'ir.action.wizard':
                params.action = action.wiz_name;
                params.data = data;
                params.context = context;
                params.window = action.window;
                name_prm = action.name;
                if ((action.keyword || 'form_action') === 'form_action') {
                    name_prm = add_name_suffix(action.name);
                }
                name_prm.subscribe((name: string) => {
                    params.name = name;
                    // Sao.Wizard.create(params);
                });
                return;
            case 'ir.action.report':
                params.name = action.report_name;
                params.data = data;
                params.direct_print = action.direct_print;
                params.email_print = action.email_print;
                params.email = action.email;
                params.context = context;
                this.exec_report(params);
                return;
            case 'ir.action.url':
                window.open(action.url, '_blank');
                return;
        }
    }

    public exec_keyword(keyword: string, data: any, context?: any, warning?: boolean, alwaysask?: boolean) {
        if (warning === undefined) {
            warning = true;
        }
        if (alwaysask === undefined) {
            alwaysask = false;
        }
        var actions = [];
        var model_id = data.id;
        var args = {
            'id': Math.floor(Math.random() * 100),
            'method': 'model.' + 'ir.action.keyword.get_keyword',
            'params': [keyword, [data.model, model_id], {}]
        };
        var session = this.locker.get(DRIVERS.LOCAL, 'user');
        var obs = this.http.post('http://localhost:4200/tryton/' + session.database + '/', args);
        var exec_action = map((res: TrytonResponse) => {
            var keyact: any = {};
            for (var i in res.result) {
                var action = actions[i];
                keyact[action.name.replace(/_/g, '')] = action;
            }
            var ob = utils.selection('Select your action', keyact, this.i18n, this.dialog, alwaysask);
            return ob.pipe(
            	map((res: TrytonResponse) => {
                	this.exec_action(res.result, data, context);
            	}),
            	catchError((e: TrytonResponse) => {
	                if (_.isEmpty(keyact) && warning) {
	                    alert('No action defined.');
	                }
	                return observableOf(e);
            	})
            );
        });
        return obs;
    };

    public exec_report(attributes: any) {
        if (!attributes.context) {
            attributes.context = {};
        }
        if (!attributes.email) {
            attributes.email = {};
        }
        var data = _.extend({}, attributes.data);
        var session = this.locker.get(DRIVERS.LOCAL, 'user');
        var context = _.extend({}, session);
        _.extend(context, attributes.context);
        context.direct_print = attributes.direct_print;
        context.email_print = attributes.email_print;
        context.email = attributes.email;

        var obs = this.http.post(
        	'http://localhost:4200/tryton/' + session.database + '/',
	        {
	            'method': 'report.' + attributes.name + '.execute',
	            'params': [data.ids || [], data, context]
	        }
	    );
        obs.pipe(
        	map((res: TrytonResponse) => {
	            var report_type = res.result[0];
	            var data = res.result[1];
	            var print = res.result[2];
	            var name = res.result[3];

	            // TODO direct print
	            var file_name = name + '.' + report_type;
	            utils.download_file(data, file_name, this.dialog, this.i18n);
	        }),
	    	catchError((e: TrytonResponse) => {
	    		return observableOf(e.error);
	    	})
    	);
    }

    public execute(id: number, data: any, type: string, context: any, keyword: string) {
    	const session = this.locker.get(DRIVERS.LOCAL, 'user');
        if (!type) {
            this.http.post(
            	'http://localhost:4200/tryton' + session.database + '/',
            	{
	                'method': 'model.ir.action.read',
	                'params': [[id], ['type'], context]
	            }
	        ).pipe(
	        	map((res: TrytonResponse) => {
	                this.execute(id, data, res.result[0].type, context, keyword);
	            }),
	            catchError((e: TrytonResponse) => {
	            	return observableOf(e.error);
	            })
	        );
        } else {
            this.http.post(
            	'http://localhost:4200/tryton' + session.database + '/',
	            {
	                'method': 'model.' + type + '.search_read',
	                'params': [[['action', '=', id]], 0, 1, null, null, context]
	            }
	        ).pipe(
	        	map((res: TrytonResponse) => {
	                var action = res.result[0];
	                if (keyword) {
	                    var keywords = {
	                        'ir.action.report': 'form_report',
	                        'ir.action.wizard': 'form_action',
	                        'ir.action.act_window': 'form_relate'
	                    };
	                    if (!action.keyword) {
	                        action.keyword = keywords[type];
	                    }
	                }
	                this.exec_action(action, data, context);
	            }),
	            catchError((e: TrytonResponse) => {
	            	return observableOf(e.error);
	            })
	        );
        }
    }

    public evaluate(action: TrytonAction, atype: any, record: any) {
        action = _.extend({}, action);
        var email: any = {};
        if ('pyson_email' in action) {
            email = record.expr_eval(action.pyson_email);
            if (_.isEmpty(email)) {
                email = {};
            }
        }
        if (!('subject' in email)) {
            email.subject = action.name.replace(/_/g, '');
        }
        action.email = email;
        return action;
    }

}