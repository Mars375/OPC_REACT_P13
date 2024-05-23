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
}

const initialState: ProfileState = {
  profile: null,
  status: 'idle',
  error: null,
};

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
          errorMessage = errorMessages.UNAUTHORIZED;
        } else if (status === 404) {
          errorMessage = errorMessages.NOT_FOUND;
        }

        return rejectWithValue(errorMessage);
      }
      return rejectWithValue(errorMessages.FETCH_PROFILE_FAILED);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile(state) {
      state.profile = null;
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
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
