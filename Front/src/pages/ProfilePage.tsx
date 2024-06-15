import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  clearProfile,
  fetchProfile,
  updateProfile,
} from '../redux/profileSlice';
import { fetchAccountsThunk } from '../redux/accountSlice';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../Layouts/Layout';
import { AppDispatch } from '../redux/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logout } from '../redux/authSlice';

/**
 * ProfilePage component displays the user's profile and associated accounts.
 * It allows the user to edit their profile information and handles various states such as loading, error, and session expiration.
 *
 * @component
 * @example
 * return (
 *   <ProfilePage />
 * )
 */
const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    profile,
    status: profileStatus,
    error: profileError,
  } = useSelector((state: RootState) => state.profile);
  const {
    accounts,
    status: accountsStatus,
    error: accountsError,
  } = useSelector((state: RootState) => state.account);

  // State variables for edit mode and profile fields
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState(profile?.firstName || '');
  const [lastName, setLastName] = useState(profile?.lastName || '');

  // Fetch user profile if logged in and profile is not loaded
  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile());
    }
  }, [profile, dispatch]);

  // Fetch user accounts if profile is loaded
  useEffect(() => {
    if (profile && profile.id) {
      dispatch(fetchAccountsThunk(profile.id));
    }
  }, [profile, dispatch]);

  // Handle session expiration and unauthorized access
  useEffect(() => {
    if (profileStatus === 'failed' && profileError === 'Session expired') {
      navigate('/login', {
        state: { error: 'Session expired. Please log in again.' },
      });
    }
    if (profileStatus === 'failed' && profileError === 'Unauthorized') {
      dispatch(logout());
      dispatch(clearProfile());
      navigate('/login', {
        state: {
          error: 'You are not authorized to view this profile. Please log in.',
        },
      });
    }
  }, [profileStatus, profileError, navigate, dispatch]);

  // Handle save button click
  const handleSave = () => {
    dispatch(updateProfile({ firstName, lastName }));
    setEditMode(false);
  };

  // Handle cancel button click
  const handleCancel = () => {
    setFirstName(profile?.firstName || '');
    setLastName(profile?.lastName || '');
    setEditMode(false);
  };

  return (
    <Layout backgroundColor="bg-[#dfe6ed]">
      <>
        {profileStatus === 'loading' || accountsStatus === 'loading' ? (
          <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid  border-current border-e-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        ) : accountsError ? (
          <div
            className="mb-4 flex items-center justify-center rounded-lg bg-red-100 p-4 text-sm text-red-700"
            role="alert"
          >
            <FontAwesomeIcon
              icon="exclamation-circle"
              className="mr-3 inline h-5 w-5"
            />
            <span className="font-medium">{accountsError}</span>
          </div>
        ) : (
          <>
            <div className="mb-8 text-primary">
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
                  <h3>{account.title}</h3>
                  <p className="text-[2.5rem]/[3rem] font-bold">
                    {account.amount}
                  </p>
                  <p>{account.description}</p>
                </div>
                <div className="w-full flex-1 md:flex-[0_1_0]">
                  <Link
                    to={`transactions/${account.accountId}`}
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
