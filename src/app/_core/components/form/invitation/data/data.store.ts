import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { FormGroup, FormArray } from '@angular/forms';

import { DataBase } from './data-base';

export interface DataState {
  code: string;
  dataBase: DataBase<string>[] | null;
  formGroup: FormGroup;
  formArray: FormArray;
  isAddMode: boolean;
}

const DEFAULT_STATE: DataState = {
  code: '',
  dataBase: [],
  formGroup: new FormGroup({}),
  formArray: new FormArray([]),
  isAddMode: true,
};

@Injectable()
export class DataStore extends ComponentStore<DataState> {
  constructor() {
    super(DEFAULT_STATE);
  }

  // *********** Updaters *********** //
  readonly setCode = this.updater((state, value: string) => ({
    ...state,
    code: value || '',
  }));

  readonly setDataBase = this.updater((state, value: DataBase<string>[] | null) => ({
    ...state,
    dataBase: value || [],
  }));

  readonly setFormGroup = this.updater((state, value: FormGroup) => ({
    ...state,
    formGroup: value || new FormGroup({}),
  }));

  readonly setFormArray = this.updater((state, value: FormArray) => ({
    ...state,
    formArray: value || new FormArray([]),
  }));

  readonly setIsAddMode = this.updater((state, value: boolean) => ({
    ...state,
    isAddMode: value || false,
  }));

  // *********** Selectors *********** //
  readonly getCode$ = this.select(({ code }) => code);
  readonly getDataBase$ = this.select(({ dataBase }) => dataBase);
  readonly getFormGroup$ = this.select(({ formGroup }) => formGroup);
  readonly getFormArray$ = this.select(({ formArray }) => formArray);
  readonly getIsAddMode$ = this.select(({ isAddMode }) => isAddMode);

  // ViewModel of Data component
  readonly vm$ = this.select(
    this.state$,
    this.getCode$,
    this.getDataBase$,
    this.getFormGroup$,
    this.getFormArray$,
    this.getIsAddMode$,
    (state, getCode, getDataBase, getFormGroup, getFormArray, getIsAddMode) => ({
      code: state.code,
      dataBase: state.dataBase,
      formGroup: state.formGroup,
      formArray: state.formArray,
      isAddMode: state.isAddMode,
      getCode,
      getDataBase,
      getFormGroup,
      getFormArray,
      getIsAddMode,
    })
  );
}
