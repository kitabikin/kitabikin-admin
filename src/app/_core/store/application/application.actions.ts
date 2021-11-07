import { createAction, props } from '@ngrx/store';
import { ApplicationData } from '@models';

export enum ApplicationActionTypes {
  LoadAllApplication = '[APPLICATION] Load All Application',
  LoadAllApplicationSuccess = '[APPLICATION] Load All Application Success',
  LoadAllApplicationFailure = '[APPLICATION] Load All Application Failure',
  LoadApplication = '[APPLICATION] Load Application',
  LoadApplicationSuccess = '[APPLICATION] Load Application Success',
  LoadApplicationFailure = '[APPLICATION] Load Application Failure',
  CreateApplication = '[APPLICATION] Create Application',
  CreateApplicationSuccess = '[APPLICATION] Create Application Success',
  CreateApplicationFailure = '[APPLICATION] Create Application Failure',
  UpdateApplication = '[APPLICATION] Update Application',
  UpdateApplicationSuccess = '[APPLICATION] Update Application Success',
  UpdateApplicationFailure = '[APPLICATION] Update Application Failure',
  DeleteApplication = '[APPLICATION] Delete Application',
  DeleteApplicationSuccess = '[APPLICATION] Delete Application Success',
  DeleteApplicationFailure = '[APPLICATION] Delete Application Failure',
  ClearApplication = '[APPLICATION] Clear Application',
}

// Load All
export const loadAllApplication = createAction(
  ApplicationActionTypes.LoadAllApplication,
  props<{ params: any; pagination: boolean; infinite: boolean }>()
);

export const loadAllApplicationSuccess = createAction(
  ApplicationActionTypes.LoadAllApplicationSuccess,
  props<{ data: ApplicationData[]; pagination: any }>()
);

export const loadAllApplicationFailure = createAction(
  ApplicationActionTypes.LoadAllApplicationFailure,
  props<{ error: Error | any }>()
);

// Load Single
export const loadApplication = createAction(
  ApplicationActionTypes.LoadApplication,
  props<{ id: number; params: any }>()
);

export const loadApplicationSuccess = createAction(
  ApplicationActionTypes.LoadApplicationSuccess,
  props<{ data: ApplicationData }>()
);

export const loadApplicationFailure = createAction(
  ApplicationActionTypes.LoadApplicationFailure,
  props<{ error: Error | any }>()
);

// Create
export const createApplication = createAction(
  ApplicationActionTypes.CreateApplication,
  props<{ create: any }>()
);

export const createApplicationSuccess = createAction(
  ApplicationActionTypes.CreateApplicationSuccess,
  props<{ data: ApplicationData }>()
);

export const createApplicationFailure = createAction(
  ApplicationActionTypes.CreateApplicationFailure,
  props<{ error: Error | any }>()
);

// Update
export const updateApplication = createAction(
  ApplicationActionTypes.UpdateApplication,
  props<{ update: any }>()
);

export const updateApplicationSuccess = createAction(
  ApplicationActionTypes.UpdateApplicationSuccess,
  props<{ data: ApplicationData }>()
);

export const updateApplicationFailure = createAction(
  ApplicationActionTypes.UpdateApplicationFailure,
  props<{ error: Error | any }>()
);

// Delete
export const deleteApplication = createAction(
  ApplicationActionTypes.DeleteApplication,
  props<{ delete: any }>()
);

export const deleteApplicationSuccess = createAction(
  ApplicationActionTypes.DeleteApplicationSuccess,
  props<{ data: ApplicationData }>()
);

export const deleteApplicationFailure = createAction(
  ApplicationActionTypes.DeleteApplicationFailure,
  props<{ error: Error | any }>()
);

// Clear
export const clearApplication = createAction(ApplicationActionTypes.ClearApplication);

export const fromApplicationActions = {
  loadAllApplication,
  loadAllApplicationSuccess,
  loadAllApplicationFailure,
  loadApplication,
  loadApplicationSuccess,
  loadApplicationFailure,
  createApplication,
  createApplicationSuccess,
  createApplicationFailure,
  updateApplication,
  updateApplicationSuccess,
  updateApplicationFailure,
  deleteApplication,
  deleteApplicationSuccess,
  deleteApplicationFailure,
  clearApplication,
};
