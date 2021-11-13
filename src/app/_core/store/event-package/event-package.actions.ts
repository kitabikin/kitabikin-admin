import { createAction, props } from '@ngrx/store';
import { EventPackageData } from '@models';

export enum EventPackageActionTypes {
  LoadAllEventPackage = '[EVENT PACKAGE] Load All Event Package',
  LoadAllEventPackageSuccess = '[EVENT PACKAGE] Load All Event Package Success',
  LoadAllEventPackageFailure = '[EVENT PACKAGE] Load All Event Package Failure',
  LoadEventPackage = '[EVENT PACKAGE] Load Event Package',
  LoadEventPackageSuccess = '[EVENT PACKAGE] Load Event Package Success',
  LoadEventPackageFailure = '[EVENT PACKAGE] Load Event Package Failure',
  CreateEventPackage = '[EVENT PACKAGE] Create Event Package',
  CreateEventPackageSuccess = '[EVENT PACKAGE] Create Event Package Success',
  CreateEventPackageFailure = '[EVENT PACKAGE] Create Event Package Failure',
  UpdateEventPackage = '[EVENT PACKAGE] Update Event Package',
  UpdateEventPackageSuccess = '[EVENT PACKAGE] Update Event Package Success',
  UpdateEventPackageFailure = '[EVENT PACKAGE] Update Event Package Failure',
  DeleteEventPackage = '[EVENT PACKAGE] Delete Event Package',
  DeleteEventPackageSuccess = '[EVENT PACKAGE] Delete Event Package Success',
  DeleteEventPackageFailure = '[EVENT PACKAGE] Delete Event Package Failure',
  ClearEventPackage = '[EVENT PACKAGE] Clear Event Package',
}

// Load All
export const loadAllEventPackage = createAction(
  EventPackageActionTypes.LoadAllEventPackage,
  props<{ params: any; pagination: boolean; infinite: boolean }>()
);

export const loadAllEventPackageSuccess = createAction(
  EventPackageActionTypes.LoadAllEventPackageSuccess,
  props<{ data: EventPackageData[]; pagination: any }>()
);

export const loadAllEventPackageFailure = createAction(
  EventPackageActionTypes.LoadAllEventPackageFailure,
  props<{ error: Error | any }>()
);

// Load Single
export const loadEventPackage = createAction(
  EventPackageActionTypes.LoadEventPackage,
  props<{ id: string; params: any }>()
);

export const loadEventPackageSuccess = createAction(
  EventPackageActionTypes.LoadEventPackageSuccess,
  props<{ data: EventPackageData }>()
);

export const loadEventPackageFailure = createAction(
  EventPackageActionTypes.LoadEventPackageFailure,
  props<{ error: Error | any }>()
);

// Create
export const createEventPackage = createAction(
  EventPackageActionTypes.CreateEventPackage,
  props<{ create: any }>()
);

export const createEventPackageSuccess = createAction(
  EventPackageActionTypes.CreateEventPackageSuccess,
  props<{ data: EventPackageData }>()
);

export const createEventPackageFailure = createAction(
  EventPackageActionTypes.CreateEventPackageFailure,
  props<{ error: Error | any }>()
);

// Update
export const updateEventPackage = createAction(
  EventPackageActionTypes.UpdateEventPackage,
  props<{ update: any }>()
);

export const updateEventPackageSuccess = createAction(
  EventPackageActionTypes.UpdateEventPackageSuccess,
  props<{ data: EventPackageData }>()
);

export const updateEventPackageFailure = createAction(
  EventPackageActionTypes.UpdateEventPackageFailure,
  props<{ error: Error | any }>()
);

// Delete
export const deleteEventPackage = createAction(
  EventPackageActionTypes.DeleteEventPackage,
  props<{ delete: any }>()
);

export const deleteEventPackageSuccess = createAction(
  EventPackageActionTypes.DeleteEventPackageSuccess,
  props<{ data: EventPackageData }>()
);

export const deleteEventPackageFailure = createAction(
  EventPackageActionTypes.DeleteEventPackageFailure,
  props<{ error: Error | any }>()
);

// Clear
export const clearEventPackage = createAction(EventPackageActionTypes.ClearEventPackage);

export const fromEventPackageActions = {
  loadAllEventPackage,
  loadAllEventPackageSuccess,
  loadAllEventPackageFailure,
  loadEventPackage,
  loadEventPackageSuccess,
  loadEventPackageFailure,
  createEventPackage,
  createEventPackageSuccess,
  createEventPackageFailure,
  updateEventPackage,
  updateEventPackageSuccess,
  updateEventPackageFailure,
  deleteEventPackage,
  deleteEventPackageSuccess,
  deleteEventPackageFailure,
  clearEventPackage,
};
