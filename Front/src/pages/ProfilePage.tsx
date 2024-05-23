import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchProfile } from "../redux/profileSlice";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layouts/Layout";
import { AppDispatch } from "../redux/store";

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
		if (status === "failed" && error === "Session expired") {
			navigate("/login", {
				state: { error: "Session expired. Please log in again." },
			});
		}
	}, [status, error, navigate]);

	return (
		<Layout backgroundColor='bg-[#12002b]'>
			<div>
				{status === "loading" ? (
					<p>Loading...</p>
				) : error ? (
					<p className='text-red-500'>{error}</p>
				) : (
					<div className='flex flex-col items-center min-h-screen text-white'>
						<div className='bg-dark text-center py-5 w-full'>
							<h1 className='text-3xl'>Welcome back</h1>
							<h2 className='text-2xl'>
								{profile?.firstName} {profile?.lastName}!
							</h2>
							<Link
								to='/edit-profile'
								className='mt-3 px-4 py-2 bg-secondary text-white font-bold rounded'
							>
								Edit Name
							</Link>
						</div>
						<div className='my-5 w-full flex flex-col items-center'>
							<div className='account bg-white text-primary p-6 mb-6 w-4/5 flex flex-col md:flex-row justify-between items-center border border-black'>
								<div className='account-content-wrapper w-full md:w-auto'>
									<h3 className='account-title text-lg'>
										Argent Bank Checking (x8349)
									</h3>
									<p className='account-amount text-4xl font-bold'>$2,082.79</p>
									<p className='account-amount-description'>
										Available Balance
									</p>
								</div>
								<div className='account-content-wrapper cta w-full md:w-auto'>
									<Link
										to='/transactions'
										className='transaction-button mt-4 md:mt-0 px-4 py-2 bg-secondary text-white font-bold rounded'
									>
										View transactions
									</Link>
								</div>
							</div>
							<div className='account bg-white text-primary p-6 mb-6 w-4/5 flex flex-col md:flex-row justify-between items-center border border-black'>
								<div className='account-content-wrapper w-full md:w-auto'>
									<h3 className='account-title text-lg'>
										Argent Bank Savings (x6712)
									</h3>
									<p className='account-amount text-4xl font-bold'>
										$10,928.42
									</p>
									<p className='account-amount-description'>
										Available Balance
									</p>
								</div>
								<div className='account-content-wrapper cta w-full md:w-auto'>
									<Link
										to='/transactions'
										className='transaction-button mt-4 md:mt-0 px-4 py-2 bg-secondary text-white font-bold rounded'
									>
										View transactions
									</Link>
								</div>
							</div>
							<div className='account bg-white text-primary p-6 mb-6 w-4/5 flex flex-col md:flex-row justify-between items-center border border-black'>
								<div className='account-content-wrapper w-full md:w-auto'>
									<h3 className='account-title text-lg'>
										Argent Bank Credit Card (x8349)
									</h3>
									<p className='account-amount text-4xl font-bold'>$184.30</p>
									<p className='account-amount-description'>Current Balance</p>
								</div>
								<div className='account-content-wrapper cta w-full md:w-auto'>
									<Link
										to='/transactions'
										className='transaction-button mt-4 md:mt-0 px-4 py-2 bg-secondary text-white font-bold rounded'
									>
										View transactions
									</Link>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
};

export default ProfilePage;
