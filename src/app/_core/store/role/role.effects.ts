import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { undo } from 'ngrx-undo';

import { fromRoleActions } from '@store/role/role.actions';
import { RoleService } from '@services';

const handlePromise = async (promise: Promise<any>) => {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (error) {
    return await Promise.resolve([undefined, error]);
  }
};

@Injectable()
export class RoleEffects {
  name = 'Role';
  messageNotFound = ['Data not found.', 'Data not found'];

  loadAllRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromRoleActions.loadAllRole),
      switchMap(async (action) => {
        const [result, resultErr] = await handlePromise(
          lastValueFrom(this.roleService.getList(action.params))
        );

        if (resultErr) {
          return this.loadAllFailure(resultErr.message);
        }

        if (result.error === 1) {
          if (this.messageNotFound.includes(result.message)) {
            return fromRoleActions.clearRole();
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

  loadRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromRoleActions.loadRole),
      switchMap((action) => {
        return this.roleService.getSingle(action.id, action.params).pipe(
          map((result: any) =>
            fromRoleActions.loadRoleSuccess({
              data: result.data,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              fromRoleActions.loadRoleFailure({
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

  createRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromRoleActions.createRole),
      switchMap((action) =>
        this.roleService.createItem(action.create).pipe(
          map((res: any) => {
            return fromRoleActions.createRoleSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromRoleActions.createRoleFailure({
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

  updateRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromRoleActions.updateRole),
      switchMap((action) =>
        this.roleService.updateItem(action.update.id, action.update).pipe(
          map((res: any) => {
            return fromRoleActions.updateRoleSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromRoleActions.updateRoleFailure({
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

  deleteRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromRoleActions.deleteRole),
      switchMap((action) =>
        this.roleService.updateItem(action.delete.id, action.delete).pipe(
          map((res: any) => {
            return fromRoleActions.deleteRoleSuccess({
              data: res.data,
            });
          }),
          catchError((error) => {
            return of(
              fromRoleActions.deleteRoleFailure({
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

  constructor(private actions$: Actions, private roleService: RoleService) {}

  loadAllSuccess(data: any, pagination: any): any {
    return fromRoleActions.loadAllRoleSuccess({
      data,
      pagination,
    });
  }

  loadAllFailure(error: string): any {
    return fromRoleActions.loadAllRoleFailure({
      error: {
        name: this.name,
        error: true,
        message: error,
      },
    });
  }
}
