import { Role } from "../types/auth";
import { apiClient } from "./client";

export const systemConfigs = {
  getRoles: async () => {
    const response = await apiClient.get<Role>("/users/roles");
    return response.data;
  },
};
