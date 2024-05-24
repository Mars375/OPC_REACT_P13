import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAccounts } from '../mocks/mockApi';
import errorMessages from '../config/errorMessages';
import { AxiosError } from 'axios';

interface Transaction {
  date: string;
  description: string;
  amount: string;
  balance: string;
  type: string;
  category: string;
  notes: string;
}

interface Account {
  userId: string;
  accountId: string;
  title: string;
  amount: string;
  description: string;
  transactions: Transaction[];
}

interface AccountState {
  accounts: Account[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Load initial state from local storage
const loadInitialState = (): AccountState => {
  const savedAccounts = localStorage.getItem('accounts');
  if (savedAccounts) {
    return { accounts: JSON.parse(savedAccounts), status: 'idle', error: null };
  }
  return { accounts: [], status: 'idle', error: null };
};

const initialState: AccountState = loadInitialState();

// Async action to fetch user accounts
export const fetchAccountsThunk = createAsyncThunk(
  'account/fetchAccounts',
  async (userId: string, { rejectWithValue }) => {
    try {
      const localData = localStorage.getItem('accounts');
      if (localData) {
        return JSON.parse(localData);
      }
      const response = (await fetchAccounts(userId)) as {
        data: { body: Account[] };
      };
      localStorage.setItem('accounts', JSON.stringify(response.data.body));
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

// Async action to update a transaction
export const updateTransactionThunk = createAsyncThunk(
  'account/updateTransaction',
  async (
    {
      accountId,
      transactionIndex,
      updates,
    }: {
      userId: string;
      accountId: string;
      transactionIndex: number;
      updates: { category?: string; notes?: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const accountIndex = accounts.findIndex(
        (acc: Account) => acc.accountId === accountId
      );
      if (accountIndex !== -1) {
        const transaction =
          accounts[accountIndex].transactions[transactionIndex];
        if (updates.category) transaction.category = updates.category;
        if (updates.notes) transaction.notes = updates.notes;
        localStorage.setItem('accounts', JSON.stringify(accounts));
        return { accountId, transactionIndex, transaction };
      } else {
        return rejectWithValue('Compte non trouvé');
      }
    } catch (error) {
      return rejectWithValue('Erreur lors de la mise à jour de la transaction');
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
      })
      .addCase(updateTransactionThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTransactionThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { accountId, transactionIndex, transaction } = action.payload;
        const account = state.accounts.find(
          (acc) => acc.accountId === accountId
        );
        if (account) {
          account.transactions[transactionIndex] = transaction;
        }
      })
      .addCase(updateTransactionThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearAccounts } = accountSlice.actions;

export default accountSlice.reducer;
