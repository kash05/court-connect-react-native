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
      style={{ backgroundColor: "var(--success-color)", borderLeftWidth: 0 }}
      text1Style={{
        fontSize: 14,
        fontWeight: "bold",
        color: "var(--success-contrast)",
      }}
      text2Style={{ fontSize: 12, color: "var(--success-contrast)" }}
    />
  ),
  error: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{ backgroundColor: "var(--danger-color)", borderLeftWidth: 0 }}
      text1Style={{
        fontSize: 14,
        fontWeight: "bold",
        color: "var(--danger-contrast)",
      }}
      text2Style={{ fontSize: 12, color: "var(--danger-contrast)" }}
    />
  ),
  warning: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ backgroundColor: "var(--warning-color)", borderLeftWidth: 0 }}
      text1Style={{
        fontSize: 14,
        fontWeight: "bold",
        color: "var(--warning-contrast)",
      }}
      text2Style={{ fontSize: 12, color: "var(--warning-contrast)" }}
    />
  ),
  info: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ backgroundColor: "var(--secondary-color)", borderLeftWidth: 0 }}
      text1Style={{
        fontSize: 14,
        fontWeight: "bold",
        color: "var(--secondary-contrast)",
      }}
      text2Style={{ fontSize: 12, color: "var(--secondary-contrast)" }}
    />
  ),
};
