import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableHeadStore } from '@components/_components/table-head/table-head.store';

// PACKAGE
import { filter, map } from 'lodash';

@Component({
  selector: '[kb-table-head]',
  templateUrl: './table-head.component.html',
  styleUrls: ['./table-head.component.scss'],
  providers: [TableHeadStore],
})
export class TableHeadComponent {
  // Input
  @Input() set column(value: string) {
    this.tableHeadStore.setColumn(value);
  }

  iFilter!: any;
  @Input() set filter(value: any) {
    this.iFilter = value;
    this.tableHeadStore.setFilter(value);
  }
  get filter(): any {
    return this.iFilter;
  }

  @Input() set isSortable(value: boolean) {
    this.tableHeadStore.setIsSortable(value);
  }

  @Input() set isFilterable(value: boolean) {
    this.tableHeadStore.setIsFilterable(value);
  }

  @Input() set filterType(value: string) {
    this.tableHeadStore.setFilterType(value);
  }

  @Input() set filterSearch(value: boolean) {
    this.tableHeadStore.setFilterSearch(value);
  }

  iFilterData!: any;
  @Input() set filterData(value: any) {
    this.iFilterData = value;
    this.tableHeadStore.setFilterData(value);
  }
  get filterData(): any {
    return this.iFilterData;
  }

  @Output() emitFilterSort = new EventEmitter<any>();
  @Output() emitFilterFilter = new EventEmitter<any>();

  filterActive: any[] = [];

  readonly vm$ = this.tableHeadStore.vm$;

  constructor(private readonly tableHeadStore: TableHeadStore) {}

  getSortClassname(column: string): string {
    if (this.filter.sort !== column) {
      return '';
    }
    return this.filter.direction;
  }

  getFilterClassname(filterActive: any): string {
    return filterActive.length > 0 ? 'active' : '';
  }

  filterSort(column: string): void {
    this.emitFilterSort.emit(column);
  }

  filterFilter(): void {
    this.filterActive = map(filter(this.filterData, 'checked'), (result) => result.value);
    this.emitFilterFilter.emit(this.filterActive);
  }
}
