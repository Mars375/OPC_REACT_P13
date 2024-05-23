import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import argentBankLogo from "../assets/argentBankLogo.png";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { fetchProfile } from "../redux/profileSlice";
import { AppDispatch, RootState } from "../redux/store";

const Header: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { isLoggedIn } = useSelector((state: RootState) => state.auth);
	const { profile } = useSelector((state: RootState) => state.profile);

	useEffect(() => {
		if (isLoggedIn && !profile) {
			dispatch(fetchProfile());
		}
	}, [isLoggedIn, profile, dispatch]);

	const handleLogout = () => {
		dispatch(logout());
	};

	console.log(profile);

	return (
		<nav className='flex justify-between items-center px-5 py-[5px] bg-white'>
			<Link className='flex items-center' to='/'>
				<img
					className='w-[12.5rem]'
					src={argentBankLogo}
					alt='Argent Bank Logo'
				/>
				<h1 className='sr-only'>Argent Bank</h1>
			</Link>
			<div>
				{isLoggedIn ? (
					<>
						<span className='font-bold mr-2'>
							<FontAwesomeIcon icon='user-circle' className='mr-1' />
							{profile?.firstName}
						</span>
						<Link
							className='font-bold hover:underline'
							to='/'
							onClick={handleLogout}
						>
							<FontAwesomeIcon icon='sign-out-alt' className='mr-1' />
							Sign Out
						</Link>
					</>
				) : (
					<Link className='font-bold hover:underline mr-2' to='/login'>
						<FontAwesomeIcon icon='user-circle' className='mr-1' />
						Sign In
					</Link>
				)}
			</div>
		</nav>
	);
};

export default Header;