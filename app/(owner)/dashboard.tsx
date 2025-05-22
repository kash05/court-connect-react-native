import { Text, View } from "react-native";

export default function OwnerDashboard() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Owner Dashboard</Text>
      <Text className="mt-4">Revenue stats, property overview</Text>
    </View>
  );
}
