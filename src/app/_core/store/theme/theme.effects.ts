import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { undo } from 'ngrx-undo';

import { fromThemeActions } from '@store/theme/theme.actions';
import { ThemeService } from '@services';

const handlePromise = async (promise: Promise<any>) => {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (error) {
    return await Promise.resolve([undefined, error]);
  }
};

@Injectable()
export class ThemeEffects {
  name = 'Theme';
  messageNotFound = ['Data not found.', 'Data not found'];

  loadAllTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromThemeActions.loadAllTheme),
      switchMap(async (action) => {
        const [result, resultErr] = await handlePromise(
          lastValueFrom(this.themeService.getList(action.params))
        );

        if (resultErr) {
          return this.loadAllFailure(resultErr.message);
        }

        if (result.error === 1) {
          if (this.messageNotFound.includes(result.message)) {
            return fromThemeActions.clearTheme();
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

  loadTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromThemeActions.loadTheme),
      switchMap((action) => {
        return this.themeService.getSingle(action.id, action.params).pipe(
          map((result: any) =>
            fromThemeActions.loadThemeSuccess({
              data: result.data,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              fromThemeActions.loadThemeFailure({
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

  createTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromThemeActions.createTheme),
      switchMap((action) =>
        this.themeService.createItem(action.create).pipe(
          map((res: any) => {
            return fromThemeActions.createThemeSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromThemeActions.createThemeFailure({
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

  updateTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromThemeActions.updateTheme),
      switchMap((action) =>
        this.themeService.updateItem(action.update.id_theme, action.update).pipe(
          map((res: any) => {
            return fromThemeActions.updateThemeSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromThemeActions.updateThemeFailure({
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

  deleteTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromThemeActions.deleteTheme),
      switchMap((action) =>
        this.themeService.updateItem(action.delete.id_theme, action.delete).pipe(
          map((res: any) => {
            return fromThemeActions.deleteThemeSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromThemeActions.deleteThemeFailure({
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

  constructor(private actions$: Actions, private themeService: ThemeService) {}

  loadAllSuccess(data: any, pagination: any): any {
    return fromThemeActions.loadAllThemeSuccess({
      data,
      pagination,
    });
  }

  loadAllFailure(error: string): any {
    return fromThemeActions.loadAllThemeFailure({
      error: {
        name: this.name,
        error: true,
        message: error,
      },
    });
  }
}
