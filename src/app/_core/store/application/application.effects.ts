import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { undo } from 'ngrx-undo';

import { fromApplicationActions } from '@store/application/application.actions';
import { ApplicationService } from '@services';

const handlePromise = async (promise: Promise<any>) => {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (error) {
    return await Promise.resolve([undefined, error]);
  }
};

@Injectable()
export class ApplicationEffects {
  name = 'Application';
  messageNotFound = ['Data not found.', 'Data not found'];

  loadAllApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromApplicationActions.loadAllApplication),
      switchMap(async (action) => {
        const [result, resultErr] = await handlePromise(
          lastValueFrom(this.applicationService.getList(action.params))
        );

        if (resultErr) {
          return this.loadAllFailure(resultErr.message);
        }

        if (result.error === 1) {
          if (this.messageNotFound.includes(result.message)) {
            return fromApplicationActions.clearApplication();
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

  loadApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromApplicationActions.loadApplication),
      switchMap((action) => {
        return this.applicationService.getSingle(action.id, action.params).pipe(
          map((result: any) =>
            fromApplicationActions.loadApplicationSuccess({
              data: result.data,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              fromApplicationActions.loadApplicationFailure({
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

  createApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromApplicationActions.createApplication),
      switchMap((action) =>
        this.applicationService.createItem(action.create).pipe(
          map((res: any) => {
            return fromApplicationActions.createApplicationSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromApplicationActions.createApplicationFailure({
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

  updateApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromApplicationActions.updateApplication),
      switchMap((action) =>
        this.applicationService.updateItem(action.update.id, action.update).pipe(
          map((res: any) => {
            return fromApplicationActions.updateApplicationSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromApplicationActions.updateApplicationFailure({
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

  deleteApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromApplicationActions.deleteApplication),
      switchMap((action) =>
        this.applicationService.updateItem(action.delete.id, action.delete).pipe(
          map((res: any) => {
            return fromApplicationActions.deleteApplicationSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromApplicationActions.deleteApplicationFailure({
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

  constructor(private actions$: Actions, private applicationService: ApplicationService) {}

  loadAllSuccess(data: any, pagination: any): any {
    return fromApplicationActions.loadAllApplicationSuccess({
      data,
      pagination,
    });
  }

  loadAllFailure(error: string): any {
    return fromApplicationActions.loadAllApplicationFailure({
      error: {
        name: this.name,
        error: true,
        message: error,
      },
    });
  }
}
