import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { authAPI } from "../../lib/api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: () => authAPI.login({ email, password }),
    onError: (error: any) => {
      console.error("Login failed:", error);
    },
  });

  const handleLogin = () => {
    if (!email || !password) return;
    mutation.mutate();
  };

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <Text className="text-3xl font-bold text-center mb-6">Login</Text>

      <TextInput
        className="border border-gray-300 rounded-md p-3 mb-4"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="border border-gray-300 rounded-md p-3 mb-4"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className="bg-blue-600 py-3 rounded-md"
        onPress={handleLogin}
      >
        <Text className="text-white text-center font-semibold">Login</Text>
      </TouchableOpacity>
    </View>
  );
}
