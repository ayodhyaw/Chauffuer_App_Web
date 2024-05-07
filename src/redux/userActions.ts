

import { Dispatch } from 'redux';
import { UserActionTypes, SET_USER_DETAILS, CLEAR_USER_DETAILS, UserDetails } from '../types/userTypes';

export const setUserDetails = (userDetails: UserDetails): UserActionTypes => ({
  type: SET_USER_DETAILS,
  payload: userDetails,
});

export const clearUserDetails = (): UserActionTypes => ({
  type: CLEAR_USER_DETAILS,
});
