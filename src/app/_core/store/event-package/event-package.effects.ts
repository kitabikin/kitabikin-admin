import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { undo } from 'ngrx-undo';

import { fromEventPackageActions } from '@store/event-package/event-package.actions';
import { EventPackageService } from '@services';

const handlePromise = async (promise: Promise<any>) => {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (error) {
    return await Promise.resolve([undefined, error]);
  }
};

@Injectable()
export class EventPackageEffects {
  name = 'Event Package';
  messageNotFound = ['Data not found.', 'Data not found'];

  loadAllEventPackage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromEventPackageActions.loadAllEventPackage),
      switchMap(async (action) => {
        const [result, resultErr] = await handlePromise(
          lastValueFrom(this.eventPackageService.getList(action.params))
        );

        if (resultErr) {
          return this.loadAllFailure(resultErr.message);
        }

        if (result.error === 1) {
          if (this.messageNotFound.includes(result.message)) {
            return fromEventPackageActions.clearEventPackage();
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

  loadEventPackage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromEventPackageActions.loadEventPackage),
      switchMap((action) => {
        return this.eventPackageService.getSingle(action.id, action.params).pipe(
          map((result: any) =>
            fromEventPackageActions.loadEventPackageSuccess({
              data: result.data,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              fromEventPackageActions.loadEventPackageFailure({
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

  createEventPackage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromEventPackageActions.createEventPackage),
      switchMap((action) =>
        this.eventPackageService.createItem(action.create).pipe(
          map((res: any) => {
            return fromEventPackageActions.createEventPackageSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromEventPackageActions.createEventPackageFailure({
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

  updateEventPackage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromEventPackageActions.updateEventPackage),
      switchMap((action) =>
        this.eventPackageService.updateItem(action.update.id_event_package, action.update).pipe(
          map((res: any) => {
            return fromEventPackageActions.updateEventPackageSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromEventPackageActions.updateEventPackageFailure({
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

  deleteEventPackage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromEventPackageActions.deleteEventPackage),
      switchMap((action) =>
        this.eventPackageService.updateItem(action.delete.id_event_package, action.delete).pipe(
          map((res: any) => {
            return fromEventPackageActions.deleteEventPackageSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromEventPackageActions.deleteEventPackageFailure({
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

  constructor(private actions$: Actions, private eventPackageService: EventPackageService) {}

  loadAllSuccess(data: any, pagination: any): any {
    return fromEventPackageActions.loadAllEventPackageSuccess({
      data,
      pagination,
    });
  }

  loadAllFailure(error: string): any {
    return fromEventPackageActions.loadAllEventPackageFailure({
      error: {
        name: this.name,
        error: true,
        message: error,
      },
    });
  }
}
