import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface TableHeadState {
  column: string;
  filter: any;
  isSortable: boolean;
  isFilterable: boolean;
  filterType: string;
  filterSearch: boolean;
  filterData: any;
}

const DEFAULT_STATE: TableHeadState = {
  column: '',
  filter: {},
  isSortable: false,
  isFilterable: false,
  filterType: 'checkbox',
  filterSearch: false,
  filterData: [],
};

@Injectable()
export class TableHeadStore extends ComponentStore<TableHeadState> {
  constructor() {
    super(DEFAULT_STATE);
  }

  // *********** Updaters *********** //
  readonly setColumn = this.updater((state, value: string) => ({
    ...state,
    column: value || '',
  }));

  readonly setFilter = this.updater((state, value: any) => ({
    ...state,
    filter: value || {},
  }));

  readonly setIsSortable = this.updater((state, value: boolean) => ({
    ...state,
    isSortable: value || false,
  }));

  readonly setIsFilterable = this.updater((state, value: boolean) => ({
    ...state,
    isFilterable: value || false,
  }));

  readonly setFilterType = this.updater((state, value: string) => ({
    ...state,
    filterType: value || 'checkbox',
  }));

  readonly setFilterSearch = this.updater((state, value: boolean) => ({
    ...state,
    filterSearch: value || false,
  }));

  readonly setFilterData = this.updater((state, value: any) => ({
    ...state,
    filterData: value || [],
  }));

  // *********** Selectors *********** //
  readonly getColumn$ = this.select(({ column }) => column);
  readonly getFilter$ = this.select(({ filter }) => filter);
  readonly getIsSortable$ = this.select(({ isSortable }) => isSortable);
  readonly getIsFilterable$ = this.select(({ isFilterable }) => isFilterable);
  readonly getFilterType$ = this.select(({ filterType }) => filterType);
  readonly getFilterSearch$ = this.select(({ filterSearch }) => filterSearch);
  readonly getFilterData$ = this.select(({ filterData }) => filterData);

  // ViewModel of TableHead component
  readonly vm$ = this.select(
    this.state$,
    this.getColumn$,
    this.getFilter$,
    this.getIsSortable$,
    this.getIsFilterable$,
    this.getFilterType$,
    this.getFilterSearch$,
    this.getFilterData$,
    (
      state,
      getColumn,
      getFilter,
      getIsSortable,
      getIsFilterable,
      getFilterType,
      getFilterSearch,
      getFilterData
    ) => ({
      column: state.column,
      filter: state.filter,
      isSortable: state.isSortable,
      isFilterable: state.isFilterable,
      filterType: state.filterType,
      filterSearch: state.filterSearch,
      filterData: state.filterData,
      getColumn,
      getFilter,
      getIsSortable,
      getIsFilterable,
      getFilterType,
      getFilterSearch,
      getFilterData,
    })
  );
}
