import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { InvitationGuestBookData } from '@models';
import { fromInvitationGuestBookActions } from '@store/invitation-guest-book/invitation-guest-book.actions';

export const ENTITY_FEATURE_KEY = 'invitationGuestBook';

export interface State extends EntityState<InvitationGuestBookData> {
  isLoadingList: boolean;
  isLoadingCreate: boolean;
  isLoadingRead: boolean;
  isLoadingUpdate: boolean;
  isLoadingDelete: boolean;
  metadata: any;
  pagination: any;
  error?: Error | any;
}

export const adapter: EntityAdapter<InvitationGuestBookData> = createEntityAdapter<InvitationGuestBookData>({
  selectId: (item) => String(item.id_invitation_guest_book),
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
  on(fromInvitationGuestBookActions.loadAllInvitationGuestBook, (state) => {
    return {
      ...state,
      isLoadingList: true,
      error: null,
    };
  }),
  on(fromInvitationGuestBookActions.loadAllInvitationGuestBookSuccess, (state: any, { data, pagination }) => {
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
  on(fromInvitationGuestBookActions.loadAllInvitationGuestBookFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingList: false,
      error,
    };
  }),

  // Load Single
  on(fromInvitationGuestBookActions.loadInvitationGuestBook, (state) => {
    return {
      ...state,
      isLoadingRead: true,
      error: null,
    };
  }),
  on(fromInvitationGuestBookActions.loadInvitationGuestBookSuccess, (state, { data }) => {
    return adapter.addOne(data, {
      ...state,
      isLoadingRead: false,
      error: { error: false },
    });
  }),
  on(fromInvitationGuestBookActions.loadInvitationGuestBookFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingRead: false,
      error,
    };
  }),

  // Create
  on(fromInvitationGuestBookActions.createInvitationGuestBook, (state) => {
    return {
      ...state,
      isLoadingCreate: true,
      error: null,
    };
  }),
  on(fromInvitationGuestBookActions.createInvitationGuestBookSuccess, (state, { data }) => {
    return adapter.addOne(data, {
      ...state,
      isLoadingCreate: false,
      error: { error: false },
    });
  }),
  on(fromInvitationGuestBookActions.createInvitationGuestBookFailure, (state, { error }) => {
    return {
      ...state,
      isLoadingCreate: false,
      error,
    };
  }),

  // Update
  on(fromInvitationGuestBookActions.updateInvitationGuestBook, (state) => {
    return {
      ...state,
      isLoadingUpdate: true,
      error: null,
    };
  }),
  on(fromInvitationGuestBookActions.updateInvitationGuestBookSuccess, (state, { data }) => {
    return adapter.updateOne(
      { id: String(data.id_invitation_guest_book), changes: data },
      {
        ...state,
        isLoadingUpdate: false,
        error: { error: false },
      }
    );
  }),
  on(fromInvitationGuestBookActions.updateInvitationGuestBookFailure, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),

  // Delete
  on(fromInvitationGuestBookActions.deleteInvitationGuestBook, (state) => {
    return {
      ...state,
      isLoadingDelete: true,
      error: null,
    };
  }),
  on(fromInvitationGuestBookActions.deleteInvitationGuestBookSuccess, (state, { data }) => {
    return adapter.removeOne(String(data.id_invitation_guest_book), {
      ...state,
      isLoadingDelete: false,
      error: { error: false },
    });
  }),
  on(fromInvitationGuestBookActions.deleteInvitationGuestBookFailure, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),

  // Clear
  on(fromInvitationGuestBookActions.clearInvitationGuestBook, (state) => {
    return adapter.removeAll({
      ...state,
      isLoadingList: false,
      pagination: { empty: true },
      error: { error: false },
    });
  })
);

export function InvitationGuestBookReducer(state: State | undefined, action: Action): any {
  return reducer(state, action);
}
