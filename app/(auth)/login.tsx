import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { authAPI } from "../../lib/api/auth";
import { UserRole } from "../../lib/enum/UserEnum";
import { store } from "../../lib/store";
import { setToken, setUser } from "../../lib/store/slices/authSlice";
import { LoginCredentials, TokenInterface } from "../../lib/types/auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login({ navigation }: { navigation?: any }) {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authAPI.login(credentials),
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: "Please check your credentials and try again",
        visibilityTime: 4000,
      });
      console.error("Login failed:", error);
    },
    onSuccess: (data: TokenInterface) => {
      setToken(data.access_token);
      authAPI.getCurrentUser().then((user) => {
        store.dispatch(setUser(user));
      });

      if (
        store
          .getState()
          .auth.userRole?.find((role) => role.id === UserRole.Owner)
      ) {
        router.replace("/(owner)/dashboard");
      } else {
        router.replace("/(player)/home");
      }
    },
  });

  const handleGoogleLogin = () => {
    Toast.show({
      type: "info",
      text1: "Coming Soon",
      text2: "Google Sign-In is under development",
      visibilityTime: 3000,
    });
  };

  const navigateToRegister = () => {
    router.push("/(auth)/user-type-selection");
  };

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  const renderInput = (
    name: keyof LoginFormData,
    placeholder: string,
    icon: keyof typeof Ionicons.glyphMap,
    secureTextEntry = false
  ) => (
    <View className="mb-4">
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <View
              className={`relative rounded-full border ${
                focusedField === name
                  ? "border-primary bg-primary/5"
                  : errors[name]
                  ? "border-danger bg-danger/5"
                  : "border-gray-300 bg-gray-100"
              }`}
            >
              <TextInput
                className="w-full h-14 px-6 text-gray-900 text-base rounded-full"
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                onBlur={() => {
                  onBlur();
                  setFocusedField(null);
                }}
                onFocus={() => setFocusedField(name)}
                onChangeText={onChange}
                value={value}
                secureTextEntry={secureTextEntry && !showPassword}
                autoCapitalize="none"
                keyboardType={name === "email" ? "email-address" : "default"}
              />
              {name === "password" && (
                <TouchableOpacity
                  className="absolute right-6 top-1/2 -translate-y-1/2"
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={focusedField === name ? "#1e88e5" : "#9CA3AF"}
                  />
                </TouchableOpacity>
              )}
            </View>
            {errors[name] && (
              <Text className="text-danger text-sm mt-2 ml-4">
                {errors[name]?.message}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-light">
      <StatusBar barStyle="light-content" backgroundColor="#1e88e5" />

      {/* Header Section */}
      <View className="bg-primary pt-16 pb-8 px-6">
        <View className="items-center">
          <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
            <Ionicons name="game-controller-outline" size={32} color="white" />
          </View>
          <Text className="text-light text-3xl font-bold mb-2">
            CourtConnect
          </Text>
          <Text className="text-light">React Native App - User Login</Text>
        </View>
      </View>

      {/* Form Section */}
      <View className="flex-1 px-6 -mt-4">
        <View className="bg-light-tint rounded-t-3xl pt-8 px-6 flex-1">
          <View className="mb-8">
            {renderInput("email", "Email", "mail-outline")}
            {renderInput("password", "Password", "lock-closed-outline", true)}
          </View>

          <TouchableOpacity
            className="w-full h-14 bg-primary rounded-full justify-center items-center mb-6"
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
          >
            {mutation.isPending ? (
              <View className="flex-row items-center">
                <View className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                <Text className="text-white text-base font-semibold">
                  Signing In...
                </Text>
              </View>
            ) : (
              <Text className="text-white text-base font-semibold">
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center justify-center mb-8">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-6 text-gray-400 text-sm font-medium">or</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Social Login Buttons */}
          <View className="flex-row justify-center space-x-4 mb-8">
            <TouchableOpacity
              className="w-16 h-16 bg-red-500 rounded-full justify-center items-center"
              onPress={handleGoogleLogin}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center items-center">
            <Text className="text-gray-500 text-base">
              Don&apos;t have an account?{" "}
            </Text>
            <TouchableOpacity onPress={navigateToRegister} activeOpacity={0.7}>
              <Text className="text-primary text-base font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
