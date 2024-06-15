import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchTransactions,
  updateTransaction,
  fetchTransactionById,
  deleteTransaction,
} from '../mocks/mockApi';
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
  merchant: string;
  location: string;
  status: string;
  currency: string;
  paymentMethod: string;
}

interface TransactionState {
  transactions: Transaction[];
  transaction: Transaction | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  transaction: null,
  status: 'idle',
  error: null,
};

/**
 * Async action to fetch transactions for a specific account.
 *
 * @param {string} accountId - The ID of the account whose transactions are to be fetched.
 * @returns {Promise<Transaction[]>} A promise that resolves to the list of transactions.
 */
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

/**
 * Async action to fetch a single transaction by ID.
 *
 * @param {string} transactionId - The ID of the transaction to be fetched.
 * @returns {Promise<Transaction>} A promise that resolves to the transaction.
 */
export const fetchTransactionByIdThunk = createAsyncThunk(
  'transaction/fetchTransactionById',
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = (await fetchTransactionById(transactionId)) as {
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
        let errorMessage = errorMessages.FETCH_TRANSACTION_FAILED;
        if (status === 401) {
          errorMessage = errorMessages.UNAUTHORIZED;
        } else if (status === 404) {
          errorMessage = errorMessages.NOT_FOUND;
        }
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue(errorMessages.FETCH_TRANSACTION_FAILED);
    }
  }
);

/**
 * Async action to update a transaction.
 *
 * @param {Object} params - The parameters for updating the transaction.
 * @param {string} params.accountId - The ID of the account to which the transaction belongs.
 * @param {string} params.transactionId - The ID of the transaction to be updated.
 * @param {Object} params.updates - The updates to be applied to the transaction.
 * @param {string} [params.updates.category] - The new category of the transaction.
 * @param {string} [params.updates.notes] - The new notes for the transaction.
 * @param {string} [params.updates.description] - The new description of the transaction.
 * @returns {Promise<Transaction>} A promise that resolves to the updated transaction.
 */
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
      updates: { category?: string; notes?: string; description?: string };
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

// Async action to delete a transaction
export const deleteTransactionThunk = createAsyncThunk(
  'transaction/deleteTransaction',
  async (
    { accountId, transactionId }: { accountId: string; transactionId: string },
    { rejectWithValue }
  ) => {
    try {
      await deleteTransaction(accountId, transactionId);
      return transactionId;
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data
      ) {
        const status = error.response.status;
        let errorMessage = errorMessages.DELETE_TRANSACTION_FAILED;
        if (status === 401) {
          errorMessage = errorMessages.UNAUTHORIZED;
        } else if (status === 404) {
          errorMessage = errorMessages.NOT_FOUND;
        }
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue(errorMessages.DELETE_TRANSACTION_FAILED);
    }
  }
);

// Slice to manage transaction state
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
      .addCase(fetchTransactionByIdThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransactionByIdThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transaction = action.payload;
      })
      .addCase(fetchTransactionByIdThunk.rejected, (state, action) => {
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
      })
      .addCase(deleteTransactionThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactions = state.transactions.filter(
          (transaction) => transaction.transactionId !== action.payload
        );
      })
      .addCase(deleteTransactionThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default transactionSlice.reducer;
