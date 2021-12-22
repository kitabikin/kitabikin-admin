import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { FormGroup } from '@angular/forms';

export interface AddEditState {
  formGroup: FormGroup;
  isAddMode: boolean;
}

const DEFAULT_STATE: AddEditState = {
  formGroup: new FormGroup({}),
  isAddMode: true,
};

@Injectable()
export class AddEditStore extends ComponentStore<AddEditState> {
  constructor() {
    super(DEFAULT_STATE);
  }

  // *********** Updaters *********** //
  readonly setFormGroup = this.updater((state, value: FormGroup) => ({
    ...state,
    formGroup: value || new FormGroup({}),
  }));

  readonly setIsAddMode = this.updater((state, value: boolean) => ({
    ...state,
    isAddMode: value || false,
  }));

  // *********** Selectors *********** //
  readonly getFormGroup$ = this.select(({ formGroup }) => formGroup);
  readonly getIsAddMode$ = this.select(({ isAddMode }) => isAddMode);

  // ViewModel of AddEdit component
  readonly vm$ = this.select(
    this.state$,
    this.getFormGroup$,
    this.getIsAddMode$,
    (state, getFormGroup, getIsAddMode) => ({
      formGroup: state.formGroup,
      isAddMode: state.isAddMode,
      getFormGroup,
      getIsAddMode,
    })
  );
}
