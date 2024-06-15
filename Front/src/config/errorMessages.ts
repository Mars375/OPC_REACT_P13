/**
 * Error messages used throughout the application.
 * These messages are displayed to the user in case of various errors.
 */
const errorMessages = {
  SESSION_EXPIRED: 'Session expired. Please log in again.',
  TOKEN_MISSING: 'The token is missing in the header.',
  INVALID_CREDENTIALS:
    'Invalid credentials. Please check your email and password.',
  LOGIN_FAILED: 'Login failed. Please try again.',
  FETCH_PROFILE_FAILED: 'Failed to fetch profile. Please try again.',
  UNAUTHORIZED: 'You are not authorized to view this profile. Please log in.',
  NOT_FOUND: 'Profile not found. Please check the URL.',
  UPDATE_PROFILE_FAILED: 'Failed to update profile. Please try again.',
  FETCH_ACCOUNTS_FAILED: 'Failed to fetch accounts. Please try again.',
  UPDATE_TRANSACTION_FAILED: 'Failed to update transaction. Please try again.',
  FETCH_TRANSACTIONS_FAILED: 'Failed to fetch transactions. Please try again.',
  FETCH_TRANSACTION_FAILED: 'Failed to fetch transaction. Please try again.',
  DELETE_TRANSACTION_FAILED: 'Failed to delete transaction. Please try again.',
};

export default errorMessages;
