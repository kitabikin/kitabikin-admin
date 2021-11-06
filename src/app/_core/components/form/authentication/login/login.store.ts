import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { FormGroup } from '@angular/forms';

export interface LoginState {
  formGroup: FormGroup;
  submitted: boolean;
  isLoading: boolean;
}

const DEFAULT_STATE: LoginState = {
  formGroup: new FormGroup({}),
  submitted: false,
  isLoading: false,
};

@Injectable()
export class LoginStore extends ComponentStore<LoginState> {
  constructor() {
    super(DEFAULT_STATE);
  }

  // *********** Updaters *********** //
  readonly setFormGroup = this.updater((state, value: any) => ({
    ...state,
    formGroup: value || new FormGroup({}),
  }));

  readonly setSubmitted = this.updater((state, value: boolean) => ({
    ...state,
    submitted: value || false,
  }));

  readonly setIsLoading = this.updater((state, value: boolean) => ({
    ...state,
    isLoading: value || false,
  }));

  // *********** Selectors *********** //
  readonly getFormGroup$ = this.select(({ formGroup }) => formGroup);
  readonly getSubmitted$ = this.select(({ submitted }) => submitted);
  readonly getIsLoading$ = this.select(({ isLoading }) => isLoading);

  // ViewModel of Login component
  readonly vm$ = this.select(
    this.state$,
    this.getFormGroup$,
    this.getSubmitted$,
    this.getIsLoading$,
    (state, getFormGroup, getSubmitted, getIsLoading) => ({
      formGroup: state.formGroup,
      submitted: state.submitted,
      isLoading: state.isLoading,
      getFormGroup,
      getSubmitted,
      getIsLoading,
    })
  );
}
