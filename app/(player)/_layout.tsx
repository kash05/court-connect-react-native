import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

function ElevatedTabButton({ children }: { children: React.ReactNode }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          top: -25,
          justifyContent: "center",
          alignItems: "center",
          elevation: 6,
        },
      ]}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 100,
          backgroundColor: "var(--secondary-color)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </View>
    </Animated.View>
  );
}

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
