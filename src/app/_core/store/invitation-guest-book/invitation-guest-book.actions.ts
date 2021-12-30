import { createAction, props } from '@ngrx/store';
import { InvitationGuestBookData } from '@models';

export enum InvitationGuestBookActionTypes {
  LoadAllInvitationGuestBook = '[INVITATION GUEST BOOK] Load All Invitation Guest Book',
  LoadAllInvitationGuestBookSuccess = '[INVITATION GUEST BOOK] Load All Invitation Guest Book Success',
  LoadAllInvitationGuestBookFailure = '[INVITATION GUEST BOOK] Load All Invitation Guest Book Failure',
  LoadInvitationGuestBook = '[INVITATION GUEST BOOK] Load Invitation Guest Book',
  LoadInvitationGuestBookSuccess = '[INVITATION GUEST BOOK] Load Invitation Guest Book Success',
  LoadInvitationGuestBookFailure = '[INVITATION GUEST BOOK] Load Invitation Guest Book Failure',
  CreateInvitationGuestBook = '[INVITATION GUEST BOOK] Create Invitation Guest Book',
  CreateInvitationGuestBookSuccess = '[INVITATION GUEST BOOK] Create Invitation Guest Book Success',
  CreateInvitationGuestBookFailure = '[INVITATION GUEST BOOK] Create Invitation Guest Book Failure',
  UpdateInvitationGuestBook = '[INVITATION GUEST BOOK] Update Invitation Guest Book',
  UpdateInvitationGuestBookSuccess = '[INVITATION GUEST BOOK] Update Invitation Guest Book Success',
  UpdateInvitationGuestBookFailure = '[INVITATION GUEST BOOK] Update Invitation Guest Book Failure',
  DeleteInvitationGuestBook = '[INVITATION GUEST BOOK] Delete Invitation Guest Book',
  DeleteInvitationGuestBookSuccess = '[INVITATION GUEST BOOK] Delete Invitation Guest Book Success',
  DeleteInvitationGuestBookFailure = '[INVITATION GUEST BOOK] Delete Invitation Guest Book Failure',
  ImportInvitationGuestBook = '[INVITATION GUEST BOOK] Import Invitation Guest Book',
  ImportInvitationGuestBookSuccess = '[INVITATION GUEST BOOK] Import Invitation Guest Book Success',
  ImportInvitationGuestBookFailure = '[INVITATION GUEST BOOK] Import Invitation Guest Book Failure',
  ClearInvitationGuestBook = '[INVITATION GUEST BOOK] Clear Invitation Guest Book',
}

// Load All
export const loadAllInvitationGuestBook = createAction(
  InvitationGuestBookActionTypes.LoadAllInvitationGuestBook,
  props<{ params: any; pagination: boolean; infinite: boolean }>()
);

export const loadAllInvitationGuestBookSuccess = createAction(
  InvitationGuestBookActionTypes.LoadAllInvitationGuestBookSuccess,
  props<{ data: InvitationGuestBookData[]; pagination: any }>()
);

export const loadAllInvitationGuestBookFailure = createAction(
  InvitationGuestBookActionTypes.LoadAllInvitationGuestBookFailure,
  props<{ error: Error | any }>()
);

// Load Single
export const loadInvitationGuestBook = createAction(
  InvitationGuestBookActionTypes.LoadInvitationGuestBook,
  props<{ id: string; params: any }>()
);

export const loadInvitationGuestBookSuccess = createAction(
  InvitationGuestBookActionTypes.LoadInvitationGuestBookSuccess,
  props<{ data: InvitationGuestBookData }>()
);

export const loadInvitationGuestBookFailure = createAction(
  InvitationGuestBookActionTypes.LoadInvitationGuestBookFailure,
  props<{ error: Error | any }>()
);

// Create
export const createInvitationGuestBook = createAction(
  InvitationGuestBookActionTypes.CreateInvitationGuestBook,
  props<{ create: any }>()
);

export const createInvitationGuestBookSuccess = createAction(
  InvitationGuestBookActionTypes.CreateInvitationGuestBookSuccess,
  props<{ data: InvitationGuestBookData }>()
);

export const createInvitationGuestBookFailure = createAction(
  InvitationGuestBookActionTypes.CreateInvitationGuestBookFailure,
  props<{ error: Error | any }>()
);

// Update
export const updateInvitationGuestBook = createAction(
  InvitationGuestBookActionTypes.UpdateInvitationGuestBook,
  props<{ update: any }>()
);

export const updateInvitationGuestBookSuccess = createAction(
  InvitationGuestBookActionTypes.UpdateInvitationGuestBookSuccess,
  props<{ data: InvitationGuestBookData }>()
);

export const updateInvitationGuestBookFailure = createAction(
  InvitationGuestBookActionTypes.UpdateInvitationGuestBookFailure,
  props<{ error: Error | any }>()
);

// Delete
export const deleteInvitationGuestBook = createAction(
  InvitationGuestBookActionTypes.DeleteInvitationGuestBook,
  props<{ delete: any }>()
);

export const deleteInvitationGuestBookSuccess = createAction(
  InvitationGuestBookActionTypes.DeleteInvitationGuestBookSuccess,
  props<{ data: InvitationGuestBookData }>()
);

export const deleteInvitationGuestBookFailure = createAction(
  InvitationGuestBookActionTypes.DeleteInvitationGuestBookFailure,
  props<{ error: Error | any }>()
);

// Import
export const importInvitationGuestBook = createAction(
  InvitationGuestBookActionTypes.ImportInvitationGuestBook,
  props<{ import: any }>()
);

export const importInvitationGuestBookSuccess = createAction(
  InvitationGuestBookActionTypes.ImportInvitationGuestBookSuccess,
  props<{ data: InvitationGuestBookData[] }>()
);

export const importInvitationGuestBookFailure = createAction(
  InvitationGuestBookActionTypes.ImportInvitationGuestBookFailure,
  props<{ error: Error | any }>()
);

// Clear
export const clearInvitationGuestBook = createAction(InvitationGuestBookActionTypes.ClearInvitationGuestBook);

export const fromInvitationGuestBookActions = {
  loadAllInvitationGuestBook,
  loadAllInvitationGuestBookSuccess,
  loadAllInvitationGuestBookFailure,
  loadInvitationGuestBook,
  loadInvitationGuestBookSuccess,
  loadInvitationGuestBookFailure,
  createInvitationGuestBook,
  createInvitationGuestBookSuccess,
  createInvitationGuestBookFailure,
  updateInvitationGuestBook,
  updateInvitationGuestBookSuccess,
  updateInvitationGuestBookFailure,
  deleteInvitationGuestBook,
  deleteInvitationGuestBookSuccess,
  deleteInvitationGuestBookFailure,
  importInvitationGuestBook,
  importInvitationGuestBookSuccess,
  importInvitationGuestBookFailure,
  clearInvitationGuestBook,
};
