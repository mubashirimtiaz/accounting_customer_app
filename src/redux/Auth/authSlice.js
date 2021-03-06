import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    const { email, password } = payload;

    try {
      const response = await axios.post("/login", {
        email,
        password,
      });
      const data = await response.data;
      console.log(data);
      if (!data.data) {
        throw new Error("Data not found");
      }
      return data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      console.log(rejectWithValue(err.response.data));
      return rejectWithValue(err.response.data);
    }
  }
);
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isPending: false,
    isError: false,
    isLoggedIn: false,
    isNetworkEstablished: true,
    isUnAuthorized: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isPending = false;
      state.isError = false;
      state.isLoggedIn = false;
      state.isNetworkEstablished = true;
      state.isUnAuthorized = false;
    },
  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [login.pending]: (state) => {
      state.user = null;
      state.token = null;
      state.isPending = true;
      state.isError = false;
      state.isLoggedIn = false;
      state.isNetworkEstablished = true;
      state.isUnAuthorized = false;
    },
    [login.fulfilled]: (state, action) => {
      const {
        user_type,
        data: { token },
      } = action.payload;
      state.user = user_type;
      state.token = token;
      state.isPending = false;
      state.isError = false;
      state.isLoggedIn = true;
      state.isNetworkEstablished = true;
      state.isUnAuthorized = false;
    },
    [login.rejected]: (state, { error, payload }) => {
      state.user = null;
      state.token = null;
      state.isPending = false;
      state.isError = true;
      state.isLoggedIn = false;
      if (error.message === "Network Error") {
        state.isNetworkEstablished = false;
      } else {
        state.isNetworkEstablished = true;
      }
      if (payload.status === 401) {
        state.isUnAuthorized = true;
      } else {
        state.isUnAuthorized = false;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { logout } = authSlice.actions;

export default authSlice.reducer;
