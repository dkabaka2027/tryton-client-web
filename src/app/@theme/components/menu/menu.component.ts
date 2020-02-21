/**
* @license
* Copyright Akveo. All Rights Reserved.
* Licensed under the MIT License. See License.txt in the project root for license information.
*/

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Inject,
  DoCheck,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { NB_WINDOW } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { Actions } from '../../../services/action';
import { Locker, DRIVERS } from 'angular-safeguard';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, of as observableOf } from 'rxjs';
import { takeWhile, filter, map, catchError } from 'rxjs/operators';
import { TrytonResponse } from '../../../services/admin.resources.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActionDialogComponent } from '../../../components/dialogs/action/action.dialog.component';
import { ɵa as NbMenuInternalService, NbMenuService, NbDialogService, NbLayoutDirectionService, NbMenuItem, NbMenuBag, NbMenuComponent, NbMenuItemComponent, NbToggleStates} from '@nebular/theme';

@Component({
  selector: '[fcMenuItem]',
  styleUrls: ['./menu.component.scss'],
  templateUrl: './menu-item.component.html',
  animations: [
    trigger('toggle', [
      state(NbToggleStates.Collapsed, style({ height: '0', margin: '0' })),
      state(NbToggleStates.Expanded, style({ height: '*' })),
      transition(`${NbToggleStates.Collapsed} <=> ${NbToggleStates.Expanded}`, animate(300)),
    ]),
  ],
})
export class FcMenuItemComponent extends NbMenuItemComponent {

    constructor(
      protected menuService: NbMenuService,
      protected directionService: NbLayoutDirectionService,
      protected dialogService: NbDialogService
    ) {
      super(menuService, directionService);
    }

    onItemClick(item: NbMenuItem) {
      console.log('Item', item);
      if(item.data.action) {
        this.dialogService.open(ActionDialogComponent, {
          closeOnEsc: true,
          context: {
            id: item.data.action.id,
            action: item.data.action.action,
            action_id: item.data.action.action_id,
            active_ids: item.data.action.active_ids,
            active_model: item.data.action.active_model,
            title: item.data.action.title,
            buttons: item.data.action.buttons,
            defaults: item.data.action.defaults,
            fields: item.data.action.field_view,
            state: item.data.action.state,
            window: item.data.action.window
          }
        }).onClose.subscribe((result: any) => {
          // TODO: Figure out what to do with the data
        });
        // TODO: See what this does
        this.itemClick.emit(item);
      } else {
        this.itemClick.emit(item);
      }
    }

}

