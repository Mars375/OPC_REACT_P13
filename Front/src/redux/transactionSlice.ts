import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTransactions, updateTransaction } from '../mocks/mockApi';
import errorMessages from '../config/errorMessages';
import { AxiosError } from 'axios';

interface Transaction {
  transactionId: string;
  accountId: string;
  date: string;
  description: string;
  amount: string;
  balance: string;
  type: string;
  category: string;
  notes: string;
}

interface TransactionState {
  transactions: Transaction[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  status: 'idle',
  error: null,
};

// Async action to fetch transactions for a specific account
export const fetchTransactionsThunk = createAsyncThunk(
  'transaction/fetchTransactions',
  async (accountId: string, { rejectWithValue }) => {
    try {
      const response = (await fetchTransactions(accountId)) as {
        data: { body: Transaction[] };
      };
      return response.data.body;
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data
      ) {
        const status = error.response.status;
        let errorMessage = errorMessages.FETCH_TRANSACTIONS_FAILED;
        if (status === 401) {
          errorMessage = errorMessages.UNAUTHORIZED;
        } else if (status === 404) {
          errorMessage = errorMessages.NOT_FOUND;
        }
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue(errorMessages.FETCH_TRANSACTIONS_FAILED);
    }
  }
);

// Async action to update a transaction
export const updateTransactionThunk = createAsyncThunk(
  'transaction/updateTransaction',
  async (
    {
      accountId,
      transactionId,
      updates,
    }: {
      accountId: string;
      transactionId: string;
      updates: { category?: string; notes?: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = (await updateTransaction(
        accountId,
        transactionId,
        updates
      )) as {
        data: { body: Transaction };
      };
      return response.data.body;
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data
      ) {
        const status = error.response.status;
        let errorMessage = errorMessages.UPDATE_TRANSACTION_FAILED;
        if (status === 401) {
          errorMessage = errorMessages.UNAUTHORIZED;
        } else if (status === 404) {
          errorMessage = errorMessages.NOT_FOUND;
        }
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue(errorMessages.UPDATE_TRANSACTION_FAILED);
    }
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransactionsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactions = action.payload;
      })
      .addCase(fetchTransactionsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateTransactionThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTransactionThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedTransaction = action.payload;
        const index = state.transactions.findIndex(
          (trans) => trans.transactionId === updatedTransaction.transactionId
        );
        if (index !== -1) {
          state.transactions[index] = updatedTransaction;
        }
      })
      .addCase(updateTransactionThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default transactionSlice.reducer;
