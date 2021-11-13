import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { undo } from 'ngrx-undo';

import { fromThemeCategoryActions } from '@store/theme-category/theme-category.actions';
import { ThemeCategoryService } from '@services';

const handlePromise = async (promise: Promise<any>) => {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (error) {
    return await Promise.resolve([undefined, error]);
  }
};

@Injectable()
export class ThemeCategoryEffects {
  name = 'Theme Category';
  messageNotFound = ['Data not found.', 'Data not found'];

  loadAllThemeCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromThemeCategoryActions.loadAllThemeCategory),
      switchMap(async (action) => {
        const [result, resultErr] = await handlePromise(
          lastValueFrom(this.themeCategoryService.getList(action.params))
        );

        if (resultErr) {
          return this.loadAllFailure(resultErr.message);
        }

        if (result.error === 1) {
          if (this.messageNotFound.includes(result.message)) {
            return fromThemeCategoryActions.clearThemeCategory();
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

  loadThemeCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromThemeCategoryActions.loadThemeCategory),
      switchMap((action) => {
        return this.themeCategoryService.getSingle(action.id, action.params).pipe(
          map((result: any) =>
            fromThemeCategoryActions.loadThemeCategorySuccess({
              data: result.data,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              fromThemeCategoryActions.loadThemeCategoryFailure({
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

  createThemeCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromThemeCategoryActions.createThemeCategory),
      switchMap((action) =>
        this.themeCategoryService.createItem(action.create).pipe(
          map((res: any) => {
            return fromThemeCategoryActions.createThemeCategorySuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromThemeCategoryActions.createThemeCategoryFailure({
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

  updateThemeCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromThemeCategoryActions.updateThemeCategory),
      switchMap((action) =>
        this.themeCategoryService.updateItem(action.update.id_theme_category, action.update).pipe(
          map((res: any) => {
            return fromThemeCategoryActions.updateThemeCategorySuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromThemeCategoryActions.updateThemeCategoryFailure({
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

  deleteThemeCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromThemeCategoryActions.deleteThemeCategory),
      switchMap((action) =>
        this.themeCategoryService.updateItem(action.delete.id_theme_category, action.delete).pipe(
          map((res: any) => {
            return fromThemeCategoryActions.deleteThemeCategorySuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromThemeCategoryActions.deleteThemeCategoryFailure({
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

  constructor(private actions$: Actions, private themeCategoryService: ThemeCategoryService) {}

  loadAllSuccess(data: any, pagination: any): any {
    return fromThemeCategoryActions.loadAllThemeCategorySuccess({
      data,
      pagination,
    });
  }

  loadAllFailure(error: string): any {
    return fromThemeCategoryActions.loadAllThemeCategoryFailure({
      error: {
        name: this.name,
        error: true,
        message: error,
      },
    });
  }
}
