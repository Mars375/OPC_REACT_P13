import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { RootState } from "../redux/store";

const AuthMiddleware = ({ children }: { children: JSX.Element }) => {
	const token = useSelector((state: RootState) => state.auth.token);

	const location = useLocation();

	if (!token || typeof token !== "string" || token.trim() === "") {
		return <Navigate to='/login' state={{ from: location }} />;
	}

	try {
		const decoded: any = jwtDecode(token);
		const currentTime = Date.now() / 1000;

		if (decoded.exp < currentTime) {
			throw new Error("Token expired");
		}
	} catch (error) {
		return <Navigate to='/login' state={{ from: location }} />;
	}

	return children;
};

export default AuthMiddleware;
