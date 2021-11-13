import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { ThemeCategoryData } from '@models';
import { fromThemeCategoryActions } from '@store/theme-category/theme-category.actions';

export const ENTITY_FEATURE_KEY = 'themeCategory';

export interface State extends EntityState<ThemeCategoryData> {
  isLoadingList: boolean;
  isLoadingCreate: boolean;
  isLoadingRead: boolean;
  isLoadingUpdate: boolean;
  isLoadingDelete: boolean;
  metadata: any;
  pagination: any;
  error?: Error | any;
}

export const adapter: EntityAdapter<ThemeCategoryData> = createEntityAdapter<ThemeCategoryData>({
  selectId: (item) => String(item.id_theme_category),
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
  on(fromThemeCategoryActions.loadAllThemeCategory, (state) => {
    return {
      ...state,
      isLoadingList: true,
      error: null,
    };
  }),
  on(fromThemeCategoryActions.loadAllThemeCategorySuccess, (state: any, { data, pagination }) => {
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
  on(fromThemeCategoryActions.loadAllThemeCategoryFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingList: false,
      error,
    };
  }),

  // Load Single
  on(fromThemeCategoryActions.loadThemeCategory, (state) => {
    return {
      ...state,
      isLoadingRead: true,
      error: null,
    };
  }),
  on(fromThemeCategoryActions.loadThemeCategorySuccess, (state, { data }) => {
    return adapter.addOne(data, {
      ...state,
      isLoadingRead: false,
      error: { error: false },
    });
  }),
  on(fromThemeCategoryActions.loadThemeCategoryFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingRead: false,
      error,
    };
  }),

  // Create
  on(fromThemeCategoryActions.createThemeCategory, (state) => {
    return {
      ...state,
      isLoadingCreate: true,
      error: null,
    };
  }),
  on(fromThemeCategoryActions.createThemeCategorySuccess, (state, { data }) => {
    return adapter.addOne(data, {
      ...state,
      isLoadingCreate: false,
      error: { error: false },
    });
  }),
  on(fromThemeCategoryActions.createThemeCategoryFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingCreate: false,
      error,
    };
  }),

  // Update
  on(fromThemeCategoryActions.updateThemeCategory, (state) => {
    return {
      ...state,
      isLoadingUpdate: true,
      error: null,
    };
  }),
  on(fromThemeCategoryActions.updateThemeCategorySuccess, (state, { data }) => {
    return adapter.updateOne(
      { id: String(data.id_theme_category), changes: data },
      {
        ...state,
        isLoadingUpdate: false,
        error: { error: false },
      }
    );
  }),
  on(fromThemeCategoryActions.updateThemeCategoryFailure, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),

  // Delete
  on(fromThemeCategoryActions.deleteThemeCategory, (state) => {
    return {
      ...state,
      isLoadingDelete: true,
      error: null,
    };
  }),
  on(fromThemeCategoryActions.deleteThemeCategorySuccess, (state, { data }) => {
    return adapter.removeOne(String(data.id_theme_category), {
      ...state,
      isLoadingDelete: false,
      error: { error: false },
    });
  }),
  on(fromThemeCategoryActions.deleteThemeCategoryFailure, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),

  // Clear
  on(fromThemeCategoryActions.clearThemeCategory, (state) => {
    return adapter.removeAll({
      ...state,
      isLoadingList: false,
      pagination: { empty: true },
      error: { error: false },
    });
  })
);

export function ThemeCategoryReducer(state: State | undefined, action: Action): any {
  return reducer(state, action);
}
