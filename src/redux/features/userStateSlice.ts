
import { UserActionTypes,UserDetails, SET_USER_DETAILS, CLEAR_USER_DETAILS } from "../../types/userTypes";


interface UserState {
  userDetails: UserDetails | null;
}

const initialState: UserState = {
  userDetails: null,
};

const userStateSlice = (state = initialState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case SET_USER_DETAILS:
      return {
        ...state,
        userDetails: action.payload,
      };
    case CLEAR_USER_DETAILS:
      return {
        ...state,
        userDetails: null,
      };
    default:
      return state;
  }
};

export default userStateSlice;
