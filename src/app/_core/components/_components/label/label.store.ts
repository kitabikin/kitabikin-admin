import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface LabelState {
  helperText: string | null;
  required: boolean;
  invalid: boolean;
  invalidText: string | null;
  isLabel: boolean;
}

const DEFAULT_STATE: LabelState = {
  helperText: null,
  required: false,
  invalid: false,
  invalidText: null,
  isLabel: true,
};

@Injectable()
export class LabelStore extends ComponentStore<LabelState> {
  constructor() {
    super(DEFAULT_STATE);
  }

  // *********** Updaters *********** //
  readonly setHelperText = this.updater((state, value: string | null) => ({
    ...state,
    helperText: value || null,
  }));

  readonly setRequired = this.updater((state, value: boolean) => ({
    ...state,
    required: value || false,
  }));

  readonly setInvalid = this.updater((state, value: boolean) => ({
    ...state,
    invalid: value || false,
  }));

  readonly setInvalidText = this.updater((state, value: string | null) => ({
    ...state,
    invalidText: value || null,
  }));

  readonly setIsLabel = this.updater((state, value: boolean) => ({
    ...state,
    isLabel: value || false,
  }));

  // *********** Selectors *********** //
  readonly getHelperText$ = this.select(({ helperText }) => helperText);
  readonly getRequired$ = this.select(({ required }) => required);
  readonly getInvalid$ = this.select(({ invalid }) => invalid);
  readonly getInvalidText$ = this.select(({ invalidText }) => invalidText);
  readonly getIsLabel$ = this.select(({ isLabel }) => isLabel);

  // ViewModel of Label component
  readonly vm$ = this.select(
    this.state$,
    this.getHelperText$,
    this.getRequired$,
    this.getInvalid$,
    this.getInvalidText$,
    this.getIsLabel$,
    (state, getHelperText, getRequired, getInvalid, getInvalidText, getIsLabel) => ({
      helperText: state.helperText,
      required: state.required,
      invalid: state.invalid,
      invalidText: state.invalidText,
      isLabel: state.isLabel,
      getHelperText,
      getRequired,
      getInvalid,
      getInvalidText,
      getIsLabel,
    })
  );
}
