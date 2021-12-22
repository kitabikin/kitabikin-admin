import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { undo } from 'ngrx-undo';

import { fromInvitationActions } from '@store/invitation/invitation.actions';
import { InvitationService } from '@services';

const handlePromise = async (promise: Promise<any>) => {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (error) {
    return await Promise.resolve([undefined, error]);
  }
};

@Injectable()
export class InvitationEffects {
  name = 'Invitation';
  messageNotFound = ['Data not found.', 'Data not found'];

  loadAllInvitation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromInvitationActions.loadAllInvitation),
      switchMap(async (action) => {
        const [result, resultErr] = await handlePromise(
          lastValueFrom(this.invitationService.getList(action.params))
        );

        if (resultErr) {
          return this.loadAllFailure(resultErr.message);
        }

        if (result.error === 1) {
          if (this.messageNotFound.includes(result.message)) {
            return fromInvitationActions.clearInvitation();
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

  loadInvitation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromInvitationActions.loadInvitation),
      switchMap((action) => {
        return this.invitationService.getSingle(action.id, action.params).pipe(
          map((result: any) =>
            fromInvitationActions.loadInvitationSuccess({
              data: result.data,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              fromInvitationActions.loadInvitationFailure({
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

  createInvitation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromInvitationActions.createInvitation),
      switchMap((action) =>
        this.invitationService.createItem(action.create).pipe(
          map((res: any) => {
            return fromInvitationActions.createInvitationSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromInvitationActions.createInvitationFailure({
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

  updateInvitation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromInvitationActions.updateInvitation),
      switchMap((action) =>
        this.invitationService.updateItem(action.update.id_invitation, action.update).pipe(
          map((res: any) => {
            return fromInvitationActions.updateInvitationSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromInvitationActions.updateInvitationFailure({
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

  deleteInvitation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromInvitationActions.deleteInvitation),
      switchMap((action) =>
        this.invitationService.updateItem(action.delete.id_invitation, action.delete).pipe(
          map((res: any) => {
            return fromInvitationActions.deleteInvitationSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromInvitationActions.deleteInvitationFailure({
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

  constructor(private actions$: Actions, private invitationService: InvitationService) {}

  loadAllSuccess(data: any, pagination: any): any {
    return fromInvitationActions.loadAllInvitationSuccess({
      data,
      pagination,
    });
  }

  loadAllFailure(error: string): any {
    return fromInvitationActions.loadAllInvitationFailure({
      error: {
        name: this.name,
        error: true,
        message: error,
      },
    });
  }
}
