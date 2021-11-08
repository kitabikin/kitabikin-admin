import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface BreadcrumbState {
  data: ReadonlySet<any>;
}

const DEFAULT_STATE: BreadcrumbState = {
  data: new Set<any>([]),
};

@Injectable()
export class BreadcrumbStore extends ComponentStore<BreadcrumbState> {
  constructor() {
    super(DEFAULT_STATE);
  }

  // *********** Updaters *********** //
  readonly setData = this.updater((state, value: readonly any[]) => ({
    ...state,
    data: new Set<any>(value || []),
  }));

  // *********** Selectors *********** //
  readonly getData$ = this.select(({ data }) => data);

  // ViewModel of Breadcrumb component
  readonly vm$ = this.select(this.state$, this.getData$, (state, getData) => ({
    data: Array.from(state.data),
    getData,
  }));
}
