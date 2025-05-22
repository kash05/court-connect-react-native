import { Text, View } from "react-native";

export default function OwnerBookings() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">My Property Bookings</Text>
      <Text className="mt-4">All bookings across properties</Text>
    </View>
  );
}
