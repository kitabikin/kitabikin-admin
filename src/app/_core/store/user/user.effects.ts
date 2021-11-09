import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { undo } from 'ngrx-undo';

import { fromUserActions } from '@store/user/user.actions';
import { UserService } from '@services';

const handlePromise = async (promise: Promise<any>) => {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (error) {
    return await Promise.resolve([undefined, error]);
  }
};

@Injectable()
export class UserEffects {
  name = 'User';
  messageNotFound = ['Data not found.', 'Data not found'];

  loadAllUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromUserActions.loadAllUser),
      switchMap(async (action) => {
        const [result, resultErr] = await handlePromise(
          lastValueFrom(this.userService.getList(action.params))
        );

        if (resultErr) {
          return this.loadAllFailure(resultErr.message);
        }

        if (result.error === 1) {
          if (this.messageNotFound.includes(result.message)) {
            return fromUserActions.clearUser();
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

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromUserActions.loadUser),
      switchMap((action) => {
        return this.userService.getSingle(action.id, action.params).pipe(
          map((result: any) =>
            fromUserActions.loadUserSuccess({
              data: result.data,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              fromUserActions.loadUserFailure({
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

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromUserActions.createUser),
      switchMap((action) =>
        this.userService.createItem(action.create).pipe(
          map((res: any) => {
            return fromUserActions.createUserSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromUserActions.createUserFailure({
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

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromUserActions.updateUser),
      switchMap((action) =>
        this.userService.updateItem(action.update.id_user, action.update).pipe(
          map((res: any) => {
            return fromUserActions.updateUserSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromUserActions.updateUserFailure({
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

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromUserActions.deleteUser),
      switchMap((action) =>
        this.userService.updateItem(action.delete.id_user, action.delete).pipe(
          map((res: any) => {
            return fromUserActions.deleteUserSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromUserActions.deleteUserFailure({
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

  constructor(private actions$: Actions, private userService: UserService) {}

  loadAllSuccess(data: any, pagination: any): any {
    return fromUserActions.loadAllUserSuccess({
      data,
      pagination,
    });
  }

  loadAllFailure(error: string): any {
    return fromUserActions.loadAllUserFailure({
      error: {
        name: this.name,
        error: true,
        message: error,
      },
    });
  }
}
