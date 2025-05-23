import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

export default function ElevatedTabButton({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
