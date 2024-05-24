import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import TransactionsPage from '../pages/TransactionsPage';
import NotFoundPage from '../pages/NotFoundPage';
import TransactionDetailPage from '../pages/TransactionDetailPage';

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
    path: '*', // Catch-all route pour les URLs non définies
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);
