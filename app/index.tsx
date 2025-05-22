import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { authAPI } from "../lib/api/auth";
import { RootState } from "../lib/store";
import { setLoading } from "../lib/store/slices/authSlice";

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch(setLoading(true));

      await authAPI.getCurrentUser();

      dispatch(setLoading(false));
      setIsInitialized(true);
    };

    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    if (!isAuthenticated) {
      router.replace("/(auth)/login");
      return;
    }

    if (user?.userType === "owner") {
      router.replace("/(owner)/dashboard");
    } else if (user?.userType === "player") {
      router.replace("/(player)/home");
    } else {
      router.replace("/(auth)/login");
    }
  }, [isInitialized, isLoading, isAuthenticated, user, router]);

  if (!isInitialized || isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return null;
}
