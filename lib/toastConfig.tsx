import React from "react";
import {
  BaseToast,
  BaseToastProps,
  ErrorToast,
} from "react-native-toast-message";

export const toastConfig = {
  success: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ backgroundColor: "#4ade80", borderLeftWidth: 0 }}
      text1Style={{ fontSize: 14, fontWeight: "bold", color: "#ffffff" }}
      text2Style={{ fontSize: 12, color: "#4b5563" }}
    />
  ),
  error: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{ backgroundColor: "#f87171", borderLeftWidth: 0 }}
      text1Style={{ fontSize: 14, fontWeight: "bold", color: "#ffffff" }}
      text2Style={{ fontSize: 12, color: "#4b5563" }}
    />
  ),
  warning: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ backgroundColor: "#facc15", borderLeftWidth: 0 }}
      text1Style={{ fontSize: 14, fontWeight: "bold", color: "#ffffff" }}
      text2Style={{ fontSize: 12, color: "#4b5563" }}
    />
  ),
  info: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ backgroundColor: "#38bdf8", borderLeftWidth: 0 }}
      text1Style={{ fontSize: 14, fontWeight: "bold", color: "#ffffff" }}
      text2Style={{ fontSize: 12, color: "#4b5563" }}
    />
  ),
};
