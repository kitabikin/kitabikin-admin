import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { undo } from 'ngrx-undo';

import { fromThemeFeatureActions } from '@store/theme-feature/theme-feature.actions';
import { ThemeFeatureService } from '@services';

const handlePromise = async (promise: Promise<any>) => {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (error) {
    return await Promise.resolve([undefined, error]);
  }
};

@Injectable()
export class ThemeFeatureEffects {
  name = 'Theme Feature';
  messageNotFound = ['Data not found.', 'Data not found'];

  loadAllThemeFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromThemeFeatureActions.loadAllThemeFeature),
      switchMap(async (action) => {
        const [result, resultErr] = await handlePromise(
          lastValueFrom(this.themeFeatureService.getList(action.params))
        );

        if (resultErr) {
          return this.loadAllFailure(resultErr.message);
        }

        if (result.error === 1) {
          if (this.messageNotFound.includes(result.message)) {
            return fromThemeFeatureActions.clearThemeFeature();
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

  loadThemeFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromThemeFeatureActions.loadThemeFeature),
      switchMap((action) => {
        return this.themeFeatureService.getSingle(action.id, action.params).pipe(
          map((result: any) =>
            fromThemeFeatureActions.loadThemeFeatureSuccess({
              data: result.data,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              fromThemeFeatureActions.loadThemeFeatureFailure({
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

  createThemeFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromThemeFeatureActions.createThemeFeature),
      switchMap((action) =>
        this.themeFeatureService.createItem(action.create).pipe(
          map((res: any) => {
            return fromThemeFeatureActions.createThemeFeatureSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromThemeFeatureActions.createThemeFeatureFailure({
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

  updateThemeFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromThemeFeatureActions.updateThemeFeature),
      switchMap((action) =>
        this.themeFeatureService.updateItem(action.update.id_theme_feature, action.update).pipe(
          map((res: any) => {
            return fromThemeFeatureActions.updateThemeFeatureSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromThemeFeatureActions.updateThemeFeatureFailure({
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

  deleteThemeFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromThemeFeatureActions.deleteThemeFeature),
      switchMap((action) =>
        this.themeFeatureService.updateItem(action.delete.id_theme_feature, action.delete).pipe(
          map((res: any) => {
            return fromThemeFeatureActions.deleteThemeFeatureSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromThemeFeatureActions.deleteThemeFeatureFailure({
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

  constructor(private actions$: Actions, private themeFeatureService: ThemeFeatureService) {}

  loadAllSuccess(data: any, pagination: any): any {
    return fromThemeFeatureActions.loadAllThemeFeatureSuccess({
      data,
      pagination,
    });
  }

  loadAllFailure(error: string): any {
    return fromThemeFeatureActions.loadAllThemeFeatureFailure({
      error: {
        name: this.name,
        error: true,
        message: error,
      },
    });
  }
}
