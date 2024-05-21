import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

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

		return response.data.body.token;
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout(state) {
			state.token = null;
			localStorage.removeItem("token");
			sessionStorage.removeItem("token");
		},
		loadTokenFromStorage(state) {
			const token =
				localStorage.getItem("token") || sessionStorage.getItem("token");
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
