import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { undo } from 'ngrx-undo';

import { fromEventActions } from '@store/event/event.actions';
import { EventService } from '@services';

const handlePromise = async (promise: Promise<any>) => {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (error) {
    return await Promise.resolve([undefined, error]);
  }
};

@Injectable()
export class EventEffects {
  name = 'Event';
  messageNotFound = ['Data not found.', 'Data not found'];

  loadAllEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromEventActions.loadAllEvent),
      switchMap(async (action) => {
        const [result, resultErr] = await handlePromise(
          lastValueFrom(this.eventService.getList(action.params))
        );

        if (resultErr) {
          return this.loadAllFailure(resultErr.message);
        }

        if (result.error === 1) {
          if (this.messageNotFound.includes(result.message)) {
            return fromEventActions.clearEvent();
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

  loadEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromEventActions.loadEvent),
      switchMap((action) => {
        return this.eventService.getSingle(action.id, action.params).pipe(
          map((result: any) =>
            fromEventActions.loadEventSuccess({
              data: result.data,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              fromEventActions.loadEventFailure({
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

  createEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromEventActions.createEvent),
      switchMap((action) =>
        this.eventService.createItem(action.create).pipe(
          map((res: any) => {
            return fromEventActions.createEventSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromEventActions.createEventFailure({
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

  updateEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromEventActions.updateEvent),
      switchMap((action) =>
        this.eventService.updateItem(action.update.id_event, action.update).pipe(
          map((res: any) => {
            return fromEventActions.updateEventSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromEventActions.updateEventFailure({
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

  deleteEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromEventActions.deleteEvent),
      switchMap((action) =>
        this.eventService.updateItem(action.delete.id_event, action.delete).pipe(
          map((res: any) => {
            return fromEventActions.deleteEventSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromEventActions.deleteEventFailure({
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

  constructor(private actions$: Actions, private eventService: EventService) {}

  loadAllSuccess(data: any, pagination: any): any {
    return fromEventActions.loadAllEventSuccess({
      data,
      pagination,
    });
  }

  loadAllFailure(error: string): any {
    return fromEventActions.loadAllEventFailure({
      error: {
        name: this.name,
        error: true,
        message: error,
      },
    });
  }
}
