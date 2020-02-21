import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Locker, DRIVERS } from 'angular-safeguard';
import { Observable, of as observableOf } from 'rxjs';

export type TrytonResponse = {
  id: number;
  result?: any | any[] | number;
  error?: any | any[];
};

@Injectable({
	providedIn: 'root'
})
export class AdminResources {
  user: any;
  public preferences: Observable<TrytonResponse>;
  // Models
  public models: Observable<TrytonResponse>;
  public modelAccess: Observable<TrytonResponse>;
  public modelHistory: Observable<TrytonResponse>;
  public modelFields: Observable<TrytonResponse>;
  // Icons
  public icons: Observable<TrytonResponse>;
  // Menu
  public menu: Observable<TrytonResponse>;
  public menuSearch: Observable<TrytonResponse>;
  public menuSearchCount: Observable<TrytonResponse>;
  // Toolbar
  public toolbar: Observable<TrytonResponse>;
  // View
  public viewSearch: Observable<TrytonResponse>;
  public viewTree: Observable<TrytonResponse>;
  // Notes and Attachements
  public notes: Observable<TrytonResponse>;
  public attachments: Observable<TrytonResponse>;
  // Errors
  public errors: any[] = [];

  constructor(protected http: HttpClient, protected locker: Locker) {
    this.user = locker.get(DRIVERS.LOCAL, 'user');

    // this.preferences = this.getPreferences();
    this.models = this.getModels();
    this.icons = this.getIcons();
    this.viewSearch = this.getViewSearch();
    this.modelFields = this.getFields();
    this.toolbar = this.getToolbar();
    this.viewTree = this.getViewTree();
    this.menuSearch = this.getMenuSearch();
    this.attachments = this.getAttachments();
    this.notes = this.getNotes();
  }

  getPreferences(): Observable<TrytonResponse> {
    return this.http.post<TrytonResponse>(
      'http://localhost:4200/tryton/' + this.user.database + '/',
      {
        id: this.user.id,
        method: 'model.res.user.get_preferences',
        params: [
          false,
          this.user.context
        ]
      }
    ).pipe(
      map((res: TrytonResponse) => {
        this.locker.set(DRIVERS.LOCAL, 'preferences', res.result);
        return res;
      },
      catchError((res: TrytonResponse) => {
        return observableOf(res);
      }))
    );
  }

  getModels(): Observable<TrytonResponse> {
    // TODO: Refactor to dynamically get id
    return this.http.post<TrytonResponse>(
      'http://localhost:4200/tryton/' + this.user.database + '/',
      {
        id: 3,
        method: 'model.ir.model.list_models',
        params: [{language: 'en_US', language_direction: 'ltr', groups: [1]}]
      }
    ).pipe(
      map((res: TrytonResponse) => {
        this.modelHistory = this.getModelHistory();
        this.modelAccess = this.getModelAccess(res.result);
        return res;
      }),
      catchError((e: TrytonResponse) => {
        this.errors.push(e.error);
        return observableOf(e);
      })
    );
  }

  getModelHistory(): Observable<TrytonResponse> {
    return this.http.post<TrytonResponse>(
      'http://localhost:4200/tryton/' + this.user.database + '/',
      {
        id: 5,
        method: 'model.ir.model.list_history',
        params: [{language: 'en_US', language_direction: 'ltr', groups: [1]}]
      }
    );
  }

  getModelAccess(models: any[]): Observable<TrytonResponse> {
    return this.http.post<TrytonResponse>(
      'http://localhost:4200/tryton/' + this.user.database + '/',
      {
        id: 7,
        method: 'model.ir.model.access.get_access',
        params: [models, {language: 'en_US', language_direction: 'ltr', groups: [1]}]
      }
    );
  }

  getIcons(): Observable<TrytonResponse> {
    return this.http.post<TrytonResponse>(
      'http://localhost:4200/tryton/' + this.user.database + '/',
      {
        id: 4,
        method: 'model.ir.ui.icon.list_icons',
        params: [{language: 'en_US', language_direction: 'ltr', groups: [1]}]
      }
    );
  }

