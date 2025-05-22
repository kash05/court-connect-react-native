import Constants from "expo-constants";

const getEnvVar = (key: string) => {
  return Constants.expoConfig?.extra?.[key];
};

export const config = {
  apiBaseUrl: getEnvVar("API_BASE_URL"),
  apiVersion: getEnvVar("API_VERSION"),
  clientId: getEnvVar("CLIENT_ID"),
  clientSecret: getEnvVar("CLIENT_SECRET"),
};
