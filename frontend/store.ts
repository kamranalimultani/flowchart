// store.js
import { configureStore } from "@reduxjs/toolkit";

// Example slice reducer (you'll define this later)
import userReducer from "./src/slice/userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
