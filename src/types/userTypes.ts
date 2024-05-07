// src/types/userTypes.ts

export const SET_USER_DETAILS = 'SET_USER_DETAILS';
export const CLEAR_USER_DETAILS = 'CLEAR_USER_DETAILS';

export interface UserDetails {
  id: string;
  name: string;
  // Add other user details
}

interface SetUserDetailsAction {
  type: typeof SET_USER_DETAILS;
  payload: UserDetails;
}

interface ClearUserDetailsAction {
  type: typeof CLEAR_USER_DETAILS;
}

export type UserActionTypes = SetUserDetailsAction | ClearUserDetailsAction;
