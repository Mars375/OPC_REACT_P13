import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAccounts } from '../mocks/mockApi';
import errorMessages from '../config/errorMessages';
import { AxiosError } from 'axios';

interface Account {
  userId: string;
  accountId: string;
  title: string;
  amount: string;
  description: string;
}

interface AccountState {
  accounts: Account[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const ACCOUNTS_STORAGE_KEY = 'accounts';
const ACCOUNTS_EXPIRATION_KEY = 'accounts_expiration';

/**
 * Load accounts from localStorage.
 * If the accounts are expired or not found, return an empty array.
 *
 * @returns {Account[]} The list of accounts.
 */
const loadAccountsFromLocalStorage = (): Account[] => {
  try {
    const serializedAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    const expirationDate = localStorage.getItem(ACCOUNTS_EXPIRATION_KEY);

    if (serializedAccounts === null || expirationDate === null) {
      return [];
    }

    const now = new Date();
    if (now.getTime() > new Date(expirationDate).getTime()) {
      localStorage.removeItem(ACCOUNTS_STORAGE_KEY);
      localStorage.removeItem(ACCOUNTS_EXPIRATION_KEY);
      return [];
    }

    return JSON.parse(serializedAccounts);
  } catch (e) {
    console.warn('Could not load accounts from localStorage', e);
    return [];
  }
};

/**
 * Save accounts to localStorage with an expiration date of 1 day.
 *
 * @param {Account[]} accounts - The list of accounts to save.
 */
const saveAccountsToLocalStorage = (accounts: Account[]) => {
  try {
    const serializedAccounts = JSON.stringify(accounts);
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1); // Set expiration to 1 day from now

    localStorage.setItem(ACCOUNTS_STORAGE_KEY, serializedAccounts);
    localStorage.setItem(ACCOUNTS_EXPIRATION_KEY, expirationDate.toISOString());
  } catch (e) {
    console.warn('Could not save accounts to localStorage', e);
  }
};

const initialState: AccountState = {
  accounts: loadAccountsFromLocalStorage(),
  status: 'idle',
  error: null,
};

// Async action to fetch user accounts
export const fetchAccountsThunk = createAsyncThunk(
  'account/fetchAccounts',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = (await fetchAccounts(userId)) as {
        data: { body: Account[] };
      };
      return response.data.body;
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data
      ) {
        const status = error.response.status;
        let errorMessage = errorMessages.FETCH_ACCOUNTS_FAILED;
        if (status === 401) {
          errorMessage = errorMessages.UNAUTHORIZED;
        } else if (status === 404) {
          errorMessage = errorMessages.NOT_FOUND;
        }
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue(errorMessages.FETCH_ACCOUNTS_FAILED);
    }
  }
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    /**
     * Clear all accounts from the state and localStorage.
     *
     * @param {AccountState} state - The current state of the account slice.
     */
    clearAccounts(state) {
      state.accounts = [];
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem(ACCOUNTS_STORAGE_KEY);
      localStorage.removeItem(ACCOUNTS_EXPIRATION_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAccountsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accounts = action.payload;
        saveAccountsToLocalStorage(state.accounts);
      })
      .addCase(fetchAccountsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearAccounts } = accountSlice.actions;

export default accountSlice.reducer;
