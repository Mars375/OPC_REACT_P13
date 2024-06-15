import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import errorMessages from '../config/errorMessages';
import { AxiosError } from 'axios';

interface Profile {
  createdAt: string;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  updatedAt: string;
}

interface ProfileState {
  profile: Profile | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: ProfileState = {
  profile: null,
  status: 'idle',
  error: null,
  isLoggedIn: false,
};

// Async action to fetch user profile
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/profile');
      return response.data.body;
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data
      ) {
        const status = error.response.status;
        let errorMessage = errorMessages.FETCH_PROFILE_FAILED;

        if (status === 401) {
          errorMessage = 'Unauthorized';
        } else if (status === 404) {
          errorMessage = errorMessages.NOT_FOUND;
        }

        return rejectWithValue(errorMessage);
      }
      return rejectWithValue(errorMessages.FETCH_PROFILE_FAILED);
    }
  }
);

// Async action to update user profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (
    profileData: { firstName: string; lastName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data.body;
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data
      ) {
        const status = error.response.status;
        let errorMessage = errorMessages.UPDATE_PROFILE_FAILED;

        if (status === 401) {
          errorMessage = errorMessages.UNAUTHORIZED;
        } else if (status === 404) {
          errorMessage = errorMessages.NOT_FOUND;
        }

        return rejectWithValue(errorMessage);
      }
      return rejectWithValue(errorMessages.UPDATE_PROFILE_FAILED);
    }
  }
);

// Slice to manage user profile state
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    /**
     * Action to clear the user profile.
     * Resets the profile, status, error, and isLoggedIn state.
     *
     * @param {ProfileState} state - The current state of the profile slice.
     */
    clearProfile(state) {
      state.profile = null;
      state.status = 'idle';
      state.error = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.isLoggedIn = false;
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
