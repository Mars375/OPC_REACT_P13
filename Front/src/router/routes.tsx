import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import AccountsPage from '../pages/AccountsPage';
import NotFoundPage from '../pages/NotFoundPage';

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
    path: 'profile/accounts/:accountId',
    element: <AccountsPage />,
  },
  {
    path: '*', // Catch-all route pour les URLs non définies
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);
