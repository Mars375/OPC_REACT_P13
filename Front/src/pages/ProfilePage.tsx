import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const ProfilePage: React.FC = () => {
	const token = useSelector((state: RootState) => state.auth.token);

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-dark'>
			<section className='bg-white p-8 rounded shadow-md w-80'>
				<h1 className='text-2xl font-bold mb-4'>Profile Page</h1>
				<p>Welcome to your profile!</p>
				<p>Your token: {token}</p>
			</section>
		</div>
	);
};

export default ProfilePage;
