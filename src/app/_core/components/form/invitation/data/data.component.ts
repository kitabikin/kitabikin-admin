import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { DataStore } from '@components/form/invitation/data/data.store';

import { DataBase } from './data-base';

// SERVICE
import { InvitationFeatureService, InvitationFeatureDataColumnService } from '@services';

// PACKAGE
import { find } from 'lodash';
import moment from 'moment';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { map, assign } from 'lodash';

const pad = (i: number): string => (i < 10 ? `0${i}` : `${i}`);

@Component({
  selector: 'kb-form-invitation-data',
  templateUrl: './data.component.html',
  styles: [
    `
      .accordion-button {
        background-color: var(--bs-green-50);
      }
      .accordion-button:focus {
        box-shadow: unset;
      }

      .accordion-button:not(.collapsed) {
        color: var(--bs-green-700);
        background-color: var(--bs-green-50);
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

  @Output() emitDynamicColumnAdd = new EventEmitter<any>();
  @Output() emitDynamicColumnDelete = new EventEmitter<any>();

  readonly vm$ = this.dataStore.vm$;

  constructor(
    private cdRef: ChangeDetectorRef,
    private readonly dataStore: DataStore,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private featureService: InvitationFeatureService,
    private dataService: InvitationFeatureDataColumnService,
    private fb: FormBuilder
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

  addDynamicColumn(i: number, j: number, id: string) {
    const obj = {
      indexFeature: i,
      indexData: j,
      id,
    };

    this.emitDynamicColumnAdd.emit(obj);
  }

  deleteDynamicColumn(i: number, j: number, k: number) {
    const obj = {
      indexFeature: i,
      indexData: j,
      indexDynamic: k,
    };

    this.emitDynamicColumnDelete.emit(obj);
  }

  formatValue(value: any, control = '') {
    let newValue;
    switch (control) {
      case 'datepicker':
        const datepicker = this.ngbDateParserFormatter.format(value);
        newValue = datepicker;
        break;
      case 'timepicker':
        if (value !== null) {
          newValue = `${pad(value.hour)}:${pad(value.minute)}:${pad(value.second)}`;
        } else {
          newValue = null;
        }
        break;
      default:
        newValue = value;
        break;
    }

    return newValue;
  }

  onChangesFeature(options: any) {
    const value = options.form.controls['is_active'].value;

    const body = {
      id_invitation_feature: options.id,
      is_active: value,
    };

    // console.log(body);
    this.featureService.updateItem(options.id, body).subscribe();
  }

  onChangesIsActive(options: any) {
    const value = options.normal.controls['is_active'].value;

    const body = {
      id_invitation_feature_data: options.id,
      is_active: value,
    };

    // console.log(body);
    this.dataService.updateItem(options.id, body).subscribe();
  }

  onChangesNormal(options: any) {
    const value = options.normal.controls['value'].value;

    const body = {
      id_invitation_feature_data: options.id,
      value: this.formatValue(value, options.control),
    };

    // console.log(body);
    this.dataService.updateItem(options.id, body).subscribe();
  }

  onChangesDynamic(options: any) {
    const value = options.dynamic.controls['dynamic'].value;

    const newData: any[] = [];
    map(value, (item: any) => {
      const body = {};
      map(Object.keys(item), (key: any) => {
        if (key !== 'id_invitation_feature_data') {
          const findControl = find(options.base, { key: key });
          const control = findControl ? findControl.controlType : null;
          assign(body, { [key]: this.formatValue(item[key], control) });
        }
      });
      newData.push(body);
    });

    const body = {
      id_invitation_feature_data: options.id,
      value: JSON.stringify(newData),
    };

    // console.log(body);
    this.dataService.updateItem(options.id, body).subscribe();
  }
}
