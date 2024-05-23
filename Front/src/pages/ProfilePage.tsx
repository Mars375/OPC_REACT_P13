import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { fetchProfile } from '../redux/profileSlice';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../Layouts/Layout';
import { AppDispatch } from '../redux/store';

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { profile, status, error } = useSelector(
    (state: RootState) => state.profile
  );
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isLoggedIn && !profile) {
      dispatch(fetchProfile());
    }
  }, [isLoggedIn, profile, dispatch]);

  useEffect(() => {
    if (status === 'failed' && error === 'Session expired') {
      navigate('/login', {
        state: { error: 'Session expired. Please log in again.' },
      });
    }
  }, [status, error, navigate]);

  const accounts = [
    {
      title: 'Argent Bank Checking (x8349)',
      amount: '$2,082.79',
      description: 'Available Balance',
    },
    {
      title: 'Argent Bank Savings (x6712)',
      amount: '$10,928.42',
      description: 'Available Balance',
    },
    {
      title: 'Argent Bank Credit Card (x8349)',
      amount: '$184.30',
      description: 'Current Balance',
    },
  ];

  return (
    <Layout backgroundColor="bg-[#12002b]">
      <>
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="mb-8 text-white">
              <h1 className="my-5 text-[32px]/10 font-bold">
                Welcome back <br />
                {profile?.firstName} {profile?.lastName}!
              </h1>
              <button className=" border border-secondary bg-secondary p-[10px] text-[13px] font-bold text-white">
                Edit Name
              </button>
            </div>
            <div className="my-5 flex w-full flex-col items-center">
              {accounts.map((account, index) => (
                <div
                  key={index}
                  className="mb-6 flex w-4/5 flex-col items-center justify-between border border-black bg-white p-6 text-primary md:flex-row"
                >
                  <div className="w-full md:w-auto">
                    <h3 className="text-lg">{account.title}</h3>
                    <p className="text-4xl font-bold">{account.amount}</p>
                    <p>{account.description}</p>
                  </div>
                  <div className="w-full md:w-auto">
                    <Link
                      to="/transactions"
                      className="mt-4 bg-secondary px-4 py-2 font-bold text-white md:mt-0"
                    >
                      View transactions
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </>
    </Layout>
  );
};

export default ProfilePage;
