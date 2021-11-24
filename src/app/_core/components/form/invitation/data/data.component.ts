import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormGroup, FormArray } from '@angular/forms';
import { DataStore } from '@components/form/invitation/data/data.store';

import { DataBase } from './data-base';

// PACKAGE
import moment from 'moment';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const pad = (i: number): string => (i < 10 ? `0${i}` : `${i}`);

@Component({
  selector: 'kb-form-invitation-data',
  templateUrl: './data.component.html',
  styles: [
    `
      .accordion-button:focus {
        box-shadow: unset;
      }

      .accordion-button:not(.collapsed) {
        color: var(--bs-green-700);
        background-color: transparent;
        box-shadow: unset;
      }
    `,
  ],
  providers: [DataStore],
})
export class FormInvitationDataComponent implements OnInit {
  faCalendarAlt = faCalendarAlt;
  moment: any = moment;

  // Input
  tempCode!: string;
  @Input() set code(value: string) {
    this.tempCode = value;
    this.dataStore.setCode(value);
  }
  get code(): string {
    return this.tempCode;
  }

  tempDataBase!: DataBase<string>[] | null;
  @Input() set dataBase(value: DataBase<string>[] | null) {
    this.tempDataBase = value;
    this.dataStore.setDataBase(value);
  }
  get dataBase(): DataBase<string>[] | null {
    return this.tempDataBase;
  }

  tempFormGroup!: FormGroup;
  @Input() set formGroup(value: FormGroup) {
    this.tempFormGroup = value;
    this.dataStore.setFormGroup(value);
  }
  get formGroup(): FormGroup {
    return this.tempFormGroup;
  }

  tempFormArray!: FormArray;
  @Input() set formArray(value: FormArray) {
    this.tempFormArray = value;
    this.dataStore.setFormArray(value);
  }
  get formArray(): FormArray {
    return this.tempFormArray;
  }

  tempIsAddMode!: boolean;
  @Input() set isAddMode(value: boolean) {
    this.tempIsAddMode = value;
    this.dataStore.setIsAddMode(value);
  }
  get isAddMode(): boolean {
    return this.tempIsAddMode;
  }

  readonly vm$ = this.dataStore.vm$;

  constructor(
    private readonly dataStore: DataStore,
    private ngbDateParserFormatter: NgbDateParserFormatter
  ) {}

  ngOnInit(): void {}

  getFormValidation(control: AbstractControl | undefined): any {
    if (control?.invalid && (control?.dirty || control?.touched)) {
      let text: string | null = null;
      if (control?.errors?.['required']) {
        text = 'Harus diisi.';
      }

      return { invalid: true, text };
    }

    return { invalid: false, text: null };
  }

  get featureForm() {
    return this.formGroup.controls['invitation_feature'] as FormArray;
  }

  getDataForm(form: any) {
    return form.controls['invitation_feature_data'] as FormArray;
  }

  getDataDynamicForm(form: any) {
    return form.controls['dynamic'] as FormArray;
  }

  onChanges(event: any, options: any) {
    switch (options.control) {
      case 'switch':
        console.log(event.target.dataset.id, event.target.checked);
        break;
      case 'text':
        console.log(event.target.dataset.id, event.target.value);
        break;
      case 'file':
        console.log(options.id, event);
        break;
      case 'datepicker':
        const datepicker = this.ngbDateParserFormatter.format(event);
        console.log(options.id, datepicker);
        break;
      case 'timepicker':
        const timepicker =
          event != null ? `${pad(event.hour)}:${pad(event.minute)}:${pad(event.second)}` : null;
        console.log(options.id, timepicker);
        break;
      default:
        break;
    }
  }
}
