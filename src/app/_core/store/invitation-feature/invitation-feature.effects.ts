import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { undo } from 'ngrx-undo';

import { fromInvitationFeatureActions } from '@store/invitation-feature/invitation-feature.actions';
import { InvitationFeatureService } from '@services';

const handlePromise = async (promise: Promise<any>) => {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (error) {
    return await Promise.resolve([undefined, error]);
  }
};

@Injectable()
export class InvitationFeatureEffects {
  name = 'Invitation Feature';
  messageNotFound = ['Data not found.', 'Data not found'];

  loadAllInvitationFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromInvitationFeatureActions.loadAllInvitationFeature),
      switchMap(async (action) => {
        const [result, resultErr] = await handlePromise(
          lastValueFrom(this.invitationFeatureService.getList(action.params))
        );

        if (resultErr) {
          return this.loadAllFailure(resultErr.message);
        }

        if (result.error === 1) {
          if (this.messageNotFound.includes(result.message)) {
            return fromInvitationFeatureActions.clearInvitationFeature();
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

  loadInvitationFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromInvitationFeatureActions.loadInvitationFeature),
      switchMap((action) => {
        return this.invitationFeatureService.getSingle(action.id, action.params).pipe(
          map((result: any) =>
            fromInvitationFeatureActions.loadInvitationFeatureSuccess({
              data: result.data,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              fromInvitationFeatureActions.loadInvitationFeatureFailure({
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

  createInvitationFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromInvitationFeatureActions.createInvitationFeature),
      switchMap((action) =>
        this.invitationFeatureService.createItem(action.create).pipe(
          map((res: any) => {
            return fromInvitationFeatureActions.createInvitationFeatureSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromInvitationFeatureActions.createInvitationFeatureFailure({
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

  updateInvitationFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromInvitationFeatureActions.updateInvitationFeature),
      switchMap((action) =>
        this.invitationFeatureService.updateItem(action.update.id_invitationFeature, action.update).pipe(
          map((res: any) => {
            return fromInvitationFeatureActions.updateInvitationFeatureSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromInvitationFeatureActions.updateInvitationFeatureFailure({
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

  deleteInvitationFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromInvitationFeatureActions.deleteInvitationFeature),
      switchMap((action) =>
        this.invitationFeatureService.updateItem(action.delete.id_invitationFeature, action.delete).pipe(
          map((res: any) => {
            return fromInvitationFeatureActions.deleteInvitationFeatureSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromInvitationFeatureActions.deleteInvitationFeatureFailure({
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

  constructor(private actions$: Actions, private invitationFeatureService: InvitationFeatureService) {}

  loadAllSuccess(data: any, pagination: any): any {
    return fromInvitationFeatureActions.loadAllInvitationFeatureSuccess({
      data,
      pagination,
    });
  }

  loadAllFailure(error: string): any {
    return fromInvitationFeatureActions.loadAllInvitationFeatureFailure({
      error: {
        name: this.name,
        error: true,
        message: error,
      },
    });
  }
}
