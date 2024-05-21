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
	const { status, error } = useSelector((state: RootState) => state.auth);
	const [loginError, setLoginError] = useState<string | null>(null);

	useEffect(() => {
		if (location.state && location.state.error) {
			setLoginError(location.state.error);
		}
	}, [location.state]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(login({ email, password })).then((action) => {
			if (login.fulfilled.match(action)) {
				if (rememberMe) {
					localStorage.setItem("token", action.payload);
				} else {
					sessionStorage.setItem("token", action.payload);
				}
				navigate("/profile");
			}
		});
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
						{status === "failed" && (
							<p className='text-red-500 mt-4'>{error}</p>
						)}
					</form>
				</section>
			</>
		</Layout>
	);
};

export default LoginPage;