@Component({
  selector: 'nb-menu',
  styleUrls: ['./menu.component.scss'],
  template: `
    <ul class="menu-items">
      <ng-container *ngFor="let item of items">
        <li fcMenuItem *ngIf="!item.hidden"
            [menuItem]="item"
            [class.menu-group]="item.group"
            (hoverItem)="onHoverItem($event)"
            (toggleSubMenu)="onToggleSubMenu($event)"
            (selectItem)="onSelectItem($event)"
            (itemClick)="onItemClick($event)"
            class="menu-item">
        </li>
      </ng-container>
    </ul>
  `,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FcMenuComponent extends NbMenuComponent {
  user: any;

  constructor(
    @Inject(NB_WINDOW) protected window,
    protected menuInternalService: NbMenuInternalService,
    protected router: Router,
    protected http: HttpClient,
    protected locker: Locker,
    protected actions: Actions,
    protected cd: ChangeDetectorRef 
  ) {
    super(window, menuInternalService, router);
    this.user = this.locker.get(DRIVERS.LOCAL, 'user');
  }

  onToggleSubMenu(item: NbMenuItem) {
    if (this.autoCollapse) {
      if(item.children.length === 0) {
        this.fetchChildren(item);
      }
      this.menuInternalService.collapseAll(this.items, this.tag, item);
    }

    if(item.children.length === 0) {
      this.fetchChildren(item);
    }
    
    item.expanded = !item.expanded;
    this.menuInternalService.submenuToggle(item, this.tag);
  }

  protected fetchChildren(item: NbMenuItem): void {
    this.http.post(
      'http://localhost:4200/tryton/' + this.user.database + '/',
      {
        id: Math.floor(Math.random() * 100),
        method: 'model.ir.ui.menu.read',
        params: [
          item.data.children,
          ["active", "childs", "favorite", "icon", "name", "parent", "parent.rec_name", "rec_name", "_timestamp", "sequence", "action", "action_keywords."],
          { language: 'en_US', language_direction: 'ltr', groups: [1] }
        ]
      }
    )
    .pipe(
      map((res: TrytonResponse) => {
        const packs: string = '[tryton|gnuhealth|icon|health]+';
        item.children = res.result.map((o: any) => {
          let pack: string = o.icon.match(packs)[0];
          // console.log('Creating SubMenu!', pack);
          var i: NbMenuItem = {
            title: o.name,
            icon: {icon: o.icon.replace('.', '-').replace(pack + '-', ''), pack: pack},
            data: {
              id: o.id
            }
          };

          if(o.childs.length > 0) {
            // item.group = true;
            i.children = [];
            i.data.children = o.childs;
          } else if(o.childs.length == 0) {
            // TODO: Get action_id from here
            const active_model: string = 'ir.ui.menu';
            this.actions.exec_keyword('tree_open', {
              model: active_model,
              id: o.id,
              ids: [o.id]
            }).subscribe((res: TrytonResponse) => {
              const id: number = res.id;
              // TODO:  Add next rpc call if res_model == undefined && if type == ir.action.wizard && wiz_name == undefined
              if(res.result[0].res_model != undefined && res.result[0].type != 'ir.action.wizard' && res.result[0].wiz_name == undefined) {
                i.link = 'model/' + res.result[0].res_model;
                console.log('Model: ', res.result[0].res_model);
                this.cd.detectChanges();
              } else {
                const wiz_name: string = res.result[0].wiz_name;
                this.http.post<TrytonResponse>(
                  'http://localhost:4200/tryton/' + this.user.database + '/',
                  {
                    id: Math.floor(Math.random() * 100),
                    method: 'wizard.' + wiz_name + '.create',
                    params: [
                      this.user.context
                    ]
                  }
                ).subscribe((re: TrytonResponse) => {
                  this.http.post<TrytonResponse>(
                    'http://localhost:4200/tryton/' + this.user.database + '/',
                    {
                      id: Math.floor(Math.random() * 100),
                      method: 'wizard.' + wiz_name + '.execute',
                      params: [
                        re.result[0],
                        {},
                        re.result[1],
                        this.user.context
                      ]
                    }
                  ).subscribe((r: TrytonResponse) => {
                    let keys: string[] = Object.keys(res.result);
                    console.log('Keys:', keys, r);
                    if(r.result.actions) {
                      i.link = 'model/' + r.result.actions[0][0].res_model;
                      i.queryParams = {
                        domain: r.result.actions[0][0].pyson_domain
                      };
                    } else if(r.result.view) {
                      i.data.action = {
                        id: id,
                        // Frigure out where to get active ids from
                        action: re.result[1],
                        action_id: o.id,
                        active_ids: o.id,
                        active_model: 'ir.ui.menu',
                        title: res.result[0].name || res.result[0].rec_name,
                        buttons: r.result.view.buttons,
                        defaults: r.result.view.defaults,
                        fields: r.result.view.fields_view,
                        state: r.result.view.state,
                        window: res.result[0].window
                      }
                      // TODO: Set a click handler to load a ActionDialogComponent
                    }
                    this.cd.detectChanges();
                  });
                })
              }
            });
          }
          return i;
        });
        this.cd.detectChanges();
      }),
      catchError((e: TrytonResponse) => {
        return observableOf(e.error);
      })
    )
    .subscribe();
  }

  onItemClick(item: NbMenuItem) {
    this.menuInternalService.itemClick(item, this.tag);
  }
}
