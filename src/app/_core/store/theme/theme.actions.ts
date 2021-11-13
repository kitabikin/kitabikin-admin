import { createAction, props } from '@ngrx/store';
import { ThemeData } from '@models';

export enum ThemeActionTypes {
  LoadAllTheme = '[THEME] Load All Theme',
  LoadAllThemeSuccess = '[THEME] Load All Theme Success',
  LoadAllThemeFailure = '[THEME] Load All Theme Failure',
  LoadTheme = '[THEME] Load Theme',
  LoadThemeSuccess = '[THEME] Load Theme Success',
  LoadThemeFailure = '[THEME] Load Theme Failure',
  CreateTheme = '[THEME] Create Theme',
  CreateThemeSuccess = '[THEME] Create Theme Success',
  CreateThemeFailure = '[THEME] Create Theme Failure',
  UpdateTheme = '[THEME] Update Theme',
  UpdateThemeSuccess = '[THEME] Update Theme Success',
  UpdateThemeFailure = '[THEME] Update Theme Failure',
  DeleteTheme = '[THEME] Delete Theme',
  DeleteThemeSuccess = '[THEME] Delete Theme Success',
  DeleteThemeFailure = '[THEME] Delete Theme Failure',
  ClearTheme = '[THEME] Clear Theme',
}

// Load All
export const loadAllTheme = createAction(
  ThemeActionTypes.LoadAllTheme,
  props<{ params: any; pagination: boolean; infinite: boolean }>()
);

export const loadAllThemeSuccess = createAction(
  ThemeActionTypes.LoadAllThemeSuccess,
  props<{ data: ThemeData[]; pagination: any }>()
);

export const loadAllThemeFailure = createAction(
  ThemeActionTypes.LoadAllThemeFailure,
  props<{ error: Error | any }>()
);

// Load Single
export const loadTheme = createAction(ThemeActionTypes.LoadTheme, props<{ id: string; params: any }>());

export const loadThemeSuccess = createAction(ThemeActionTypes.LoadThemeSuccess, props<{ data: ThemeData }>());

export const loadThemeFailure = createAction(
  ThemeActionTypes.LoadThemeFailure,
  props<{ error: Error | any }>()
);

// Create
export const createTheme = createAction(ThemeActionTypes.CreateTheme, props<{ create: any }>());

export const createThemeSuccess = createAction(
  ThemeActionTypes.CreateThemeSuccess,
  props<{ data: ThemeData }>()
);

export const createThemeFailure = createAction(
  ThemeActionTypes.CreateThemeFailure,
  props<{ error: Error | any }>()
);

// Update
export const updateTheme = createAction(ThemeActionTypes.UpdateTheme, props<{ update: any }>());

export const updateThemeSuccess = createAction(
  ThemeActionTypes.UpdateThemeSuccess,
  props<{ data: ThemeData }>()
);

export const updateThemeFailure = createAction(
  ThemeActionTypes.UpdateThemeFailure,
  props<{ error: Error | any }>()
);

// Delete
export const deleteTheme = createAction(ThemeActionTypes.DeleteTheme, props<{ delete: any }>());

export const deleteThemeSuccess = createAction(
  ThemeActionTypes.DeleteThemeSuccess,
  props<{ data: ThemeData }>()
);

export const deleteThemeFailure = createAction(
  ThemeActionTypes.DeleteThemeFailure,
  props<{ error: Error | any }>()
);

// Clear
export const clearTheme = createAction(ThemeActionTypes.ClearTheme);

export const fromThemeActions = {
  loadAllTheme,
  loadAllThemeSuccess,
  loadAllThemeFailure,
  loadTheme,
  loadThemeSuccess,
  loadThemeFailure,
  createTheme,
  createThemeSuccess,
  createThemeFailure,
  updateTheme,
  updateThemeSuccess,
  updateThemeFailure,
  deleteTheme,
  deleteThemeSuccess,
  deleteThemeFailure,
  clearTheme,
};
