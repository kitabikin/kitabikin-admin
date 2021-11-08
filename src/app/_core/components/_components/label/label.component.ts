import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LabelStore } from '@components/_components/label/label.store';

@Component({
  selector: 'kb-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LabelStore],
})
export class LabelComponent {
  // Input
  @Input() set helperText(value: string | null) {
    this.labelStore.setHelperText(value);
  }
  @Input() set required(value: boolean) {
    this.labelStore.setRequired(value);
  }
  @Input() set invalid(value: boolean) {
    this.labelStore.setInvalid(value);
  }
  @Input() set invalidText(value: string | null) {
    this.labelStore.setInvalidText(value);
  }

  readonly vm$ = this.labelStore.vm$;

  constructor(private readonly labelStore: LabelStore) {}
}
