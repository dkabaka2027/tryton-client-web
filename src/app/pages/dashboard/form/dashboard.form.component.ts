import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of as observableOf, Observable } from 'rxjs';
import { ModelService } from '../../../services/model.service';
import { TrytonResponse } from '../../../services/admin.resources.service';
import { Component, Input, Output, OnInit, OnDestroy } from '@angular/core';

export enum WidgetType {
	AREA = 'area',
	BIG_NUMBER = 'big-number',
	BIG_NUMBER_TOTAL = 'big-number-total',
	BAR = 'bar',
	HISTOGRAM = 'histogram',
	LINE = 'line',
	MAP = 'map',
	MULTI_LINE = 'multi-line',
	PIE = 'pie',
	RADAR = 'radar',
	TIME_SERIES = 'time-series',
	WORLD_MAP = 'world-map'
};

@Component({
	selector: 'dashboard-form',
	styleUrls: ['dashboard.form.component.scss'],
	templateUrl: 'dashboard.form.component.html'
})
export class DashboardFormComponent implements OnInit, OnDestroy {

	@Input() id: number;
	@Input() data: any;
	@Input() edit: boolean;

	extraColumns: any[] = [];

	fields: any[] = [];

	widgetTypes: any[] = [
		{
			value: "area",
			name: "Area"
		}, {
		  value: "bar",
		  name: "Bar"
		}, {
		  value: "big-number",
		  name: "Big Number"
		}, {
	    value: "big-number-total",
	    name: "Big Number with Trend Line"
	  }, {
      value: "histogram",
      name: "Histogram"
    }, {
      value: "line",
      name: "Line"
    }, {
      value: "map",
      name: "Map"
    }, {
      value: "multi-line",
      name: "Multi-Line"
    }, {
      value:"pie",
      name: "Pie"
    }, {
    	value: "radar",
    	name: "Radar"
    }, {
      value: "time-series",
      name: "Time Series"
    }, {
      value: "world-map",
      name: "World Map"
    }
	];

	timeGrain: any[] = [
		{
			value: "second",
			name: "Second"
		}, {
	    value: "minute",
	    name: "Minute"
	  }, {
      value: "hour",
      name: "Hour"
    }, {
      value: "day",
      name: "Day"
    }, {
      value: "week",
      name: "Week"
    }, {
      value: "week_ending_saturday",
      name: "Week Ending Saturday"
    }, {
      value: "week_ending_sunday",
      name: "Week Ending Sunday"
    }, {
      value: "month",
      name: "Month"
    }, {
      value: "year",
      name: "Year"
    }
	];

	// user: any;

	constructor(protected http: HttpClient, protected modelService: ModelService, protected router: Router) {
		// this.user = this.locker.get(DRIVERS.LOCAL, 'user');
		this.modelService.setModel('fabric.dashboard.widget');
	}

	ngOnInit() {
		if(this.id) {
			this.loadData();
		}
		return;
	}

	ngOnDestroy() {
		return;
	}

	loadData(): void {
		this.modelService
			.read([this.id], ['name', 'dsl', 'height', 'width', 'x', 'y', 'height', 'width', 'type', 'data'])
			.subscribe((res: TrytonResponse) => {
				this.data = res;
			});
	}

	// TODO: Map to return only result
	loadModels(): Observable<TrytonResponse> {
		return this.modelService.invoke(
			'get_models',
			[]
		);
	}

	// TODO: Map to return only result
	loadFields(): Observable<TrytonResponse> {
		return this.modelService.invoke(
			'get_fields',
			[
				this.data.dsl.data.model
			]
		);
	}

	submit(ev: any) {
		if(this.edit) {
			this.modelService.write(this.data).subscribe();
		} else {
			this.modelService.create(this.data).subscribe();
		}
	}

	cancel(ev: any) {
		this.data = {};
		this.router.navigate(['/admin']);
	}

	checkType(types: string[], type: string): boolean {
		return types.indexOf(type) != -1;
	}

}