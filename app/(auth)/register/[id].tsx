import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { authAPI } from "../../../lib/api/auth";
import { RegisterCredentials } from "../../../lib/types/auth";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["male", "female"], {
    required_error: "Please select your gender",
  }),
  agreeTerms: z.boolean().refine((value) => value === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register({ navigation }: { navigation?: any }) {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const id = useLocalSearchParams().id as any;

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      gender: undefined,
      agreeTerms: false,
    },
  });

  const selectedGender = watch("gender");
  const agreeTerms = watch("agreeTerms");

  const mutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authAPI.register(credentials),
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: "Please check your information and try again",
        visibilityTime: 4000,
      });
      console.error("Registration failed:", error);
    },
    onSuccess: () => {
      router.push("/(auth)/login");
      Toast.show({
        type: "success",
        text1: "Registration Successful",
        text2: "Welcome to CourtConnect!",
        visibilityTime: 3000,
      });
    },
  });

  const handleGoogleRegister = () => {
    Toast.show({
      type: "info",
      text1: "Coming Soon",
      text2: "Google Sign-Up is under development",
      visibilityTime: 3000,
    });
  };

  const navigateToLogin = () => {
    router.push("/(auth)/login");
  };

  const onSubmit = (data: RegisterFormData) => {
    const registerData: RegisterCredentials = {
      name: data.fullName,
      email: data.email,
      password: data.password,
      gender: data.gender,
      agree_terms: data.agreeTerms,
      role: id,
    };
    mutation.mutate(registerData);
  };

  const renderInput = (
    name: keyof RegisterFormData,
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
                value={value as string}
                secureTextEntry={secureTextEntry && !showPassword}
                autoCapitalize={name === "email" ? "none" : "words"}
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

  const renderGenderSelector = () => (
    <View className="mb-4">
      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange } }) => (
          <View>
            <Text className="text-gray-700 text-base font-medium mb-3 ml-2">
              Gender
            </Text>
            <View className="flex-row justify-between">
              {[
                { value: "male", label: "Male", icon: "male-outline" },
                { value: "female", label: "Female", icon: "female-outline" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className={`flex-1 mx-1 h-14 rounded-full border-2 flex-row items-center justify-center ${
                    selectedGender === option.value
                      ? "border-primary bg-primary/10"
                      : "border-gray-300 bg-gray-100"
                  }`}
                  onPress={() => onChange(option.value)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={option.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={
                      selectedGender === option.value ? "#1e88e5" : "#9CA3AF"
                    }
                  />
                  <Text
                    className={`ml-2 text-base font-medium ${
                      selectedGender === option.value
                        ? "text-primary"
                        : "text-gray-600"
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.gender && (
              <Text className="text-danger text-sm mt-2 ml-4">
                {errors.gender?.message}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );

  const renderTermsCheckbox = () => (
    <View className="mb-6">
      <Controller
        control={control}
        name="agreeTerms"
        render={({ field: { onChange } }) => (
          <View>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => onChange(!agreeTerms)}
              activeOpacity={0.7}
            >
              <View
                className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
                  agreeTerms
                    ? "border-primary bg-primary"
                    : "border-gray-300 bg-gray-100"
                }`}
              >
                {agreeTerms && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text className="text-gray-600 text-sm flex-1">
                I agree to the{" "}
                <Text className="text-primary font-semibold">
                  Terms and Conditions
                </Text>{" "}
                and{" "}
                <Text className="text-primary font-semibold">
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>
            {errors.agreeTerms && (
              <Text className="text-danger text-sm mt-2 ml-8">
                {errors.agreeTerms?.message}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#1e88e5" />

      {/* Header Section */}
      <View className="bg-primary pt-16 pb-8 px-6">
        <View className="items-center">
          <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
            <Ionicons name="person-add-outline" size={32} color="white" />
          </View>
          <Text className="text-white text-3xl font-bold mb-2">
            CourtConnect
          </Text>
          <Text className="text-white/80 text-base">
            React Native App - User Registration
          </Text>
        </View>
      </View>

      {/* Form Section */}
      <ScrollView
        className="flex-1 px-6 -mt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-t-3xl pt-8 px-6 pb-8">
          <View className="mb-6">
            {renderInput("fullName", "Full Name", "person-outline")}
            {renderInput("email", "Email", "mail-outline")}
            {renderInput("password", "Password", "lock-closed-outline", true)}
            {renderGenderSelector()}
            {renderTermsCheckbox()}
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
                  Creating Account...
                </Text>
              </View>
            ) : (
              <Text className="text-white text-base font-semibold">
                Sign Up
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center justify-center mb-5">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className=" text-gray-400 text-sm font-medium">or</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Social Login Buttons */}
          <View className="flex-row justify-center space-x-4 mb-5">
            <TouchableOpacity
              className="w-16 h-16 bg-red-500 rounded-full justify-center items-center"
              onPress={handleGoogleRegister}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Sign In Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-500 text-base">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={navigateToLogin} activeOpacity={0.7}>
              <Text className="text-primary text-base font-semibold">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
