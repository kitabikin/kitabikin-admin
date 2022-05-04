import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { undo } from 'ngrx-undo';

import { fromTestimonialActions } from '@store/testimonial/testimonial.actions';
import { TestimonialService } from '@services';

const handlePromise = async (promise: Promise<any>) => {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (error) {
    return await Promise.resolve([undefined, error]);
  }
};

@Injectable()
export class TestimonialEffects {
  name = 'Testimonial';
  messageNotFound = ['Data not found.', 'Data not found'];

  loadAllTestimonial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromTestimonialActions.loadAllTestimonial),
      switchMap(async (action) => {
        const [result, resultErr] = await handlePromise(
          lastValueFrom(this.testimonialService.getList(action.params))
        );

        if (resultErr) {
          return this.loadAllFailure(resultErr.message);
        }

        if (result.error === 1) {
          if (this.messageNotFound.includes(result.message)) {
            return fromTestimonialActions.clearTestimonial();
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

  loadTestimonial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromTestimonialActions.loadTestimonial),
      switchMap((action) => {
        return this.testimonialService.getSingle(action.id, action.params).pipe(
          map((result: any) =>
            fromTestimonialActions.loadTestimonialSuccess({
              data: result.data,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              fromTestimonialActions.loadTestimonialFailure({
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

  createTestimonial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromTestimonialActions.createTestimonial),
      switchMap((action) =>
        this.testimonialService.createItem(action.create).pipe(
          map((res: any) => {
            return fromTestimonialActions.createTestimonialSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromTestimonialActions.createTestimonialFailure({
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

  updateTestimonial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromTestimonialActions.updateTestimonial),
      switchMap((action) =>
        this.testimonialService.updateItem(action.update.id_testimonial, action.update).pipe(
          map((res: any) => {
            return fromTestimonialActions.updateTestimonialSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromTestimonialActions.updateTestimonialFailure({
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

  deleteTestimonial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromTestimonialActions.deleteTestimonial),
      switchMap((action) =>
        this.testimonialService.updateItem(action.delete.id_testimonial, action.delete).pipe(
          map((res: any) => {
            return fromTestimonialActions.deleteTestimonialSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromTestimonialActions.deleteTestimonialFailure({
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

  constructor(private actions$: Actions, private testimonialService: TestimonialService) {}

  loadAllSuccess(data: any, pagination: any): any {
    return fromTestimonialActions.loadAllTestimonialSuccess({
      data,
      pagination,
    });
  }

  loadAllFailure(error: string): any {
    return fromTestimonialActions.loadAllTestimonialFailure({
      error: {
        name: this.name,
        error: true,
        message: error,
      },
    });
  }
}
