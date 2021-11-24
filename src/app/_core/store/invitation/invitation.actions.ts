import { createAction, props } from '@ngrx/store';
import { InvitationData } from '@models';

export enum InvitationActionTypes {
  LoadAllInvitation = '[INVITATION] Load All Invitation',
  LoadAllInvitationSuccess = '[INVITATION] Load All Invitation Success',
  LoadAllInvitationFailure = '[INVITATION] Load All Invitation Failure',
  LoadInvitation = '[INVITATION] Load Invitation',
  LoadInvitationSuccess = '[INVITATION] Load Invitation Success',
  LoadInvitationFailure = '[INVITATION] Load Invitation Failure',
  CreateInvitation = '[INVITATION] Create Invitation',
  CreateInvitationSuccess = '[INVITATION] Create Invitation Success',
  CreateInvitationFailure = '[INVITATION] Create Invitation Failure',
  UpdateInvitation = '[INVITATION] Update Invitation',
  UpdateInvitationSuccess = '[INVITATION] Update Invitation Success',
  UpdateInvitationFailure = '[INVITATION] Update Invitation Failure',
  DeleteInvitation = '[INVITATION] Delete Invitation',
  DeleteInvitationSuccess = '[INVITATION] Delete Invitation Success',
  DeleteInvitationFailure = '[INVITATION] Delete Invitation Failure',
  ClearInvitation = '[INVITATION] Clear Invitation',
}

// Load All
export const loadAllInvitation = createAction(
  InvitationActionTypes.LoadAllInvitation,
  props<{ params: any; pagination: boolean; infinite: boolean }>()
);

export const loadAllInvitationSuccess = createAction(
  InvitationActionTypes.LoadAllInvitationSuccess,
  props<{ data: InvitationData[]; pagination: any }>()
);

export const loadAllInvitationFailure = createAction(
  InvitationActionTypes.LoadAllInvitationFailure,
  props<{ error: Error | any }>()
);

// Load Single
export const loadInvitation = createAction(
  InvitationActionTypes.LoadInvitation,
  props<{ id: string; params: any }>()
);

export const loadInvitationSuccess = createAction(
  InvitationActionTypes.LoadInvitationSuccess,
  props<{ data: InvitationData }>()
);

export const loadInvitationFailure = createAction(
  InvitationActionTypes.LoadInvitationFailure,
  props<{ error: Error | any }>()
);

// Create
export const createInvitation = createAction(
  InvitationActionTypes.CreateInvitation,
  props<{ create: any }>()
);

export const createInvitationSuccess = createAction(
  InvitationActionTypes.CreateInvitationSuccess,
  props<{ data: InvitationData }>()
);

export const createInvitationFailure = createAction(
  InvitationActionTypes.CreateInvitationFailure,
  props<{ error: Error | any }>()
);

// Update
export const updateInvitation = createAction(
  InvitationActionTypes.UpdateInvitation,
  props<{ update: any }>()
);

export const updateInvitationSuccess = createAction(
  InvitationActionTypes.UpdateInvitationSuccess,
  props<{ data: InvitationData }>()
);

export const updateInvitationFailure = createAction(
  InvitationActionTypes.UpdateInvitationFailure,
  props<{ error: Error | any }>()
);

// Delete
export const deleteInvitation = createAction(
  InvitationActionTypes.DeleteInvitation,
  props<{ delete: any }>()
);

export const deleteInvitationSuccess = createAction(
  InvitationActionTypes.DeleteInvitationSuccess,
  props<{ data: InvitationData }>()
);

export const deleteInvitationFailure = createAction(
  InvitationActionTypes.DeleteInvitationFailure,
  props<{ error: Error | any }>()
);

// Clear
export const clearInvitation = createAction(InvitationActionTypes.ClearInvitation);

export const fromInvitationActions = {
  loadAllInvitation,
  loadAllInvitationSuccess,
  loadAllInvitationFailure,
  loadInvitation,
  loadInvitationSuccess,
  loadInvitationFailure,
  createInvitation,
  createInvitationSuccess,
  createInvitationFailure,
  updateInvitation,
  updateInvitationSuccess,
  updateInvitationFailure,
  deleteInvitation,
  deleteInvitationSuccess,
  deleteInvitationFailure,
  clearInvitation,
};
