import { of as observableOf } from 'rxjs';
import { NbMenuItem } from '@nebular/theme';
import { MENU_ITEMS,  } from './pages-menu';
import { Decoder } from '../services/pyson';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Locker, DRIVERS } from 'angular-safeguard';
import { AdminResources, TrytonResponse } from '../services/admin.resources.service';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
  providers: [AdminResources],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagesComponent {
	user: any = {};
  menu: NbMenuItem[] = [];
  errors: any[] = [];

  constructor(protected resources: AdminResources, protected http: HttpClient, protected locker: Locker, protected cd: ChangeDetectorRef) {
  	// resources.preferences.subscribe();
  	resources.models.subscribe();
  	resources.icons.subscribe();
  	resources.viewSearch.subscribe();
  	resources.modelFields.subscribe();
  	resources.toolbar.subscribe();
  	resources.viewTree.subscribe();
  	// resources.menuSearch.subscribe();
  	// resources.menuSearchCount.subscribe();
  	resources.attachments.subscribe();
  	resources.notes.subscribe();

  	this.createMenu();
  }

  createMenu(): void {
  	this.resources.menuSearch.subscribe(()=> {
      this.resources.menu.subscribe((res: TrytonResponse) => {
        const packs: string = '[tryton|gnuhealth|icon|health]+';
        const result: any[] = res.result.sort((a: any, b: any) => {
          if(a.sequence < b.sequence) {
            return -1;
          }

          if(a.sequence > b.sequence) {
            return 1;
          }

          return 0;
        });
        
        result.map((o: any) => {
          let pack: string = o.icon.match(packs)[0];
          
          var item: NbMenuItem = {
            title: o.name,
            icon: {icon: o.icon.replace('.', '-').replace(pack + '-', ''), pack: pack},
            data: {
              id: o.id
            }
          };

          if(o.childs.length > 0) {
            // item.group = true;
            item.children = [];
            item.data.children = o.childs;
          }

          if(o.name == 'Dashboard' && o.childs.length == 0) {
            o.link = '/admin';
          }

          this.menu.push(item);

          return item;
        });
        this.cd.detectChanges();

      });
    });
  }

  createUrl(): string {
  	return '';
  }

}
