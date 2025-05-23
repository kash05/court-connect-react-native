import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { authAPI } from "../lib/api/auth";
import { Role, User } from "../lib/types/auth";
import { store } from "../store";
import {
  logout,
  setLoading,
  setToken,
  setUser,
} from "../store/slices/authSlice";

interface InitResult {
  isInitialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: "owner" | "player" | null;
  error: string | null;
}

export const useInitApp = (): InitResult => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<"owner" | "player" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        store.dispatch(setLoading(true));
        const [token, userJson] = await Promise.all([
          AsyncStorage.getItem("auth_token"),
          AsyncStorage.getItem("user_data"),
        ]);

        if (!token || !userJson) {
          await clearAuthData();
          setIsAuthenticated(false);
          setError("User not authenticated");
          return;
        }

        const user: User = JSON.parse(userJson);
        store.dispatch(setToken(token));
        store.dispatch(setUser(user));
        setUserType(resolveUserType(user));
        setIsAuthenticated(true);

        const freshUser = await authAPI.getCurrentUser();
        store.dispatch(setUser(freshUser));
        await AsyncStorage.setItem("user_data", JSON.stringify(freshUser));
        setUserType(resolveUserType(freshUser));
      } catch {
        setError("Initialization failed");
        Toast.show({
          type: "error",
          text1: "App initialization failed",
        });
        await clearAuthData();
        setIsAuthenticated(false);
      } finally {
        store.dispatch(setLoading(false));
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    init();
  }, []);

  return { isInitialized, isAuthenticated, isLoading, userType, error };
};

const clearAuthData = async () => {
  await AsyncStorage.multiRemove(["auth_token", "user_data"]);
  store.dispatch(logout());
};

const resolveUserType = (user: User): "owner" | "player" | null => {
  const roles = user.roles ?? [];
  if (roles.some((r: Role) => r.display_name === "owner")) return "owner";
  if (roles.some((r: Role) => r.display_name === "player")) return "player";
  return null;
};
