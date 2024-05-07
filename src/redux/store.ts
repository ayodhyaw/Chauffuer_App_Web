import { configureStore } from "@reduxjs/toolkit";
import appStateSlice from "./features/appStateSlice";
import vehicleStateSlice from "./features/vehicleStateSlice";
import userStateSlice from "./features/userStateSlice";

export const store = configureStore({
  reducer: {
    appState: appStateSlice,
    vehicleState : vehicleStateSlice,
    userState: userStateSlice
     
  }
});

export type RootState = ReturnType<typeof store.getState>;