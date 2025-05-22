import { Text, View } from "react-native";

export default function PlayerHome() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Player Home</Text>
      <Text className="mt-4">Featured courts, recent activity</Text>
    </View>
  );
}
