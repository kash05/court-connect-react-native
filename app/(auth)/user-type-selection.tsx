import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { UserRole } from "../../lib/enum/UserEnum";

export default function UserTypeSelection() {
  const handleSelect = (id: number) => {
    router.push(`/register/${id}`);
  };

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <Text className="text-3xl font-bold text-center text-dark mb-2">
        Choose Your Role
      </Text>
      <Text className="text-center text-medium mb-10">
        Select the type of account you&apos;d like to create
      </Text>

      {/* Owner Option */}
      <View className="mb-6 p-4 border rounded-2xl border-dark/10 bg-light">
        <Text className="text-xl font-semibold text-dark mb-2">🏟️ Owner</Text>
        <Text className="text-medium mb-4">
          Manage courts, schedules, and view player bookings with ease.
        </Text>
        <TouchableOpacity
          onPress={() => handleSelect(UserRole.Owner)}
          className="bg-primary py-3 rounded-xl"
        >
          <Text className="text-white text-center font-semibold">
            Continue as Owner
          </Text>
        </TouchableOpacity>
      </View>

      {/* Player Option */}
      <View className="mb-6 p-4 border rounded-2xl border-dark/10 bg-light">
        <Text className="text-xl font-semibold text-dark mb-2">🎾 Player</Text>
        <Text className="text-medium mb-4">
          Book courts, join games, and track your stats seamlessly.
        </Text>
        <TouchableOpacity
          onPress={() => handleSelect(UserRole.Player)}
          className="bg-secondary py-3 rounded-xl"
        >
          <Text className="text-white text-center font-semibold">
            Continue as Player
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => router.replace("/(auth)/login")}
        className="bg-tertiary py-3 rounded-xl"
      >
        <Text className="text-white text-center font-semibold">
          Go back to sign in
        </Text>
      </TouchableOpacity>
    </View>
  );
}
