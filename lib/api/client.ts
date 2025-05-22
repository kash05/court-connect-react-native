import axios from "axios";
import { config } from "../config";
import { store } from "../store";

const API_BASE_URL = config.apiBaseUrl;
const API_VERSION = config.apiVersion;

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
