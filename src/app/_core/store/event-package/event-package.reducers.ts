import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { EventPackageData } from '@models';
import { fromEventPackageActions } from '@store/event-package/event-package.actions';

export const ENTITY_FEATURE_KEY = 'eventPackage';

export interface State extends EntityState<EventPackageData> {
  isLoadingList: boolean;
  isLoadingCreate: boolean;
  isLoadingRead: boolean;
  isLoadingUpdate: boolean;
  isLoadingDelete: boolean;
  metadata: any;
  pagination: any;
  error?: Error | any;
}

export const adapter: EntityAdapter<EventPackageData> = createEntityAdapter<EventPackageData>({
  selectId: (item) => String(item.id_event_package),
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
  on(fromEventPackageActions.loadAllEventPackage, (state) => {
    return {
      ...state,
      isLoadingList: true,
      error: null,
    };
  }),
  on(fromEventPackageActions.loadAllEventPackageSuccess, (state: any, { data, pagination }) => {
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
  on(fromEventPackageActions.loadAllEventPackageFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingList: false,
      error,
    };
  }),

  // Load Single
  on(fromEventPackageActions.loadEventPackage, (state) => {
    return {
      ...state,
      isLoadingRead: true,
      error: null,
    };
  }),
  on(fromEventPackageActions.loadEventPackageSuccess, (state, { data }) => {
    return adapter.addOne(data, {
      ...state,
      isLoadingRead: false,
      error: { error: false },
    });
  }),
  on(fromEventPackageActions.loadEventPackageFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingRead: false,
      error,
    };
  }),

  // Create
  on(fromEventPackageActions.createEventPackage, (state) => {
    return {
      ...state,
      isLoadingCreate: true,
      error: null,
    };
  }),
  on(fromEventPackageActions.createEventPackageSuccess, (state, { data }) => {
    return adapter.addOne(data, {
      ...state,
      isLoadingCreate: false,
      error: { error: false },
    });
  }),
  on(fromEventPackageActions.createEventPackageFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingCreate: false,
      error,
    };
  }),

  // Update
  on(fromEventPackageActions.updateEventPackage, (state) => {
    return {
      ...state,
      isLoadingUpdate: true,
      error: null,
    };
  }),
  on(fromEventPackageActions.updateEventPackageSuccess, (state, { data }) => {
    return adapter.updateOne(
      { id: String(data.id_event_package), changes: data },
      {
        ...state,
        isLoadingUpdate: false,
        error: { error: false },
      }
    );
  }),
  on(fromEventPackageActions.updateEventPackageFailure, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),

  // Delete
  on(fromEventPackageActions.deleteEventPackage, (state) => {
    return {
      ...state,
      isLoadingDelete: true,
      error: null,
    };
  }),
  on(fromEventPackageActions.deleteEventPackageSuccess, (state, { data }) => {
    return adapter.removeOne(String(data.id_event_package), {
      ...state,
      isLoadingDelete: false,
      error: { error: false },
    });
  }),
  on(fromEventPackageActions.deleteEventPackageFailure, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),

  // Clear
  on(fromEventPackageActions.clearEventPackage, (state) => {
    return adapter.removeAll({
      ...state,
      isLoadingList: false,
      pagination: { empty: true },
      error: { error: false },
    });
  })
);

export function EventPackageReducer(state: State | undefined, action: Action): any {
  return reducer(state, action);
}
