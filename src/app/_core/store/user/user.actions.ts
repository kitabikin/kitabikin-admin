import { createAction, props } from '@ngrx/store';
import { UserData } from '@models';

export enum UserActionTypes {
  LoadAllUser = '[USER] Load All User',
  LoadAllUserSuccess = '[USER] Load All User Success',
  LoadAllUserFailure = '[USER] Load All User Failure',
  LoadUser = '[USER] Load User',
  LoadUserSuccess = '[USER] Load User Success',
  LoadUserFailure = '[USER] Load User Failure',
  CreateUser = '[USER] Create User',
  CreateUserSuccess = '[USER] Create User Success',
  CreateUserFailure = '[USER] Create User Failure',
  UpdateUser = '[USER] Update User',
  UpdateUserSuccess = '[USER] Update User Success',
  UpdateUserFailure = '[USER] Update User Failure',
  DeleteUser = '[USER] Delete User',
  DeleteUserSuccess = '[USER] Delete User Success',
  DeleteUserFailure = '[USER] Delete User Failure',
  ClearUser = '[USER] Clear User',
}

// Load All
export const loadAllUser = createAction(
  UserActionTypes.LoadAllUser,
  props<{ params: any; pagination: boolean; infinite: boolean }>()
);

export const loadAllUserSuccess = createAction(
  UserActionTypes.LoadAllUserSuccess,
  props<{ data: UserData[]; pagination: any }>()
);

export const loadAllUserFailure = createAction(
  UserActionTypes.LoadAllUserFailure,
  props<{ error: Error | any }>()
);

// Load Single
export const loadUser = createAction(UserActionTypes.LoadUser, props<{ id: string; params: any }>());

export const loadUserSuccess = createAction(UserActionTypes.LoadUserSuccess, props<{ data: UserData }>());

export const loadUserFailure = createAction(UserActionTypes.LoadUserFailure, props<{ error: Error | any }>());

// Create
export const createUser = createAction(UserActionTypes.CreateUser, props<{ create: any }>());

export const createUserSuccess = createAction(UserActionTypes.CreateUserSuccess, props<{ data: UserData }>());

export const createUserFailure = createAction(
  UserActionTypes.CreateUserFailure,
  props<{ error: Error | any }>()
);

// Update
export const updateUser = createAction(UserActionTypes.UpdateUser, props<{ update: any }>());

export const updateUserSuccess = createAction(UserActionTypes.UpdateUserSuccess, props<{ data: UserData }>());

export const updateUserFailure = createAction(
  UserActionTypes.UpdateUserFailure,
  props<{ error: Error | any }>()
);

// Delete
export const deleteUser = createAction(UserActionTypes.DeleteUser, props<{ delete: any }>());

export const deleteUserSuccess = createAction(UserActionTypes.DeleteUserSuccess, props<{ data: UserData }>());

export const deleteUserFailure = createAction(
  UserActionTypes.DeleteUserFailure,
  props<{ error: Error | any }>()
);

// Clear
export const clearUser = createAction(UserActionTypes.ClearUser);

export const fromUserActions = {
  loadAllUser,
  loadAllUserSuccess,
  loadAllUserFailure,
  loadUser,
  loadUserSuccess,
  loadUserFailure,
  createUser,
  createUserSuccess,
  createUserFailure,
  updateUser,
  updateUserSuccess,
  updateUserFailure,
  deleteUser,
  deleteUserSuccess,
  deleteUserFailure,
  clearUser,
};
