import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import ElevatedTabButton from "../../components/ElevatedTabButton";

export default function PlayerLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 55,
          position: "absolute",
          borderTopWidth: 0,
          backgroundColor: "#fff",
          elevation: 10,
        },
        tabBarActiveTintColor: "var(--primary-color)",
        tabBarInactiveTintColor: "var(--medium-color)",
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbox-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="addProperty"
        options={{
          tabBarIcon: ({ color }) => (
            <ElevatedTabButton>
              <Ionicons name="add" size={28} color="#fff" />
            </ElevatedTabButton>
          ),
          headerShown: true,
          headerTitle: "Add Property",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="var(--primary-color)"
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: "#fff",
            elevation: 2,
            shadowOpacity: 0.1,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
            color: "var(--primary-color)",
          },
          tabBarStyle: {
            display: "none",
          },
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
