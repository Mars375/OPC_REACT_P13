import { mockAccounts } from './mockData';

// Simulate an API to fetch user accounts
export const fetchAccounts = async (userId: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userAccounts = mockAccounts.filter(
        (account) => account.userId === userId
      );
      if (userAccounts.length > 0) {
        resolve({ data: { body: userAccounts } });
      } else {
        reject({ message: 'User not found' });
      }
    }, 500);
  });
};
