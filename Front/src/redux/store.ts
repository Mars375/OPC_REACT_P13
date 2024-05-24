import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import authReducer from './authSlice';
import accountReducer from './accountSlice';

// Configure the Redux store with auth and profile reducers
const store = configureStore({
  reducer: {
    profile: profileReducer,
    auth: authReducer,
    account: accountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
