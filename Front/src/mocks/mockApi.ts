import { mockAccounts, mockTransactions } from './mockData';

// Simulate fetching accounts from an API
export const fetchAccounts = async (userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          body: mockAccounts.filter((account) => account.userId === userId),
        },
      });
    }, 500);
  });
};

// Simulate fetching transactions for a specific account from an API
export const fetchTransactions = async (accountId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          body: mockTransactions.filter(
            (transaction) => transaction.accountId === accountId
          ),
        },
      });
    }, 500);
  });
};

// Simulate fetching a single transaction by ID from an API
export const fetchTransactionById = async (transactionId: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const transaction = mockTransactions.find(
        (transaction) => transaction.transactionId === transactionId
      );
      if (transaction) {
        resolve({ data: { body: transaction } });
      } else {
        reject(new Error('Transaction not found'));
      }
    }, 500);
  });
};

// Simulate updating a transaction in an API
export const updateTransaction = async (
  accountId: string,
  transactionId: string,
  updates: { category?: string; notes?: string }
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const transactionIndex = mockTransactions.findIndex(
        (transaction) =>
          transaction.transactionId === transactionId &&
          transaction.accountId === accountId
      );
      if (transactionIndex !== -1) {
        const updatedTransaction = {
          ...mockTransactions[transactionIndex],
          ...updates,
        };
        mockTransactions[transactionIndex] = updatedTransaction;
        resolve({ data: { body: updatedTransaction } });
      } else {
        reject(new Error('Transaction not found'));
      }
    }, 500);
  });
};
