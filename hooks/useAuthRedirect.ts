import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserRole } from "../lib/enum/UserEnum";
import { RootState } from "../lib/store";
import { restoreAuthState } from "../lib/store/slices/authSlice";

export function useAuthRedirect() {
  const { isAuthenticated, userRole, isInitialized } = useSelector(
    (state: RootState) => state.auth
  );
  const segments = useSegments();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const [userData, token] = await Promise.all([
          AsyncStorage.getItem("user_data"),
          AsyncStorage.getItem("auth_token"),
        ]);

        const user = userData ? JSON.parse(userData) : null;

        dispatch(
          restoreAuthState({
            user,
            token,
          })
        );
      } catch (error) {
        console.error("Error loading auth state:", error);
        dispatch(
          restoreAuthState({
            user: null,
            token: null,
          })
        );
      }
    };

    loadAuthState();
  }, [dispatch]);

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }

    if (isAuthenticated && inAuthGroup) {
      const hasOwnerRole = userRole?.some((role) => role.id === UserRole.Owner);

      if (hasOwnerRole) {
        router.replace("/(owner)/dashboard");
      } else {
        router.replace("/(player)/home");
      }
    }
  }, [isAuthenticated, userRole, segments, router, isInitialized]);
}
