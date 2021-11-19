import { createAction, props } from '@ngrx/store';
import { ThemeFeatureData } from '@models';

export enum ThemeFeatureActionTypes {
  LoadAllThemeFeature = '[THEME FEATURE] Load All Theme Feature',
  LoadAllThemeFeatureSuccess = '[THEME FEATURE] Load All Theme Feature Success',
  LoadAllThemeFeatureFailure = '[THEME FEATURE] Load All Theme Feature Failure',
  LoadThemeFeature = '[THEME FEATURE] Load Theme Feature',
  LoadThemeFeatureSuccess = '[THEME FEATURE] Load Theme Feature Success',
  LoadThemeFeatureFailure = '[THEME FEATURE] Load Theme Feature Failure',
  CreateThemeFeature = '[THEME FEATURE] Create Theme Feature',
  CreateThemeFeatureSuccess = '[THEME FEATURE] Create Theme Feature Success',
  CreateThemeFeatureFailure = '[THEME FEATURE] Create Theme Feature Failure',
  UpdateThemeFeature = '[THEME FEATURE] Update Theme Feature',
  UpdateThemeFeatureSuccess = '[THEME FEATURE] Update Theme Feature Success',
  UpdateThemeFeatureFailure = '[THEME FEATURE] Update Theme Feature Failure',
  DeleteThemeFeature = '[THEME FEATURE] Delete Theme Feature',
  DeleteThemeFeatureSuccess = '[THEME FEATURE] Delete Theme Feature Success',
  DeleteThemeFeatureFailure = '[THEME FEATURE] Delete Theme Feature Failure',
  ClearThemeFeature = '[THEME FEATURE] Clear Theme Feature',
}

// Load All
export const loadAllThemeFeature = createAction(
  ThemeFeatureActionTypes.LoadAllThemeFeature,
  props<{ params: any; pagination: boolean; infinite: boolean }>()
);

export const loadAllThemeFeatureSuccess = createAction(
  ThemeFeatureActionTypes.LoadAllThemeFeatureSuccess,
  props<{ data: ThemeFeatureData[]; pagination: any }>()
);

export const loadAllThemeFeatureFailure = createAction(
  ThemeFeatureActionTypes.LoadAllThemeFeatureFailure,
  props<{ error: Error | any }>()
);

// Load Single
export const loadThemeFeature = createAction(
  ThemeFeatureActionTypes.LoadThemeFeature,
  props<{ id: string; params: any }>()
);

export const loadThemeFeatureSuccess = createAction(
  ThemeFeatureActionTypes.LoadThemeFeatureSuccess,
  props<{ data: ThemeFeatureData }>()
);

export const loadThemeFeatureFailure = createAction(
  ThemeFeatureActionTypes.LoadThemeFeatureFailure,
  props<{ error: Error | any }>()
);

// Create
export const createThemeFeature = createAction(
  ThemeFeatureActionTypes.CreateThemeFeature,
  props<{ create: any }>()
);

export const createThemeFeatureSuccess = createAction(
  ThemeFeatureActionTypes.CreateThemeFeatureSuccess,
  props<{ data: ThemeFeatureData }>()
);

export const createThemeFeatureFailure = createAction(
  ThemeFeatureActionTypes.CreateThemeFeatureFailure,
  props<{ error: Error | any }>()
);

// Update
export const updateThemeFeature = createAction(
  ThemeFeatureActionTypes.UpdateThemeFeature,
  props<{ update: any }>()
);

export const updateThemeFeatureSuccess = createAction(
  ThemeFeatureActionTypes.UpdateThemeFeatureSuccess,
  props<{ data: ThemeFeatureData }>()
);

export const updateThemeFeatureFailure = createAction(
  ThemeFeatureActionTypes.UpdateThemeFeatureFailure,
  props<{ error: Error | any }>()
);

// Delete
export const deleteThemeFeature = createAction(
  ThemeFeatureActionTypes.DeleteThemeFeature,
  props<{ delete: any }>()
);

export const deleteThemeFeatureSuccess = createAction(
  ThemeFeatureActionTypes.DeleteThemeFeatureSuccess,
  props<{ data: ThemeFeatureData }>()
);

export const deleteThemeFeatureFailure = createAction(
  ThemeFeatureActionTypes.DeleteThemeFeatureFailure,
  props<{ error: Error | any }>()
);

// Clear
export const clearThemeFeature = createAction(ThemeFeatureActionTypes.ClearThemeFeature);

export const fromThemeFeatureActions = {
  loadAllThemeFeature,
  loadAllThemeFeatureSuccess,
  loadAllThemeFeatureFailure,
  loadThemeFeature,
  loadThemeFeatureSuccess,
  loadThemeFeatureFailure,
  createThemeFeature,
  createThemeFeatureSuccess,
  createThemeFeatureFailure,
  updateThemeFeature,
  updateThemeFeatureSuccess,
  updateThemeFeatureFailure,
  deleteThemeFeature,
  deleteThemeFeatureSuccess,
  deleteThemeFeatureFailure,
  clearThemeFeature,
};
