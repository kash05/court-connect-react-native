import { config } from "../config";
import { store } from "../store";
import { logout, setToken, setUser } from "../store/slices/authSlice";
import {
  LoginCredentials,
  RegisterCredentials,
  TokenInterface,
  User,
} from "../types/auth";
import { apiClient } from "./client";

const CLIENT_ID = config.clientId;
const CLIENT_SECRET = config.clientSecret;

export const authAPI = {
  login: async (LoginCredentials: LoginCredentials) => {
    const response = await apiClient.post<TokenInterface>("/oauth/token", {
      email: LoginCredentials.email,
      password: LoginCredentials.password,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "password",
    });
    store.dispatch(setToken(response.data.access_token));
    return response.data;
  },

  register: async (userData: RegisterCredentials) => {
    const response = await apiClient.post<User>("/auth/register", userData);
    store.dispatch(setUser(response.data));
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<User>("/users/profile");
    store.dispatch(setUser(response.data));
    return response.data;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
    store.dispatch(logout());
  },
};
