import { Text, View } from "react-native";

export default function PlayerBookings() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">My Bookings</Text>
      <Text className="mt-4">Upcoming and past bookings</Text>
    </View>
  );
}
