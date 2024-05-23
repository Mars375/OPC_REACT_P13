import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchProfile } from "../redux/profileSlice";
import { useNavigate } from "react-router-dom";
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

	console.log(profile);

	return (
		<Layout>
			<div>
				{status === "loading" ? (
					<p>Loading...</p>
				) : error ? (
					<p className='text-red-500'>{error}</p>
				) : (
					<div>
						<h1>Profile</h1>
						<p>
							Name: {profile?.firstName} {profile?.lastName}
						</p>
						<p>Email: {profile?.email}</p>
					</div>
				)}
			</div>
		</Layout>
	);
};

export default ProfilePage;
