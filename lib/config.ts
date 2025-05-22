import Constants from "expo-constants";

const getEnvVar = (key: string) => {
  return Constants.expoConfig?.extra?.[key] ?? process.env[key];
};

export const config = {
  apiBaseUrl: getEnvVar("API_BASE_URL"),
  apiVersion: getEnvVar("API_VERSION"),
};
