import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VehicleDto } from "../../interfaces/VehicleDto";

type vehicleState = {
  vehicles: [VehicleDto?];
};

const initialState: vehicleState = {
    vehicles: []
};

export const vehicleStateSlice = createSlice({
  name: "vehicleState",
  initialState,
  reducers: {
    setAppState: (state, action: PayloadAction<[]>) => {
      state.vehicles = action.payload;
    }
  }
});

export const {
  setAppState
} = vehicleStateSlice.actions;

export default vehicleStateSlice.reducer;