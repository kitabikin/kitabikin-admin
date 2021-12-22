import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { EventData } from '@models';
import { fromEventActions } from '@store/event/event.actions';

export const ENTITY_FEATURE_KEY = 'event';

export interface State extends EntityState<EventData> {
  isLoadingList: boolean;
  isLoadingCreate: boolean;
  isLoadingRead: boolean;
  isLoadingUpdate: boolean;
  isLoadingDelete: boolean;
  metadata: any;
  pagination: any;
  error?: Error | any;
}

export const adapter: EntityAdapter<EventData> = createEntityAdapter<EventData>({
  selectId: (item) => String(item.id_event),
});

export interface EntityPartialState {
  readonly [ENTITY_FEATURE_KEY]: State;
}

export const initialState: State = adapter.getInitialState({
  isLoadingList: false,
  isLoadingCreate: false,
  isLoadingRead: false,
  isLoadingUpdate: false,
  isLoadingDelete: false,
  metadata: null,
  pagination: null,
  error: null,
});

const reducer = createReducer(
  initialState,

  // Load All
  on(fromEventActions.loadAllEvent, (state) => {
    return {
      ...state,
      isLoadingList: true,
      error: null,
    };
  }),
  on(fromEventActions.loadAllEventSuccess, (state: any, { data, pagination }) => {
    if (!pagination.infinite) {
      return adapter.setAll(data, {
        ...state,
        isLoadingList: false,
        pagination,
        error: { error: false },
      });
    } else if (pagination.infinite) {
      if (pagination.current_page === 1) {
        return adapter.setAll(data, {
          ...state,
          isLoadingList: false,
          pagination,
          error: { error: false },
        });
      } else {
        return adapter.addMany(data, {
          ...state,
          isLoadingList: false,
          pagination,
          error: { error: false },
        });
      }
    }
  }),
  on(fromEventActions.loadAllEventFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingList: false,
      error,
    };
  }),

  // Load Single
  on(fromEventActions.loadEvent, (state) => {
    return {
      ...state,
      isLoadingRead: true,
      error: null,
    };
  }),
  on(fromEventActions.loadEventSuccess, (state, { data }) => {
    return adapter.addOne(data, {
      ...state,
      isLoadingRead: false,
      error: { error: false },
    });
  }),
  on(fromEventActions.loadEventFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingRead: false,
      error,
    };
  }),

  // Create
  on(fromEventActions.createEvent, (state) => {
    return {
      ...state,
      isLoadingCreate: true,
      error: null,
    };
  }),
  on(fromEventActions.createEventSuccess, (state, { data }) => {
    return adapter.addOne(data, {
      ...state,
      isLoadingCreate: false,
      error: { error: false },
    });
  }),
  on(fromEventActions.createEventFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingCreate: false,
      error,
    };
  }),

  // Update
  on(fromEventActions.updateEvent, (state) => {
    return {
      ...state,
      isLoadingUpdate: true,
      error: null,
    };
  }),
  on(fromEventActions.updateEventSuccess, (state, { data }) => {
    return adapter.updateOne(
      { id: String(data.id_event), changes: data },
      {
        ...state,
        isLoadingUpdate: false,
        error: { error: false },
      }
    );
  }),
  on(fromEventActions.updateEventFailure, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),

  // Delete
  on(fromEventActions.deleteEvent, (state) => {
    return {
      ...state,
      isLoadingDelete: true,
      error: null,
    };
  }),
  on(fromEventActions.deleteEventSuccess, (state, { data }) => {
    return adapter.removeOne(String(data.id_event), {
      ...state,
      isLoadingDelete: false,
      error: { error: false },
    });
  }),
  on(fromEventActions.deleteEventFailure, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),

  // Clear
  on(fromEventActions.clearEvent, (state) => {
    return adapter.removeAll({
      ...state,
      isLoadingList: false,
      pagination: { empty: true },
      error: { error: false },
    });
  })
);

export function EventReducer(state: State | undefined, action: Action): any {
  return reducer(state, action);
}