  getFields(): Observable<TrytonResponse> {
    return this.http.post<TrytonResponse>(
      'http://localhost:4200/tryton/' + this.user.database + '/',
      {
        id: 8,
        method: 'model.ir.ui.menu.fields_view_get',
        params: [3, 'tree', {language: 'en_US', language_direction: 'ltr', groups: [1]}]
      }
    );
  }

  getToolbar(): Observable<TrytonResponse> {
    return this.http.post<TrytonResponse>(
      'http://localhost:4200/tryton/' + this.user.database + '/',
      {
        id: 10,
        method: 'model.ir.ui.menu.view_toolbar_get',
        params: [{language: 'en_US', language_direction: 'ltr', groups: [1]}]
      }
    );
  }

  getViewTree(): Observable<TrytonResponse> {
    return this.http.post<TrytonResponse>(
      'http://localhost:4200/tryton/' + this.user.database + '/',
      {
        id: 11,
        method: 'model.ir.ui.view_tree_state.get',
        params: ['ir.ui.menu', '[["parent", "=", null]]', 'childs', {language: 'en_US', language_direction: 'ltr', groups: [1]}]
      }
    );
  }

  getViewSearch(): Observable<TrytonResponse> {
    return this.http.post<TrytonResponse>(
      'http://localhost:4200/tryton/' + this.user.database + '/',
      {
        id: 6,
        method: 'model.ir.ui.view_search.get_search',
        params: [{language: 'en_US', language_direction: 'ltr', groups: [1]}]
      }
    );
  }

  getMenuSearch(): Observable<TrytonResponse> {
    return this.http.post<TrytonResponse>(
      'http://localhost:4200/tryton/' + this.user.database + '/',
      {
        id: 13,
        method: 'model.ir.ui.menu.search',
        params: [
          [["parent", "=", null]],
          0,
          null,
          null,
          {language: 'en_US', language_direction: 'ltr', groups: [1]}
        ]
      }
    ).pipe(
      map((res: TrytonResponse) => {
        this.menuSearchCount = this.getMenuSearchCount();
        this.menu = this.getMenu(res.result);

        this.menuSearchCount.subscribe();
        // this.menu.subscribe();

        return res;
      }),
      catchError((e: TrytonResponse) => {
        return observableOf(e);
      })
    );
  }

  getMenuSearchCount(): Observable<TrytonResponse> {
    return this.http.post<TrytonResponse>(
      'http://localhost:4200/tryton/' + this.user.database + '/',
      {
        id: 13,
        method: 'model.ir.ui.menu.search_count',
        params: [
          [["parent", "=", null]],
          {language: 'en_US', language_direction: 'ltr', groups: [1]}
        ]
      }
    );
  }

  getMenu(items: any[]): Observable<TrytonResponse> {
    return this.http.post<TrytonResponse>(
      'http://localhost:4200/tryton/' + this.user.database + '/',
      {
        id: 13,
        method: 'model.ir.ui.menu.read',
        params: [
          items,
          ["active", "childs", "favorite", "icon", "name", "parent", "parent.rec_name", "rec_name", "_timestamp", "sequence", "action", 'action_keywords'],
          { language: 'en_US', language_direction: 'ltr', groups: [1] }
        ]
      }
    );
  }

  getAttachments(): Observable<TrytonResponse> {
    return this.http.post<TrytonResponse>(
      'http://localhost:4200/tryton/' + this.user.database + '/',
      {
        id: 13,
        method: 'model.ir.attachment.search_count',
        params: [
          [["resource", "=", "ir.ui.menu,1"]],
          { language: 'en_US', language_direction: 'ltr', groups: [1] }
        ]
      }
    );
  }

  getNotes(): Observable<TrytonResponse> {
    return this.http.post<TrytonResponse>(
      'http://localhost:4200/tryton/' + this.user.database + '/',
      {
        id: 19,
        method: 'model.ir.note.search_count',
        params: [
          [["resource", "=", "ir.ui.menu,1"], ["unread", "=", true]],
          { language: 'en_US', language_direction: 'ltr', groups: [1] }
        ]
      }
    );
  }

}
