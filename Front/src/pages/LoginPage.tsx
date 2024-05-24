import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { login } from '../redux/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../Layouts/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getItemWithExpiry } from '../utils/storage';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useSelector((state: RootState) => state.auth);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state && location.state.error) {
      setLoginError(location.state.error);
    }

    // Retrieve saved login information if it exists
    const savedEmail = getItemWithExpiry('email');
    const savedPassword = getItemWithExpiry('password');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const action = await dispatch(login({ email, password, rememberMe }));
      if (login.fulfilled.match(action)) {
        navigate('/profile');
      } else {
        setLoginError(
          typeof action.payload === 'string'
            ? action.payload
            : 'Login failed. Please try again.'
        );
      }
    } catch (err) {
      setLoginError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Layout backgroundColor="bg-[#dfe6ed]">
      <>
        <section className="mx-auto mt-12 box-border w-[300px] bg-white p-8">
          <FontAwesomeIcon icon="user-circle" />
          {loginError && <p className="mb-4 text-red-500">{loginError}</p>}
          <h1 className="my-5 text-2xl font-bold">Sign In</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col text-left">
              <label htmlFor="username" className="block font-bold">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full rounded-none border border-black p-2 text-[1.2rem]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4 flex flex-col text-left">
              <label htmlFor="password" className="block font-bold">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full rounded-none border border-black p-2 text-[1.2rem]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                className="mr-2"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="text-sm">
                Remember me
              </label>
            </div>
            <button
              type="submit"
              className="mt-4 w-full bg-secondary p-2 font-bold text-white underline"
            >
              {status === 'loading' ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </section>
      </>
    </Layout>
  );
};

export default LoginPage;
