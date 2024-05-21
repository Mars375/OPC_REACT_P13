import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import AuthMiddleware from "../middleware/authMiddleware";

const routes = [
	{
		path: "/",
		element: <HomePage />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/profile",
		element: (
			<AuthMiddleware>
				<ProfilePage />
			</AuthMiddleware>
		),
	},
];

export const router = createBrowserRouter(routes);
