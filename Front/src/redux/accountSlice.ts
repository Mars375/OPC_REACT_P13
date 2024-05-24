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

const initialState: AccountState = {
  accounts: [],
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
    clearAccounts(state) {
      state.accounts = [];
      state.status = 'idle';
      state.error = null;
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
      })
      .addCase(fetchAccountsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearAccounts } = accountSlice.actions;

export default accountSlice.reducer;
