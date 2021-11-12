import { createAction, props } from '@ngrx/store';
import { EventData } from '@models';

export enum EventActionTypes {
  LoadAllEvent = '[EVENT] Load All Event',
  LoadAllEventSuccess = '[EVENT] Load All Event Success',
  LoadAllEventFailure = '[EVENT] Load All Event Failure',
  LoadEvent = '[EVENT] Load Event',
  LoadEventSuccess = '[EVENT] Load Event Success',
  LoadEventFailure = '[EVENT] Load Event Failure',
  CreateEvent = '[EVENT] Create Event',
  CreateEventSuccess = '[EVENT] Create Event Success',
  CreateEventFailure = '[EVENT] Create Event Failure',
  UpdateEvent = '[EVENT] Update Event',
  UpdateEventSuccess = '[EVENT] Update Event Success',
  UpdateEventFailure = '[EVENT] Update Event Failure',
  DeleteEvent = '[EVENT] Delete Event',
  DeleteEventSuccess = '[EVENT] Delete Event Success',
  DeleteEventFailure = '[EVENT] Delete Event Failure',
  ClearEvent = '[EVENT] Clear Event',
}

// Load All
export const loadAllEvent = createAction(
  EventActionTypes.LoadAllEvent,
  props<{ params: any; pagination: boolean; infinite: boolean }>()
);

export const loadAllEventSuccess = createAction(
  EventActionTypes.LoadAllEventSuccess,
  props<{ data: EventData[]; pagination: any }>()
);

export const loadAllEventFailure = createAction(
  EventActionTypes.LoadAllEventFailure,
  props<{ error: Error | any }>()
);

// Load Single
export const loadEvent = createAction(EventActionTypes.LoadEvent, props<{ id: string; params: any }>());

export const loadEventSuccess = createAction(EventActionTypes.LoadEventSuccess, props<{ data: EventData }>());

export const loadEventFailure = createAction(
  EventActionTypes.LoadEventFailure,
  props<{ error: Error | any }>()
);

// Create
export const createEvent = createAction(EventActionTypes.CreateEvent, props<{ create: any }>());

export const createEventSuccess = createAction(
  EventActionTypes.CreateEventSuccess,
  props<{ data: EventData }>()
);

export const createEventFailure = createAction(
  EventActionTypes.CreateEventFailure,
  props<{ error: Error | any }>()
);

// Update
export const updateEvent = createAction(EventActionTypes.UpdateEvent, props<{ update: any }>());

export const updateEventSuccess = createAction(
  EventActionTypes.UpdateEventSuccess,
  props<{ data: EventData }>()
);

export const updateEventFailure = createAction(
  EventActionTypes.UpdateEventFailure,
  props<{ error: Error | any }>()
);

// Delete
export const deleteEvent = createAction(EventActionTypes.DeleteEvent, props<{ delete: any }>());

export const deleteEventSuccess = createAction(
  EventActionTypes.DeleteEventSuccess,
  props<{ data: EventData }>()
);

export const deleteEventFailure = createAction(
  EventActionTypes.DeleteEventFailure,
  props<{ error: Error | any }>()
);

// Clear
export const clearEvent = createAction(EventActionTypes.ClearEvent);

export const fromEventActions = {
  loadAllEvent,
  loadAllEventSuccess,
  loadAllEventFailure,
  loadEvent,
  loadEventSuccess,
  loadEventFailure,
  createEvent,
  createEventSuccess,
  createEventFailure,
  updateEvent,
  updateEventSuccess,
  updateEventFailure,
  deleteEvent,
  deleteEventSuccess,
  deleteEventFailure,
  clearEvent,
};
