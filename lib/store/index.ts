import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import propertySlice from "./slices/propertySlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    properties: propertySlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
