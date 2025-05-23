import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { Role } from "../lib/types/auth";
import Login from "./(auth)/login";
import OwnerLayout from "./(owner)/_layout";
import PlayerLayout from "./(player)/_layout";

export default function Index() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated) {
    return <Login />;
  }

  if (user?.roles.forEach((role: Role) => role.display_name === "owner")) {
    return <OwnerLayout />;
  } else if (
    user?.roles.forEach((role: Role) => role.display_name === "player")
  ) {
    return <PlayerLayout />;
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
}
