import { createAction, props } from '@ngrx/store';
import { RoleData } from '@models';

export enum RoleActionTypes {
  LoadAllRole = '[ROLE] Load All Role',
  LoadAllRoleSuccess = '[ROLE] Load All Role Success',
  LoadAllRoleFailure = '[ROLE] Load All Role Failure',
  LoadRole = '[ROLE] Load Role',
  LoadRoleSuccess = '[ROLE] Load Role Success',
  LoadRoleFailure = '[ROLE] Load Role Failure',
  CreateRole = '[ROLE] Create Role',
  CreateRoleSuccess = '[ROLE] Create Role Success',
  CreateRoleFailure = '[ROLE] Create Role Failure',
  UpdateRole = '[ROLE] Update Role',
  UpdateRoleSuccess = '[ROLE] Update Role Success',
  UpdateRoleFailure = '[ROLE] Update Role Failure',
  DeleteRole = '[ROLE] Delete Role',
  DeleteRoleSuccess = '[ROLE] Delete Role Success',
  DeleteRoleFailure = '[ROLE] Delete Role Failure',
  ClearRole = '[ROLE] Clear Role',
}

// Load All
export const loadAllRole = createAction(
  RoleActionTypes.LoadAllRole,
  props<{ params: any; pagination: boolean; infinite: boolean }>()
);

export const loadAllRoleSuccess = createAction(
  RoleActionTypes.LoadAllRoleSuccess,
  props<{ data: RoleData[]; pagination: any }>()
);

export const loadAllRoleFailure = createAction(
  RoleActionTypes.LoadAllRoleFailure,
  props<{ error: Error | any }>()
);

// Load Single
export const loadRole = createAction(RoleActionTypes.LoadRole, props<{ id: string; params: any }>());

export const loadRoleSuccess = createAction(RoleActionTypes.LoadRoleSuccess, props<{ data: RoleData }>());

export const loadRoleFailure = createAction(RoleActionTypes.LoadRoleFailure, props<{ error: Error | any }>());

// Create
export const createRole = createAction(RoleActionTypes.CreateRole, props<{ create: any }>());

export const createRoleSuccess = createAction(RoleActionTypes.CreateRoleSuccess, props<{ data: RoleData }>());

export const createRoleFailure = createAction(
  RoleActionTypes.CreateRoleFailure,
  props<{ error: Error | any }>()
);

// Update
export const updateRole = createAction(RoleActionTypes.UpdateRole, props<{ update: any }>());

export const updateRoleSuccess = createAction(RoleActionTypes.UpdateRoleSuccess, props<{ data: RoleData }>());

export const updateRoleFailure = createAction(
  RoleActionTypes.UpdateRoleFailure,
  props<{ error: Error | any }>()
);

// Delete
export const deleteRole = createAction(RoleActionTypes.DeleteRole, props<{ delete: any }>());

export const deleteRoleSuccess = createAction(RoleActionTypes.DeleteRoleSuccess, props<{ data: RoleData }>());

export const deleteRoleFailure = createAction(
  RoleActionTypes.DeleteRoleFailure,
  props<{ error: Error | any }>()
);

// Clear
export const clearRole = createAction(RoleActionTypes.ClearRole);

export const fromRoleActions = {
  loadAllRole,
  loadAllRoleSuccess,
  loadAllRoleFailure,
  loadRole,
  loadRoleSuccess,
  loadRoleFailure,
  createRole,
  createRoleSuccess,
  createRoleFailure,
  updateRole,
  updateRoleSuccess,
  updateRoleFailure,
  deleteRole,
  deleteRoleSuccess,
  deleteRoleFailure,
  clearRole,
};
