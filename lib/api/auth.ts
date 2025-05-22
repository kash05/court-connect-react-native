import { store } from "../store";
import { logout, setToken, setUser } from "../store/slices/authSlice";
import { apiClient } from "./client";

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login", { email, password });
    const { user, token } = response.data;
    store.dispatch(setToken(token));
    store.dispatch(setUser(user));
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    name: string;
    userType: "owner" | "player";
  }) => {
    const response = await apiClient.post("/auth/register", userData);
    const { user, token } = response.data;
    store.dispatch(setToken(token));
    store.dispatch(setUser(user));
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get("/auth/me");
    store.dispatch(setUser(response.data));
    return response.data;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
    store.dispatch(logout());
  },
};
