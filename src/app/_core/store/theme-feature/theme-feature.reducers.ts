import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { ThemeFeatureData } from '@models';
import { fromThemeFeatureActions } from '@store/theme-feature/theme-feature.actions';

export const ENTITY_FEATURE_KEY = 'themeFeature';

export interface State extends EntityState<ThemeFeatureData> {
  isLoadingList: boolean;
  isLoadingCreate: boolean;
  isLoadingRead: boolean;
  isLoadingUpdate: boolean;
  isLoadingDelete: boolean;
  metadata: any;
  pagination: any;
  error?: Error | any;
}

export const adapter: EntityAdapter<ThemeFeatureData> = createEntityAdapter<ThemeFeatureData>({
  selectId: (item) => String(item.id_theme_feature),
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
  on(fromThemeFeatureActions.loadAllThemeFeature, (state) => {
    return {
      ...state,
      isLoadingList: true,
      error: null,
    };
  }),
  on(fromThemeFeatureActions.loadAllThemeFeatureSuccess, (state: any, { data, pagination }) => {
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
  on(fromThemeFeatureActions.loadAllThemeFeatureFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingList: false,
      error,
    };
  }),

  // Load Single
  on(fromThemeFeatureActions.loadThemeFeature, (state) => {
    return {
      ...state,
      isLoadingRead: true,
      error: null,
    };
  }),
  on(fromThemeFeatureActions.loadThemeFeatureSuccess, (state, { data }) => {
    return adapter.addOne(data, {
      ...state,
      isLoadingRead: false,
      error: { error: false },
    });
  }),
  on(fromThemeFeatureActions.loadThemeFeatureFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingRead: false,
      error,
    };
  }),

  // Create
  on(fromThemeFeatureActions.createThemeFeature, (state) => {
    return {
      ...state,
      isLoadingCreate: true,
      error: null,
    };
  }),
  on(fromThemeFeatureActions.createThemeFeatureSuccess, (state, { data }) => {
    return adapter.addOne(data, {
      ...state,
      isLoadingCreate: false,
      error: { error: false },
    });
  }),
  on(fromThemeFeatureActions.createThemeFeatureFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingCreate: false,
      error,
    };
  }),

  // Update
  on(fromThemeFeatureActions.updateThemeFeature, (state) => {
    return {
      ...state,
      isLoadingUpdate: true,
      error: null,
    };
  }),
  on(fromThemeFeatureActions.updateThemeFeatureSuccess, (state, { data }) => {
    return adapter.updateOne(
      { id: String(data.id_theme_feature), changes: data },
      {
        ...state,
        isLoadingUpdate: false,
        error: { error: false },
      }
    );
  }),
  on(fromThemeFeatureActions.updateThemeFeatureFailure, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),

  // Delete
  on(fromThemeFeatureActions.deleteThemeFeature, (state) => {
    return {
      ...state,
      isLoadingDelete: true,
      error: null,
    };
  }),
  on(fromThemeFeatureActions.deleteThemeFeatureSuccess, (state, { data }) => {
    return adapter.removeOne(String(data.id_theme_feature), {
      ...state,
      isLoadingDelete: false,
      error: { error: false },
    });
  }),
  on(fromThemeFeatureActions.deleteThemeFeatureFailure, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),

  // Clear
  on(fromThemeFeatureActions.clearThemeFeature, (state) => {
    return adapter.removeAll({
      ...state,
      isLoadingList: false,
      pagination: { empty: true },
      error: { error: false },
    });
  })
);

export function ThemeFeatureReducer(state: State | undefined, action: Action): any {
  return reducer(state, action);
}
