import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Property {
  id: string;
  name: string;
  sport: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  price: number;
  availability: any[];
  images: string[];
  ownerId: string;
}

interface PropertyState {
  properties: Property[];
  userProperties: Property[];
  filters: {
    sport?: string;
    location?: string;
    priceRange?: [number, number];
    radius?: number;
  };
  isLoading: boolean;
}

const initialState: PropertyState = {
  properties: [],
  userProperties: [],
  filters: {},
  isLoading: false,
};

const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.properties = action.payload;
    },
    setUserProperties: (state, action: PayloadAction<Property[]>) => {
      state.userProperties = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<PropertyState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    addProperty: (state, action: PayloadAction<Property>) => {
      state.userProperties.push(action.payload);
    },
  },
});

export const { setProperties, setUserProperties, setFilters, addProperty } =
  propertySlice.actions;
export default propertySlice.reducer;
