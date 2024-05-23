import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import Cookies from "js-cookie";
import errorMessages from "../config/errorMessages";
import { AxiosError } from "axios";

interface AuthState {
	token: string | null;
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
	isLoggedIn: boolean;
}

const initialState: AuthState = {
	token: null,
	status: "idle",
	error: null,
	isLoggedIn: false,
};

export const login = createAsyncThunk(
	"auth/login",
	async (
		credentials: { email: string; password: string; rememberMe: boolean },
		{ rejectWithValue }
	) => {
		try {
			const response = await api.post("/user/login", {
				email: credentials.email,
				password: credentials.password,
			});
			const token = response.data.body.token;

			const cookieOptions = {
				expires: credentials.rememberMe ? 30 : 1,
				secure: true,
				sameSite: "Strict" as const,
			};

			Cookies.set("token", token, cookieOptions);

			if (credentials.rememberMe) {
				localStorage.setItem("email", credentials.email);
				localStorage.setItem("password", credentials.password);
			} else {
				localStorage.removeItem("email");
				localStorage.removeItem("password");
			}

			return token;
		} catch (error) {
			if (
				error instanceof AxiosError &&
				error.response &&
				error.response.data
			) {
				return rejectWithValue(
					error.response.data.message || errorMessages.LOGIN_FAILED
				);
			}
			return rejectWithValue(errorMessages.LOGIN_FAILED);
		}
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout(state) {
			state.token = null;
			state.isLoggedIn = false;
			Cookies.remove("token");
		},
		loadTokenFromStorage(state) {
			const token = Cookies.get("token");
			if (token) {
				state.token = token;
				state.isLoggedIn = true;
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.status = "loading";
			})
			.addCase(login.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.token = action.payload;
				state.isLoggedIn = true;
			})
			.addCase(login.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload as string;
				state.isLoggedIn = false;
			});
	},
});

export const { logout, loadTokenFromStorage } = authSlice.actions;

export default authSlice.reducer;
