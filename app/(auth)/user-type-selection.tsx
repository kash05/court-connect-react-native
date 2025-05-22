import { Text, View } from "react-native";

export default function UserTypeSelection() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Choose User Type</Text>
      <Text className="mt-4">Owner or Player?</Text>
    </View>
  );
}
