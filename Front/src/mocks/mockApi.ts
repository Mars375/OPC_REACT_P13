import { mockAccounts, mockTransactions } from './mockData';

/**
 * Simulate fetching accounts from an API.
 * Filters mock accounts by userId.
 *
 * @param {string} userId - The ID of the user whose accounts are to be fetched.
 * @returns {Promise<{ data: { body: any[] } }>} A promise that resolves to the user's accounts.
 */
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

/**
 * Simulate fetching transactions for a specific account from an API.
 * Filters mock transactions by accountId.
 *
 * @param {string} accountId - The ID of the account whose transactions are to be fetched.
 * @returns {Promise<{ data: { body: any[] } }>} A promise that resolves to the account's transactions.
 */
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

/**
 * Simulate fetching a single transaction by ID from an API.
 * Finds a mock transaction by transactionId.
 *
 * @param {string} transactionId - The ID of the transaction to be fetched.
 * @returns {Promise<{ data: { body: any } }>} A promise that resolves to the transaction.
 */
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

/**
 * Simulate updating a transaction in an API.
 * Finds and updates a mock transaction by transactionId and accountId.
 *
 * @param {string} accountId - The ID of the account to which the transaction belongs.
 * @param {string} transactionId - The ID of the transaction to be updated.
 * @param {Object} updates - The updates to be applied to the transaction.
 * @param {string} [updates.category] - The new category of the transaction.
 * @param {string} [updates.notes] - The new notes for the transaction.
 * @returns {Promise<{ data: { body: any } }>} A promise that resolves to the updated transaction.
 */
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

/**
 * Simulate deleting a transaction.
 * Removes a mock transaction by accountId and transactionId.
 *
 * @param {string} accountId - The ID of the account to which the transaction belongs.
 * @param {string} transactionId - The ID of the transaction to be deleted.
 * @returns {Promise<{ data: { message: string } }>} A promise that resolves with a success message.
 */
export const deleteTransaction = async (
  accountId: string,
  transactionId: string
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transactionIndex = mockTransactions.findIndex(
        (transaction) =>
          transaction.accountId === accountId &&
          transaction.transactionId === transactionId
      );
      if (transactionIndex !== -1) {
        mockTransactions.splice(transactionIndex, 1);
        resolve({ data: { message: 'Transaction deleted successfully' } });
      } else {
        resolve({ data: { message: 'Transaction not found' } });
      }
    }, 500);
  });
};
