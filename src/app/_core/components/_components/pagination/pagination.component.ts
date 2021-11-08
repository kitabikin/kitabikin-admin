import { Component, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { PaginationStore } from '@components/_components/pagination/pagination.store';

// PACKAGE
import { isEmpty } from 'lodash';

import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-pagination',
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PaginationStore],
})
export class PaginationComponent {
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  // Input
  @Input() set perPageItems(value: any[]) {
    this.paginationStore.setPerPageItems(value);
  }
  @Input() set isLoading(value: boolean) {
    this.paginationStore.setIsLoading(value);
  }
  @Input() set pagination(value: any) {
    this.paginationStore.setPagination(value);
  }
  @Input() set filterPerPage(value: number) {
    this.paginationStore.setFilterPerPage(value);
  }
  @Input() set filterPage(value: number) {
    this.paginationStore.setFilterPage(value);
  }

  // Output
  @Output() filterPagination = this.paginationStore.filter$;

  readonly vm$ = this.paginationStore.vm$;

  constructor(private readonly paginationStore: PaginationStore) {}

  changePerPage(event: any): void {
    const value = isEmpty(event) === false ? event.value : null;

    this.paginationStore.setFilterPerPage(value);
    this.paginationStore.setFilterPage(1);
  }

  changePage(event: any): void {
    const value = isEmpty(event) === false ? event.value : null;

    this.paginationStore.setFilterPage(value);
  }
}
