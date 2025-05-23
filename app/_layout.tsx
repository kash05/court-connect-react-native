import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { AppNavigator } from "../lib/navigation/AppNavigator";
import { store } from "../lib/store";
import { toastConfig } from "../lib/toastConfig";
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppNavigator />
        <Toast config={toastConfig} />
      </QueryClientProvider>
    </Provider>
  );
}
