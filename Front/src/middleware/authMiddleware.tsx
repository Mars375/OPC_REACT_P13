import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const AuthMiddleware = ({ children }: { children: JSX.Element }) => {
	const token = Cookies.get("token");
	const location = useLocation();

	if (!token || typeof token !== "string" || token.trim() === "") {
		return (
			<Navigate
				to='/login'
				state={{ from: location, error: "Please log in to access this page" }}
			/>
		);
	}
	try {
		const decoded: { exp: number } = jwtDecode<{ exp: number }>(token);
		const currentTime = Date.now() / 1000;

		if (decoded.exp < currentTime) {
			throw new Error("Token expired");
		}
	} catch (error) {
		return <Navigate to='/login' state={{ from: location, error: error }} />;
	}

	return children;
};

export default AuthMiddleware;
