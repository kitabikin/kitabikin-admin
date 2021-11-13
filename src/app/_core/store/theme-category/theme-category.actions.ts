import { createAction, props } from '@ngrx/store';
import { ThemeCategoryData } from '@models';

export enum ThemeCategoryActionTypes {
  LoadAllThemeCategory = '[THEME CATEGORY] Load All Theme Category',
  LoadAllThemeCategorySuccess = '[THEME CATEGORY] Load All Theme Category Success',
  LoadAllThemeCategoryFailure = '[THEME CATEGORY] Load All Theme Category Failure',
  LoadThemeCategory = '[THEME CATEGORY] Load Theme Category',
  LoadThemeCategorySuccess = '[THEME CATEGORY] Load Theme Category Success',
  LoadThemeCategoryFailure = '[THEME CATEGORY] Load Theme Category Failure',
  CreateThemeCategory = '[THEME CATEGORY] Create Theme Category',
  CreateThemeCategorySuccess = '[THEME CATEGORY] Create Theme Category Success',
  CreateThemeCategoryFailure = '[THEME CATEGORY] Create Theme Category Failure',
  UpdateThemeCategory = '[THEME CATEGORY] Update Theme Category',
  UpdateThemeCategorySuccess = '[THEME CATEGORY] Update Theme Category Success',
  UpdateThemeCategoryFailure = '[THEME CATEGORY] Update Theme Category Failure',
  DeleteThemeCategory = '[THEME CATEGORY] Delete Theme Category',
  DeleteThemeCategorySuccess = '[THEME CATEGORY] Delete Theme Category Success',
  DeleteThemeCategoryFailure = '[THEME CATEGORY] Delete Theme Category Failure',
  ClearThemeCategory = '[THEME CATEGORY] Clear Theme Category',
}

// Load All
export const loadAllThemeCategory = createAction(
  ThemeCategoryActionTypes.LoadAllThemeCategory,
  props<{ params: any; pagination: boolean; infinite: boolean }>()
);

export const loadAllThemeCategorySuccess = createAction(
  ThemeCategoryActionTypes.LoadAllThemeCategorySuccess,
  props<{ data: ThemeCategoryData[]; pagination: any }>()
);

export const loadAllThemeCategoryFailure = createAction(
  ThemeCategoryActionTypes.LoadAllThemeCategoryFailure,
  props<{ error: Error | any }>()
);

// Load Single
export const loadThemeCategory = createAction(
  ThemeCategoryActionTypes.LoadThemeCategory,
  props<{ id: string; params: any }>()
);

export const loadThemeCategorySuccess = createAction(
  ThemeCategoryActionTypes.LoadThemeCategorySuccess,
  props<{ data: ThemeCategoryData }>()
);

export const loadThemeCategoryFailure = createAction(
  ThemeCategoryActionTypes.LoadThemeCategoryFailure,
  props<{ error: Error | any }>()
);

// Create
export const createThemeCategory = createAction(
  ThemeCategoryActionTypes.CreateThemeCategory,
  props<{ create: any }>()
);

export const createThemeCategorySuccess = createAction(
  ThemeCategoryActionTypes.CreateThemeCategorySuccess,
  props<{ data: ThemeCategoryData }>()
);

export const createThemeCategoryFailure = createAction(
  ThemeCategoryActionTypes.CreateThemeCategoryFailure,
  props<{ error: Error | any }>()
);

// Update
export const updateThemeCategory = createAction(
  ThemeCategoryActionTypes.UpdateThemeCategory,
  props<{ update: any }>()
);

export const updateThemeCategorySuccess = createAction(
  ThemeCategoryActionTypes.UpdateThemeCategorySuccess,
  props<{ data: ThemeCategoryData }>()
);

export const updateThemeCategoryFailure = createAction(
  ThemeCategoryActionTypes.UpdateThemeCategoryFailure,
  props<{ error: Error | any }>()
);

// Delete
export const deleteThemeCategory = createAction(
  ThemeCategoryActionTypes.DeleteThemeCategory,
  props<{ delete: any }>()
);

export const deleteThemeCategorySuccess = createAction(
  ThemeCategoryActionTypes.DeleteThemeCategorySuccess,
  props<{ data: ThemeCategoryData }>()
);

export const deleteThemeCategoryFailure = createAction(
  ThemeCategoryActionTypes.DeleteThemeCategoryFailure,
  props<{ error: Error | any }>()
);

// Clear
export const clearThemeCategory = createAction(ThemeCategoryActionTypes.ClearThemeCategory);

export const fromThemeCategoryActions = {
  loadAllThemeCategory,
  loadAllThemeCategorySuccess,
  loadAllThemeCategoryFailure,
  loadThemeCategory,
  loadThemeCategorySuccess,
  loadThemeCategoryFailure,
  createThemeCategory,
  createThemeCategorySuccess,
  createThemeCategoryFailure,
  updateThemeCategory,
  updateThemeCategorySuccess,
  updateThemeCategoryFailure,
  deleteThemeCategory,
  deleteThemeCategorySuccess,
  deleteThemeCategoryFailure,
  clearThemeCategory,
};
