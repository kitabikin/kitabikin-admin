import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  State,
  adapter,
  ENTITY_FEATURE_KEY,
} from '@store/invitation-guest-book/invitation-guest-book.reducers';

// Lookup feature state managed by NgRx
const getState = createFeatureSelector<State>(ENTITY_FEATURE_KEY);

// get the selectors
const { selectIds, selectAll } = adapter.getSelectors();

// select the array of ids
export const selectInvitationGuestBookIds = createSelector(getState, selectIds);

// select the array
export const selectAllInvitationGuestBook = createSelector(getState, selectAll);

// select the by id
export const selectInvitationGuestBook = (id: string) =>
  createSelector(getState, (state: State) => {
    return state.entities[id];
  });

// select the by title
export const selectInvitationGuestBookByTitle = (title: string) =>
  createSelector(getState, (state: State) => {
    return state.entities[title];
  });

// select the by multiple id
export const selectMultipleInvitationGuestBook = (ids: any[]) =>
  createSelector(getState, (state: State) => {
    const filtered = Object.keys(state.entities)
      .filter((key) => ids.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = state.entities[key];
        return obj;
      }, {});

    return Object.keys(filtered).map((key) => filtered[key]);
  });

// select loaded flag
export const selectIsLoadingList = createSelector(getState, (state) => state.isLoadingList);
export const selectIsLoadingCreate = createSelector(getState, (state) => state.isLoadingCreate);
export const selectIsLoadingRead = createSelector(getState, (state) => state.isLoadingRead);
export const selectIsLoadingUpdate = createSelector(getState, (state) => state.isLoadingUpdate);
export const selectIsLoadingDelete = createSelector(getState, (state) => state.isLoadingDelete);

// select metadata
export const selectMetadata = createSelector(getState, (state) => state.metadata);

// select pagination
export const selectPagination = createSelector(getState, (state) => state.pagination);

// select error
export const selectError = createSelector(getState, (state) => state.error);
