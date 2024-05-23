import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { login } from "../redux/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../Layouts/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoginPage: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
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

		// Pré-remplir les champs si "Remember Me" a été coché précédemment
		const savedEmail = localStorage.getItem("email");
		const savedPassword = localStorage.getItem("password");
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
				if (rememberMe) {
					localStorage.setItem("email", email);
					localStorage.setItem("password", password);
				} else {
					localStorage.removeItem("email");
					localStorage.removeItem("password");
				}
				navigate("/profile");
			} else {
				setLoginError(
					typeof action.payload === "string"
						? action.payload
						: "Login failed. Please try again."
				);
			}
		} catch (err) {
			setLoginError("An unexpected error occurred. Please try again.");
		}
	};

	return (
		<Layout backgroundColor='bg-[#12002b]'>
			<>
				<section className='bg-white box-border w-[300px] mx-auto mt-12 p-8'>
					<FontAwesomeIcon icon='user-circle' />
					{loginError && <p className='text-red-500 mb-4'>{loginError}</p>}
					<h1 className='text-2xl font-bold my-5'>Sign In</h1>
					<form onSubmit={handleSubmit}>
						<div className='flex flex-col text-left mb-4'>
							<label htmlFor='username' className='block font-bold'>
								Username
							</label>
							<input
								type='text'
								id='username'
								className='w-full p-2 border border-black text-[1.2rem] rounded-none'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className='flex flex-col text-left mb-4'>
							<label htmlFor='password' className='block font-bold'>
								Password
							</label>
							<input
								type='password'
								id='password'
								className='w-full p-2 border border-black text-[1.2rem] rounded-none'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div className='flex items-center'>
							<input
								type='checkbox'
								id='remember-me'
								className='mr-2'
								checked={rememberMe}
								onChange={(e) => setRememberMe(e.target.checked)}
							/>
							<label htmlFor='remember-me' className='text-sm'>
								Remember me
							</label>
						</div>
						<button
							type='submit'
							className='bg-secondary text-white w-full p-2 font-bold underline mt-4'
						>
							{status === "loading" ? "Signing In..." : "Sign In"}
						</button>
					</form>
				</section>
			</>
		</Layout>
	);
};

export default LoginPage;
