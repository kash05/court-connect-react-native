import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";
import { RootState } from "../../lib/store";

export function AppNavigator() {
  const { isInitialized } = useSelector((state: RootState) => state.auth);

  useAuthRedirect();

  if (!isInitialized) {
    return (
      <View className="flex-1 items-center justify-center bg-primary">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(owner)" />
      <Stack.Screen name="(player)" />
    </Stack>
  );
}
