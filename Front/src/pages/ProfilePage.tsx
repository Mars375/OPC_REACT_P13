import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { fetchProfile, updateProfile } from '../redux/profileSlice';
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

  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState(profile?.firstName || '');
  const [lastName, setLastName] = useState(profile?.lastName || '');

  useEffect(() => {
    if (isLoggedIn && !profile) {
      // Fetch user profile if logged in and profile is not loaded
      dispatch(fetchProfile());
    }
  }, [isLoggedIn, profile, dispatch]);

  useEffect(() => {
    if (status === 'failed' && error === 'Session expired') {
      // Redirect to login page if session expired
      navigate('/login', {
        state: { error: 'Session expired. Please log in again.' },
      });
    }
  }, [status, error, navigate]);

  const handleSave = () => {
    dispatch(updateProfile({ firstName, lastName }));
    setEditMode(false);
  };

  const handleCancel = () => {
    setFirstName(profile?.firstName || '');
    setLastName(profile?.lastName || '');
    setEditMode(false);
  };

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
              {editMode ? (
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="flex gap-8">
                    <input
                      type="text"
                      value={firstName}
                      className="rounded-none p-2 text-[1.2rem] text-primary"
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={profile?.firstName}
                    />
                    <input
                      type="text"
                      value={lastName}
                      className="rounded-none p-2 text-[1.2rem] text-primary"
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={profile?.lastName}
                    />
                  </div>
                  <div className="flex gap-8">
                    <button
                      className="w-28 border-2 border-secondary bg-white p-[10px] text-[13px] font-bold text-secondary"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                    <button
                      className="w-28 border-2 border-secondary bg-white p-[10px] text-[13px] font-bold text-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="border-2 border-secondary bg-secondary p-[10px] text-[13px] font-bold text-white"
                  onClick={() => setEditMode(true)}
                >
                  Edit Name
                </button>
              )}
            </div>
            <h2 className="sr-only">Accounts</h2>
            {accounts.map((account, index) => (
              <section
                key={index}
                className="mx-auto mb-8 box-border flex w-4/5 flex-col items-center justify-between border border-black bg-white p-6 text-left md:flex-row"
              >
                <div className="w-full flex-1">
                  <h3> {account.title}</h3>
                  <p className="text-[2.5rem]/[3rem] font-bold">
                    {account.amount}
                  </p>
                  <p>{account.description}</p>
                </div>
                <div className="w-full flex-1 md:flex-[0_1_0]">
                  <Link
                    to="/profile"
                    className="mt-4 block w-full border-2 border-secondary bg-secondary p-2 text-center text-[1.1rem] font-bold text-white md:w-52"
                  >
                    View transactions
                  </Link>
                </div>
              </section>
            ))}
          </>
        )}
      </>
    </Layout>
  );
};

export default ProfilePage;
