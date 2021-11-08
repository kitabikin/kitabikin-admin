import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

// MODEL
import { Pagination } from '@interfaces';
import { Observable } from 'rxjs';
import { map, pairwise } from 'rxjs/operators';

export interface PaginationState {
  perPageItems: ReadonlySet<any>;
  pageItems: ReadonlySet<any>;
  isLoading: boolean;
  pagination: Pagination;
  filterPerPage: number;
  filterPage: number;
}

const DEFAULT_STATE: PaginationState = {
  perPageItems: new Set<any>([]),
  pageItems: new Set<any>([]),
  isLoading: false,
  pagination: { empty: true },
  filterPerPage: 5,
  filterPage: 1,
};

@Injectable()
export class PaginationStore extends ComponentStore<PaginationState> {
  constructor() {
    super(DEFAULT_STATE);
  }

  // *********** Updaters *********** //
  readonly setPerPageItems = this.updater((state, value: readonly any[]) => ({
    ...state,
    perPageItems: new Set<any>(value || []),
  }));

  readonly setIsLoading = this.updater((state, value: boolean) => ({
    ...state,
    isLoading: value || false,
  }));

  readonly setPagination = this.updater((state, value: any) => {
    const totalPages = value ? value.total_pages : 0;
    const options: any = [];
    for (let index = 1; index <= totalPages; index++) {
      options.push({ value: index, label: index.toString() });
    }

    return {
      ...state,
      pagination: value || null,
      pageItems: new Set<any>(options || []),
    };
  });

  readonly setFilterPerPage = this.updater((state, value: number) => ({
    ...state,
    filterPerPage: value,
  }));

  readonly setFilterPage = this.updater((state, value: number) => ({
    ...state,
    filterPage: value,
  }));

  // *********** Selectors *********** //
  readonly getPerPageItems$ = this.select(({ perPageItems }) => perPageItems);
  readonly getPageItems$ = this.select(({ pageItems }) => pageItems);
  readonly getIsLoading$ = this.select(({ isLoading }) => isLoading);
  readonly getPagination$ = this.select(({ pagination }) => pagination);
  readonly getFilterPerPage$ = this.select(({ filterPerPage }) => filterPerPage);
  readonly getFilterPage$ = this.select(({ filterPage }) => filterPage);

  // ViewModel of Paginator component
  readonly vm$ = this.select(
    this.state$,
    this.getPerPageItems$,
    this.getPageItems$,
    this.getIsLoading$,
    this.getPagination$,
    this.getFilterPerPage$,
    this.getFilterPage$,
    (state, getPerPageItems, getPageItems, getIsLoading, getPagination, getFilterPerPage, getFilterPage) => ({
      perPageItems: Array.from(state.perPageItems),
      pageItems: Array.from(state.pageItems),
      isLoading: state.isLoading,
      pagination: state.pagination,
      filterPerPage: state.filterPerPage,
      filterPage: state.filterPage,
      getPerPageItems,
      getPageItems,
      getIsLoading,
      getPagination,
      getFilterPerPage,
      getFilterPage,
    })
  );

  private readonly perPageChanges$ = this.state$.pipe(
    map((state) => state.filterPerPage),
    pairwise()
  );

  private readonly pageChanges$ = this.state$.pipe(
    map((state) => state.filterPage),
    pairwise()
  );

  readonly filter$: Observable<any> = this.select(
    this.perPageChanges$,
    this.pageChanges$,
    ([, filterPerPage], [, filterPage]) => ({
      perPage: filterPerPage,
      currentPage: filterPage,
    }),
    { debounce: true }
  );
}
