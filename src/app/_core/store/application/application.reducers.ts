import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { ApplicationData } from '@models';
import { fromApplicationActions } from '@store/application/application.actions';

export const ENTITY_FEATURE_KEY = 'application';

export interface State extends EntityState<ApplicationData> {
  isLoadingList: boolean;
  isLoadingCreate: boolean;
  isLoadingRead: boolean;
  isLoadingUpdate: boolean;
  isLoadingDelete: boolean;
  metadata: any;
  pagination: any;
  error?: Error | any;
}

export const adapter: EntityAdapter<ApplicationData> = createEntityAdapter<ApplicationData>({
  selectId: (item) => String(item.id_application),
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
  on(fromApplicationActions.loadAllApplication, (state) => {
    return {
      ...state,
      isLoadingList: true,
      error: null,
    };
  }),
  on(fromApplicationActions.loadAllApplicationSuccess, (state: any, { data, pagination }) => {
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
  on(fromApplicationActions.loadAllApplicationFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingList: false,
      error,
    };
  }),

  // Load Single
  on(fromApplicationActions.loadApplication, (state) => {
    return {
      ...state,
      isLoadingRead: true,
      error: null,
    };
  }),
  on(fromApplicationActions.loadApplicationSuccess, (state, { data }) => {
    return adapter.addOne(data, {
      ...state,
      isLoadingRead: false,
      error: { error: false },
    });
  }),
  on(fromApplicationActions.loadApplicationFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingRead: false,
      error,
    };
  }),

  // Create
  on(fromApplicationActions.createApplication, (state) => {
    return {
      ...state,
      isLoadingCreate: true,
      error: null,
    };
  }),
  on(fromApplicationActions.createApplicationSuccess, (state, { data }) => {
    return adapter.addOne(data, {
      ...state,
      isLoadingCreate: false,
      error: { error: false },
    });
  }),
  on(fromApplicationActions.createApplicationFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingCreate: false,
      error,
    };
  }),

  // Update
  on(fromApplicationActions.updateApplication, (state) => {
    return {
      ...state,
      isLoadingUpdate: true,
      error: null,
    };
  }),
  on(fromApplicationActions.updateApplicationSuccess, (state, { data }) => {
    return adapter.updateOne(
      { id: String(data.id_application), changes: data },
      {
        ...state,
        isLoadingUpdate: false,
        error: { error: false },
      }
    );
  }),
  on(fromApplicationActions.updateApplicationFailure, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),

  // Delete
  on(fromApplicationActions.deleteApplication, (state) => {
    return {
      ...state,
      isLoadingDelete: true,
      error: null,
    };
  }),
  on(fromApplicationActions.deleteApplicationSuccess, (state, { data }) => {
    return adapter.removeOne(String(data.id_application), {
      ...state,
      isLoadingDelete: false,
      error: { error: false },
    });
  }),
  on(fromApplicationActions.deleteApplicationFailure, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),

  // Clear
  on(fromApplicationActions.clearApplication, (state) => {
    return adapter.removeAll({
      ...state,
      isLoadingList: false,
      pagination: { empty: true },
      error: { error: false },
    });
  })
);

export function ApplicationReducer(state: State | undefined, action: Action): any {
  return reducer(state, action);
}
