import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import authReducer from './authSlice';
import accountReducer from './accountSlice';
import transactionReducer from './transactionSlice';

/**
 * Configure the Redux store with auth, profile, account, and transaction reducers.
 */
const store = configureStore({
  reducer: {
    profile: profileReducer,
    auth: authReducer,
    account: accountReducer,
    transaction: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
