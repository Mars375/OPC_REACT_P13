import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import Cookies from "js-cookie";

interface AuthState {
	token: string | null;
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}

const initialState: AuthState = {
	token: null,
	status: "idle",
	error: null,
};

export const login = createAsyncThunk(
	"auth/login",
	async (credentials: { email: string; password: string }) => {
		const response = await api.post("/user/login", credentials);
		const token = response.data.body.token;

		Cookies.set("token", token, {
			expires: 7,
			secure: true,
			sameSite: "Strict",
		});

		return token;
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout(state) {
			state.token = null;
			Cookies.remove("token");
		},
		loadTokenFromStorage(state) {
			const token = Cookies.get("token");
			if (token) {
				state.token = token;
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
			})
			.addCase(login.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message || "Failed to login";
			});
	},
});

export const { logout, loadTokenFromStorage } = authSlice.actions;

export default authSlice.reducer;
