import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    //  New reducer for updating profile picture only
    updateProfilePicture: (state, action) => {
      if (state.user) {
        state.user.profilePicture = action.payload;
      }
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
     updateSuccess: (state, action) => {
      state.loading = false;
      if (state.user) {
        // Merge the updated fields with existing user data
        state.user = { ...state.user, ...action.payload };
      } else {
        // If no existing user, set the payload as the new user
        state.user = action.payload;
      }
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.loading = false;
      state.user = null;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.user = null;
      state.error = null;
    }
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  clearError,
  updateProfilePicture, 
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  logoutSuccess
} = userSlice.actions;

export default userSlice.reducer;

