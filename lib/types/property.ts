export interface PropertyForm {
  basicInfo: BasicInfoForm;
  propertyDetail: PropertyDetail;
  timingAndAvailability: TimingAndAvailabilityForm;
  bookingAndPricing: BookingAndPricingForm;
  media: MediaForm;
}

export interface BasicInfoForm {
  name: string;
  description: string;
  address: string;
  latitude?: number;
  longitude?: number;
  contactPhone: string;
  contactEmail: string;
}

export interface PropertyDetail {
  sports: string[];
  subUnits: Record<string, number>;
  surfaceType: string;
  facilities: string[];
  equipmentRental: boolean;
  accessibility: string[];
  additionalAmenities: string[];
}

export interface TimingAndAvailabilityForm {
  openingHours: Record<string, { open: string; close: string }>;
  bookingMode: "slots" | "full-day";
  slotDuration: number;
  weeklySlots: Record<string, { start: string; end: string }[]>;
  exceptions: { date: string; reason?: string }[];
  maxAdvanceDays: number;
  minNoticeHours: number;
}

export interface BookingAndPricingForm {
  pricingModel: "hourly" | "daily";
  baseRate: number;
  peakRates: number[];
  securityDeposit: number;
  preBooking: boolean;
  fullDayBooking: boolean;
  cancellationPolicy: {
    freeWindowHours: number;
    feePercent: number;
    noShowCharge: number;
  };
}

export interface MediaForm {
  images: string[];
  videoUrl?: string;
  floorPlan?: string;
  isActive: boolean;
}
