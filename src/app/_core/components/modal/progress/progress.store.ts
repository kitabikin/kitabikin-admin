import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface ProgressState {
  title: string;
  label: string;
  progress: number;
}

const DEFAULT_STATE: ProgressState = {
  title: '',
  label: '',
  progress: 0,
};

@Injectable()
export class ProgressStore extends ComponentStore<ProgressState> {
  constructor() {
    super(DEFAULT_STATE);
  }

  // *********** Updaters *********** //
  readonly setTitle = this.updater((state, value: string) => ({
    ...state,
    title: value || '',
  }));
  readonly setLabel = this.updater((state, value: string) => ({
    ...state,
    label: value || '',
  }));
  readonly setProgress = this.updater((state, value: number) => ({
    ...state,
    progress: value || 0,
  }));

  // *********** Selectors *********** //
  readonly getTitle$ = this.select(({ title }) => title);
  readonly getLabel$ = this.select(({ label }) => label);
  readonly getProgress$ = this.select(({ progress }) => progress);

  // ViewModel of Progress component
  readonly vm$ = this.select(
    this.state$,
    this.getTitle$,
    this.getLabel$,
    this.getProgress$,
    (state, getTitle, getLabel, getProgress) => ({
      title: state.title,
      label: state.label,
      progress: state.progress,
      getTitle,
      getLabel,
      getProgress,
    })
  );
}
