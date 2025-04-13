import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducer";

const store = configureStore({
  reducer: rootReducer,
  devTools: true, // ✅ Bật DevTools
});

const { dispatch } = store;

export { store, dispatch };
