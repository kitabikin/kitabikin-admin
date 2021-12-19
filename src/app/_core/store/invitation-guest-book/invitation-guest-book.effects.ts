import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { undo } from 'ngrx-undo';

import { fromInvitationGuestBookActions } from '@store/invitation-guest-book/invitation-guest-book.actions';
import { InvitationGuestBookService } from '@services';

const handlePromise = async (promise: Promise<any>) => {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (error) {
    return await Promise.resolve([undefined, error]);
  }
};

@Injectable()
export class InvitationGuestBookEffects {
  name = 'Invitation Guest Book';
  messageNotFound = ['Data not found.', 'Data not found'];

  loadAllInvitationGuestBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromInvitationGuestBookActions.loadAllInvitationGuestBook),
      switchMap(async (action) => {
        const [result, resultErr] = await handlePromise(
          lastValueFrom(this.invitationGuestBookService.getList(action.params))
        );

        if (resultErr) {
          return this.loadAllFailure(resultErr.message);
        }

        if (result.error === 1) {
          if (this.messageNotFound.includes(result.message)) {
            return fromInvitationGuestBookActions.clearInvitationGuestBook();
          } else {
            return this.loadAllFailure(result.message);
          }
        }

        let pagination = { empty: true, infinite: action.infinite };
        if (action.pagination) {
          pagination = { empty: false, infinite: action.infinite, ...result.pagination };
        }

        return this.loadAllSuccess(result.data, pagination);
      })
    )
  );

  loadInvitationGuestBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromInvitationGuestBookActions.loadInvitationGuestBook),
      switchMap((action) => {
        return this.invitationGuestBookService.getSingle(action.id, action.params).pipe(
          map((result: any) =>
            fromInvitationGuestBookActions.loadInvitationGuestBookSuccess({
              data: result.data,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              fromInvitationGuestBookActions.loadInvitationGuestBookFailure({
                error: {
                  name: this.name,
                  error: !error.ok,
                  message: error.message,
                },
              })
            )
          )
        );
      })
    )
  );

  createInvitationGuestBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromInvitationGuestBookActions.createInvitationGuestBook),
      switchMap((action) =>
        this.invitationGuestBookService.createItem(action.create).pipe(
          map((res: any) => {
            return fromInvitationGuestBookActions.createInvitationGuestBookSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromInvitationGuestBookActions.createInvitationGuestBookFailure({
                error: {
                  name: this.name,
                  error: !error.ok,
                  message: error.message,
                },
              }),
              undo(action)
            );
          })
        )
      )
    )
  );

  updateInvitationGuestBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromInvitationGuestBookActions.updateInvitationGuestBook),
      switchMap((action) =>
        this.invitationGuestBookService
          .updateItem(action.update.id_invitation_guest_book, action.update)
          .pipe(
            map((res: any) => {
              return fromInvitationGuestBookActions.updateInvitationGuestBookSuccess({
                data: res.data,
              });
            }),
            catchError((error) => {
              return of(
                fromInvitationGuestBookActions.updateInvitationGuestBookFailure({
                  error: {
                    name: this.name,
                    error: true,
                    message: error.message,
                  },
                }),
                undo(action)
              );
            })
          )
      )
    )
  );

  deleteInvitationGuestBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromInvitationGuestBookActions.deleteInvitationGuestBook),
      switchMap((action) =>
        this.invitationGuestBookService
          .updateItem(action.delete.id_invitation_guest_book, action.delete)
          .pipe(
            map((res: any) => {
              return fromInvitationGuestBookActions.deleteInvitationGuestBookSuccess({
                data: res.data,
              });
            }),
            catchError((error) => {
              return of(
                fromInvitationGuestBookActions.deleteInvitationGuestBookFailure({
                  error: {
                    name: this.name,
                    error: true,
                    message: error.message,
                  },
                }),
                undo(action)
              );
            })
          )
      )
    )
  );

  constructor(private actions$: Actions, private invitationGuestBookService: InvitationGuestBookService) {}

  loadAllSuccess(data: any, pagination: any): any {
    return fromInvitationGuestBookActions.loadAllInvitationGuestBookSuccess({
      data,
      pagination,
    });
  }

  loadAllFailure(error: string): any {
    return fromInvitationGuestBookActions.loadAllInvitationGuestBookFailure({
      error: {
        name: this.name,
        error: true,
        message: error,
      },
    });
  }
}
