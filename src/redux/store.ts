import { configureStore } from "@reduxjs/toolkit";
import appStateSlice from "./features/appStateSlice";
import vehicleStateSlice from "./features/vehicleStateSlice";

export const store = configureStore({
  reducer: {
    appState: appStateSlice,
    vehicleState : vehicleStateSlice
     
  }
});

export type RootState = ReturnType<typeof store.getState>;