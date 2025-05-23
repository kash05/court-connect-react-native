import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import ElevatedTabButton from "../../components/ElevatedTabButton";

export default function PlayerLayout() {
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
        name="home"
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
        name="search"
        options={{
          tabBarIcon: ({ color }) => (
            <ElevatedTabButton>
              <Ionicons name="search-outline" size={24} color="#fff" />
            </ElevatedTabButton>
          ),
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
