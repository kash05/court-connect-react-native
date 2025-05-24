import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PropertyForm } from "../../types/property";

interface PropertyState {
  propertyForm: PropertyForm;
  userProperties: PropertyForm[];
  filters: {
    sport?: string;
    location?: string;
    priceRange?: [number, number];
    radius?: number;
  };
  isLoading: boolean;
}

const initialState: PropertyState = {
  propertyForm: {
    basicInfo: {
      name: "",
      description: "",
      address: "",
      contactPhone: "",
      contactEmail: "",
    },
    propertyDetail: {
      sports: [],
      subUnits: {},
      surfaceType: "",
      facilities: [],
      equipmentRental: false,
      accessibility: [],
      additionalAmenities: [],
    },
    timingAndAvailability: {
      openingHours: {},
      bookingMode: "slots",
      slotDuration: [],
      weeklySlots: {},
      exceptions: [],
      maxAdvanceDays: 0,
      minNoticeHours: 0,
    },
    bookingAndPricing: {
      pricingModel: "hourly",
      baseRate: 0,
      peakRates: [],
      securityDeposit: 0,
      preBooking: false,
      fullDayBooking: false,
      cancellationPolicy: {
        freeWindowHours: 0,
        feePercent: 0,
        noShowCharge: 0,
      },
    },
    media: {
      images: [],
      videoUrl: "",
      floorPlan: "",
      isActive: false,
    },
  },
  userProperties: [],
  filters: {},
  isLoading: false,
};

const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    setPropertyForm: (state, action: PayloadAction<PropertyForm>) => {
      state.propertyForm = action.payload;
    },
    setUserProperties: (state, action: PayloadAction<PropertyForm[]>) => {
      state.userProperties = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<PropertyState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    addProperty: (state, action: PayloadAction<PropertyForm>) => {
      state.userProperties.push(action.payload);
    },
  },
});

export const { setPropertyForm, setUserProperties, setFilters, addProperty } =
  propertySlice.actions;
export default propertySlice.reducer;
