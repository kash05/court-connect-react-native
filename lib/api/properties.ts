import { apiClient } from "./client";

export const propertiesAPI = {
  // Player APIs
  searchProperties: async (filters: {
    sport?: string;
    location?: { lat: number; lng: number };
    radius?: number;
    date?: string;
  }) => {
    const response = await apiClient.get("/properties/search", {
      params: filters,
    });
    return response.data;
  },

  getPropertyDetails: async (id: string) => {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data;
  },

  // Owner APIs
  createProperty: async (propertyData: any) => {
    const response = await apiClient.post("/properties", propertyData);
    return response.data;
  },

  getMyProperties: async () => {
    const response = await apiClient.get("/properties/my-properties");
    return response.data;
  },

  updateProperty: async (id: string, data: any) => {
    const response = await apiClient.put(`/properties/${id}`, data);
    return response.data;
  },
};
