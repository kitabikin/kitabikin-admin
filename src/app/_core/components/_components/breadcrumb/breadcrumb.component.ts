import { Component, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { BreadcrumbStore } from '@components/_components/breadcrumb/breadcrumb.store';

@Component({
  selector: 'kb-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BreadcrumbStore],
})
export class BreadcrumbComponent {
  // Input
  @Input() set data(value: any[]) {
    this.breadcrumbStore.setData(value);
  }

  readonly vm$ = this.breadcrumbStore.vm$;

  constructor(private readonly breadcrumbStore: BreadcrumbStore) {}
}
