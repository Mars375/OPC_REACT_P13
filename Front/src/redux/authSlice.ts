import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import Cookies from 'js-cookie';
import errorMessages from '../config/errorMessages';
import { AxiosError } from 'axios';
import { setItemWithExpiry } from '../utils/storage';

interface AuthState {
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  status: 'idle',
  error: null,
};

// Async action to handle user login
export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string; rememberMe: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/user/login', {
        email: credentials.email,
        password: credentials.password,
      });
      const token = response.data.body.token;

      // Set cookie options based on rememberMe flag
      const cookieOptions = {
        expires: credentials.rememberMe ? 30 : 1,
        secure: true,
        sameSite: 'Strict' as const,
      };

      // Save token in cookies
      Cookies.set('token', token, cookieOptions);

      // Save email and password in localStorage if rememberMe is true
      if (credentials.rememberMe) {
        setItemWithExpiry('email', credentials.email, 7);
        setItemWithExpiry('password', credentials.password, 7);
      } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
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
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Action to handle user logout.
     * Clears the token from the state and removes it from cookies and localStorage.
     *
     * @param {AuthState} state - The current state of the auth slice.
     */
    logout(state) {
      state.token = null;
      Cookies.remove('token');
      localStorage.removeItem('accounts');
      localStorage.removeItem('accounts_expiration');
    },
    /**
     * Action to load token from cookies.
     * Sets the token in the state if it exists in cookies.
     *
     * @param {AuthState} state - The current state of the auth slice.
     */
    loadTokenFromStorage(state) {
      const token = Cookies.get('token');
      if (token) {
        state.token = token;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout, loadTokenFromStorage } = authSlice.actions;

export default authSlice.reducer;
