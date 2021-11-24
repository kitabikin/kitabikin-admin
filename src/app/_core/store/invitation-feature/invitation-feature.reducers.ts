import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { InvitationFeatureData } from '@models';
import { fromInvitationFeatureActions } from '@store/invitation-feature/invitation-feature.actions';

export const ENTITY_FEATURE_KEY = 'invitationFeature';

export interface State extends EntityState<InvitationFeatureData> {
  isLoadingList: boolean;
  isLoadingCreate: boolean;
  isLoadingRead: boolean;
  isLoadingUpdate: boolean;
  isLoadingDelete: boolean;
  metadata: any;
  pagination: any;
  error?: Error | any;
}

export const adapter: EntityAdapter<InvitationFeatureData> = createEntityAdapter<InvitationFeatureData>({
  selectId: (item) => String(item.id_invitation_feature),
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
  on(fromInvitationFeatureActions.loadAllInvitationFeature, (state) => {
    return {
      ...state,
      isLoadingList: true,
      error: null,
    };
  }),
  on(fromInvitationFeatureActions.loadAllInvitationFeatureSuccess, (state: any, { data, pagination }) => {
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
  on(fromInvitationFeatureActions.loadAllInvitationFeatureFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingList: false,
      error,
    };
  }),

  // Load Single
  on(fromInvitationFeatureActions.loadInvitationFeature, (state) => {
    return {
      ...state,
      isLoadingRead: true,
      error: null,
    };
  }),
  on(fromInvitationFeatureActions.loadInvitationFeatureSuccess, (state, { data }) => {
    return adapter.addOne(data, {
      ...state,
      isLoadingRead: false,
      error: { error: false },
    });
  }),
  on(fromInvitationFeatureActions.loadInvitationFeatureFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingRead: false,
      error,
    };
  }),

  // Create
  on(fromInvitationFeatureActions.createInvitationFeature, (state) => {
    return {
      ...state,
      isLoadingCreate: true,
      error: null,
    };
  }),
  on(fromInvitationFeatureActions.createInvitationFeatureSuccess, (state, { data }) => {
    return adapter.addOne(data, {
      ...state,
      isLoadingCreate: false,
      error: { error: false },
    });
  }),
  on(fromInvitationFeatureActions.createInvitationFeatureFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingCreate: false,
      error,
    };
  }),

  // Update
  on(fromInvitationFeatureActions.updateInvitationFeature, (state) => {
    return {
      ...state,
      isLoadingUpdate: true,
      error: null,
    };
  }),
  on(fromInvitationFeatureActions.updateInvitationFeatureSuccess, (state, { data }) => {
    return adapter.updateOne(
      { id: String(data.id_invitation_feature), changes: data },
      {
        ...state,
        isLoadingUpdate: false,
        error: { error: false },
      }
    );
  }),
  on(fromInvitationFeatureActions.updateInvitationFeatureFailure, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),

  // Delete
  on(fromInvitationFeatureActions.deleteInvitationFeature, (state) => {
    return {
      ...state,
      isLoadingDelete: true,
      error: null,
    };
  }),
  on(fromInvitationFeatureActions.deleteInvitationFeatureSuccess, (state, { data }) => {
    return adapter.removeOne(String(data.id_invitation_feature), {
      ...state,
      isLoadingDelete: false,
      error: { error: false },
    });
  }),
  on(fromInvitationFeatureActions.deleteInvitationFeatureFailure, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),

  // Clear
  on(fromInvitationFeatureActions.clearInvitationFeature, (state) => {
    return adapter.removeAll({
      ...state,
      isLoadingList: false,
      pagination: { empty: true },
      error: { error: false },
    });
  })
);

export function InvitationFeatureReducer(state: State | undefined, action: Action): any {
  return reducer(state, action);
}
