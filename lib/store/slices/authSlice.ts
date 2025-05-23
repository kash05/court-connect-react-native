import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Role, User } from "../../types/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  userRole: Role[] | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  token: null,
  userRole: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.userRole = action.payload.roles;
      AsyncStorage.setItem("user_data", JSON.stringify(state.user));
      state.isAuthenticated = true;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      AsyncStorage.setItem("auth_token", state.token);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.userRole = null;
      AsyncStorage.removeItem("auth_token");
      AsyncStorage.removeItem("user_data");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    restoreAuthState: (
      state,
      action: PayloadAction<{
        user: User | null;
        token: string | null;
      }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.userRole = user?.roles || null;
      state.isAuthenticated = !!(user && token);
      state.isInitialized = true;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
});

export const {
  setUser,
  setToken,
  logout,
  setLoading,
  restoreAuthState,
  setInitialized,
} = authSlice.actions;
export default authSlice.reducer;
