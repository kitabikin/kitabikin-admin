import { createAction, props } from '@ngrx/store';
import { InvitationFeatureData } from '@models';

export enum InvitationFeatureActionTypes {
  LoadAllInvitationFeature = '[INVITATION FEATURE] Load All Invitation Feature',
  LoadAllInvitationFeatureSuccess = '[INVITATION FEATURE] Load All Invitation Feature Success',
  LoadAllInvitationFeatureFailure = '[INVITATION FEATURE] Load All Invitation Feature Failure',
  LoadInvitationFeature = '[INVITATION FEATURE] Load Invitation Feature',
  LoadInvitationFeatureSuccess = '[INVITATION FEATURE] Load Invitation Feature Success',
  LoadInvitationFeatureFailure = '[INVITATION FEATURE] Load Invitation Feature Failure',
  CreateInvitationFeature = '[INVITATION FEATURE] Create Invitation Feature',
  CreateInvitationFeatureSuccess = '[INVITATION FEATURE] Create Invitation Feature Success',
  CreateInvitationFeatureFailure = '[INVITATION FEATURE] Create Invitation Feature Failure',
  UpdateInvitationFeature = '[INVITATION FEATURE] Update Invitation Feature',
  UpdateInvitationFeatureSuccess = '[INVITATION FEATURE] Update Invitation Feature Success',
  UpdateInvitationFeatureFailure = '[INVITATION FEATURE] Update Invitation Feature Failure',
  DeleteInvitationFeature = '[INVITATION FEATURE] Delete Invitation Feature',
  DeleteInvitationFeatureSuccess = '[INVITATION FEATURE] Delete Invitation Feature Success',
  DeleteInvitationFeatureFailure = '[INVITATION FEATURE] Delete Invitation Feature Failure',
  ClearInvitationFeature = '[INVITATION FEATURE] Clear Invitation Feature',
}

// Load All
export const loadAllInvitationFeature = createAction(
  InvitationFeatureActionTypes.LoadAllInvitationFeature,
  props<{ params: any; pagination: boolean; infinite: boolean }>()
);

export const loadAllInvitationFeatureSuccess = createAction(
  InvitationFeatureActionTypes.LoadAllInvitationFeatureSuccess,
  props<{ data: InvitationFeatureData[]; pagination: any }>()
);

export const loadAllInvitationFeatureFailure = createAction(
  InvitationFeatureActionTypes.LoadAllInvitationFeatureFailure,
  props<{ error: Error | any }>()
);

// Load Single
export const loadInvitationFeature = createAction(
  InvitationFeatureActionTypes.LoadInvitationFeature,
  props<{ id: string; params: any }>()
);

export const loadInvitationFeatureSuccess = createAction(
  InvitationFeatureActionTypes.LoadInvitationFeatureSuccess,
  props<{ data: InvitationFeatureData }>()
);

export const loadInvitationFeatureFailure = createAction(
  InvitationFeatureActionTypes.LoadInvitationFeatureFailure,
  props<{ error: Error | any }>()
);

// Create
export const createInvitationFeature = createAction(
  InvitationFeatureActionTypes.CreateInvitationFeature,
  props<{ create: any }>()
);

export const createInvitationFeatureSuccess = createAction(
  InvitationFeatureActionTypes.CreateInvitationFeatureSuccess,
  props<{ data: InvitationFeatureData }>()
);

export const createInvitationFeatureFailure = createAction(
  InvitationFeatureActionTypes.CreateInvitationFeatureFailure,
  props<{ error: Error | any }>()
);

// Update
export const updateInvitationFeature = createAction(
  InvitationFeatureActionTypes.UpdateInvitationFeature,
  props<{ update: any }>()
);

export const updateInvitationFeatureSuccess = createAction(
  InvitationFeatureActionTypes.UpdateInvitationFeatureSuccess,
  props<{ data: InvitationFeatureData }>()
);

export const updateInvitationFeatureFailure = createAction(
  InvitationFeatureActionTypes.UpdateInvitationFeatureFailure,
  props<{ error: Error | any }>()
);

// Delete
export const deleteInvitationFeature = createAction(
  InvitationFeatureActionTypes.DeleteInvitationFeature,
  props<{ delete: any }>()
);

export const deleteInvitationFeatureSuccess = createAction(
  InvitationFeatureActionTypes.DeleteInvitationFeatureSuccess,
  props<{ data: InvitationFeatureData }>()
);

export const deleteInvitationFeatureFailure = createAction(
  InvitationFeatureActionTypes.DeleteInvitationFeatureFailure,
  props<{ error: Error | any }>()
);

// Clear
export const clearInvitationFeature = createAction(InvitationFeatureActionTypes.ClearInvitationFeature);

export const fromInvitationFeatureActions = {
  loadAllInvitationFeature,
  loadAllInvitationFeatureSuccess,
  loadAllInvitationFeatureFailure,
  loadInvitationFeature,
  loadInvitationFeatureSuccess,
  loadInvitationFeatureFailure,
  createInvitationFeature,
  createInvitationFeatureSuccess,
  createInvitationFeatureFailure,
  updateInvitationFeature,
  updateInvitationFeatureSuccess,
  updateInvitationFeatureFailure,
  deleteInvitationFeature,
  deleteInvitationFeatureSuccess,
  deleteInvitationFeatureFailure,
  clearInvitationFeature,
};
