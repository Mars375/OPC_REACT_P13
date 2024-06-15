import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import TransactionsPage from '../pages/TransactionsPage';
import NotFoundPage from '../pages/NotFoundPage';
import TransactionDetailPage from '../pages/TransactionDetailPage';

/**
 * Define the routes for the application.
 * Each route is associated with a path and a corresponding component.
 */
const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: 'profile/transactions/:accountId',
    element: <TransactionsPage />,
  },
  {
    path: 'profile/transactions/:accountId/:transactionId',
    element: <TransactionDetailPage />,
  },
  {
    path: '*', // Catch-all route for undefined URLs
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);
