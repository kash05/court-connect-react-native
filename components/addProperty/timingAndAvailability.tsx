import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  TimingAndAvailabilityFormData,
  timingAndAvailabilitySchema,
} from "../../lib/validation/addPropertyValidationSchema";

interface TimingAvailabilityStepProps {
  data: TimingAndAvailabilityFormData;
  onNext: (data: TimingAndAvailabilityFormData) => void;
  onBack: () => void;
}

const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const BOOKING_MODES = [
  {
    key: "slots",
    label: "Time Slots",
    description: "Hourly or custom slot booking",
  },
  {
    key: "full_day",
    label: "Full Day",
    description: "Entire day booking only",
  },
  { key: "both", label: "Both", description: "Slots and full day options" },
];

const SLOT_DURATIONS = [
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
  { value: 180, label: "3 hours" },
  { value: 240, label: "4 hours" },
  { value: 360, label: "6 hours" },
  { value: 480, label: "8 hours" },
];

export function TimingAvailabilityStep({
  data,
  onNext,
  onBack,
}: Readonly<TimingAvailabilityStepProps>) {
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedTimeType, setSelectedTimeType] = useState<"open" | "close">(
    "open"
  );
  const [applyToAllTime, setApplyToAllTime] = useState({ open: "", close: "" });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<TimingAndAvailabilityFormData>({
    resolver: zodResolver(timingAndAvailabilitySchema),
    defaultValues: data,
    mode: "onChange",
  });

  const watchedOpeningHours = watch("openingHours");
  const watchedBookingMode = watch("bookingMode");
  const watchedSlotDuration = watch("slotDuration");

  React.useEffect(() => {
    if (watchedSlotDuration && !Array.isArray(watchedSlotDuration)) {
      setValue("slotDuration", [watchedSlotDuration], { shouldValidate: true });
    }
  }, []);

  const onSubmit = (formData: TimingAndAvailabilityFormData) => {
    onNext(formData);
  };

  const handleError = () => {
    if (Object.keys(errors).length > 0) {
      const firstErrorObj = Object.values(errors)[0];
      const firstError =
        typeof firstErrorObj === "object" &&
        firstErrorObj &&
        "message" in firstErrorObj
          ? firstErrorObj.message
          : firstErrorObj;
      Alert.alert(
        "Validation Error",
        typeof firstError === "string" ? firstError : "Please fix the errors"
      );
    }
  };

  const generateTimeSlots = (
    start: string,
    end: string,
    durations: number[]
  ) => {
    const allSlots: string[] = [];
    durations.forEach((duration) => {
      const slots = [];
      const startMinutes = timeToMinutes(start);
      const endMinutes = timeToMinutes(end);

      for (
        let minutes = startMinutes;
        minutes < endMinutes;
        minutes += duration
      ) {
        slots.push(minutesToTime(minutes));
      }
      allSlots.push(...slots);
    });
    return [...new Set(allSlots)].sort();
  };

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  const updateOpeningHours = (
    day: string,
    type: "open" | "close",
    time: string
  ) => {
    const currentHours = watchedOpeningHours || {};
    const updatedHours = {
      ...currentHours,
      [day]: {
        ...currentHours[day],
        [type]: time,
      },
    };
    setValue("openingHours", updatedHours, { shouldValidate: true });
  };

  const updateWeeklySlots = () => {
    const weeklySlots: Record<string, string[]> = {};

    DAYS_OF_WEEK.forEach(({ key }) => {
      const dayHours = watchedOpeningHours?.[key];
      if (
        dayHours?.open &&
        dayHours?.close &&
        watchedSlotDuration &&
        Array.isArray(watchedSlotDuration)
      ) {
        weeklySlots[key] = generateTimeSlots(
          dayHours.open,
          dayHours.close,
          watchedSlotDuration
        );
      }
    });

    setValue("weeklySlots", weeklySlots, { shouldValidate: true });
  };

  const applyTimeToAllDays = (timeType: "open" | "close", time: string) => {
    const currentHours = watchedOpeningHours || {};
    const updatedHours: Record<string, any> = {};

    DAYS_OF_WEEK.forEach(({ key }) => {
      updatedHours[key] = {
        ...currentHours[key],
        [timeType]: time,
      };
    });

    setValue("openingHours", updatedHours, { shouldValidate: true });
    setApplyToAllTime((prev) => ({ ...prev, [timeType]: time }));
  };

  const toggleDayClosed = (day: string) => {
    const currentHours = watchedOpeningHours || {};
    const updatedHours = {
      ...currentHours,
      [day]: currentHours[day]?.close
        ? { ...currentHours[day], closed: false }
        : { ...currentHours[day], closed: true, open: "", close: "" },
    };
    setValue("openingHours", updatedHours, { shouldValidate: true });
  };

  React.useEffect(() => {
    if (watchedBookingMode === "slots" || watchedBookingMode === "both") {
      updateWeeklySlots();
    }
  }, [watchedOpeningHours, watchedSlotDuration]);

  React.useEffect(() => {
    if (watchedBookingMode === "slots" || watchedBookingMode === "both") {
      updateWeeklySlots();
    }
  }, [watchedOpeningHours, watchedSlotDuration]);

  const renderTimeSelector = (day: string, type: "open" | "close") => {
    const dayHours = watchedOpeningHours?.[day];
    const time = dayHours?.[type] || "";
    const isClosed = dayHours?.close;

    return (
      <TouchableOpacity
        className={`px-3 py-2 rounded border min-w-20 ${
          isClosed
            ? "bg-gray-200 border-gray-300"
            : "bg-gray-50 border-gray-300"
        }`}
        onPress={() => {
          if (!isClosed) {
            setSelectedDay(day);
            setSelectedTimeType(type);
            setShowTimeModal(true);
          }
        }}
        disabled={!!isClosed}
      >
        <Text
          className={`text-sm text-center ${
            isClosed ? "text-gray-400" : "text-gray-800"
          }`}
        >
          {isClosed ? "Closed" : time || `Select ${type} time`}
        </Text>
      </TouchableOpacity>
    );
  };

  const TimePickerModal = () => {
    const [selectedHour, setSelectedHour] = useState("09");
    const [selectedMinute, setSelectedMinute] = useState("00");

    const handleTimeConfirm = () => {
      const time = `${selectedHour}:${selectedMinute}`;
      updateOpeningHours(selectedDay, selectedTimeType, time);
      setShowTimeModal(false);
    };

    const handleApplyToAll = () => {
      const time = `${selectedHour}:${selectedMinute}`;
      applyTimeToAllDays(selectedTimeType, time);
      setShowTimeModal(false);
    };

    return (
      <Modal visible={showTimeModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-lg p-6 mx-4 w-80">
            <Text className="text-lg font-semibold text-gray-800 text-center mb-4">
              Select {selectedTimeType} time
            </Text>
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-600 mb-2">
                  Hour
                </Text>
                <ScrollView className="h-32 border border-gray-200 rounded">
                  {Array.from({ length: 24 }, (_, i) => (
                    <TouchableOpacity
                      key={i}
                      className={`p-3 border-b border-gray-100 ${
                        selectedHour === i.toString().padStart(2, "0")
                          ? "bg-blue-50"
                          : ""
                      }`}
                      onPress={() =>
                        setSelectedHour(i.toString().padStart(2, "0"))
                      }
                    >
                      <Text className="text-center text-gray-800">
                        {i.toString().padStart(2, "0")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-600 mb-2">
                  Minute
                </Text>
                <ScrollView className="h-32 border border-gray-200 rounded">
                  {["00", "15", "30", "45"].map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      className={`p-3 border-b border-gray-100 ${
                        selectedMinute === minute ? "bg-blue-50" : ""
                      }`}
                      onPress={() => setSelectedMinute(minute)}
                    >
                      <Text className="text-center text-gray-800">
                        {minute}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            <View className="flex-row gap-2 mt-6">
              <TouchableOpacity
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg"
                onPress={() => setShowTimeModal(false)}
              >
                <Text className="text-center text-gray-700 font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 px-4 bg-green-600 rounded-lg"
                onPress={handleApplyToAll}
              >
                <Text className="text-center text-white font-medium text-xs">
                  Apply to All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 px-4 bg-blue-600 rounded-lg"
                onPress={handleTimeConfirm}
              >
                <Text className="text-center text-white font-medium">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          Timing & Availability
        </Text>
        <Text className="text-base text-gray-600 mb-4 leading-6">
          Set your operating hours and booking preferences
        </Text>

        {/* Information Banner */}
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <Text className="text-blue-800 text-sm">
            ℹ️ Don&apos;t worry! These settings can be changed anytime from your
            dashboard settings.
          </Text>
        </View>

        {/* Opening Hours */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-3">
            Opening Hours
          </Text>
          {DAYS_OF_WEEK.map(({ key, label }) => {
            const dayHours = watchedOpeningHours?.[key];
            const isClosed = dayHours?.close;

            return (
              <View
                key={key}
                className="flex-row justify-between items-center py-3 border-b border-gray-100"
              >
                <View className="flex-row items-center w-32">
                  <Text className="text-base text-gray-800 flex-1">
                    {label}
                  </Text>
                  <TouchableOpacity
                    className={`px-2 py-1 rounded text-xs border ${
                      isClosed
                        ? "bg-red-100 border-red-300"
                        : "bg-green-100 border-green-300"
                    }`}
                    onPress={() => toggleDayClosed(key)}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        isClosed ? "text-red-700" : "text-green-700"
                      }`}
                    >
                      {isClosed ? "Closed" : "Open"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row items-center">
                  {renderTimeSelector(key, "open")}
                  <Text className="mx-2 text-gray-600">to</Text>
                  {renderTimeSelector(key, "close")}
                </View>
              </View>
            );
          })}
        </View>

        {/* Booking Mode */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-3">
            Booking Mode *
          </Text>
          <Controller
            control={control}
            name="bookingMode"
            render={({ field: { onChange, value } }) => (
              <View className="gap-3">
                {BOOKING_MODES.map((mode) => (
                  <TouchableOpacity
                    key={mode.key}
                    className={`p-4 rounded-lg border ${
                      value === mode.key
                        ? "bg-blue-50 border-blue-500"
                        : "bg-gray-50 border-gray-300"
                    }`}
                    onPress={() => onChange(mode.key)}
                  >
                    <Text
                      className={`font-medium ${
                        value === mode.key ? "text-blue-700" : "text-gray-800"
                      }`}
                    >
                      {mode.label}
                    </Text>
                    <Text
                      className={`text-sm mt-1 ${
                        value === mode.key ? "text-blue-600" : "text-gray-600"
                      }`}
                    >
                      {mode.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
          {errors.bookingMode && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.bookingMode.message}
            </Text>
          )}
        </View>

        {/* Slot Duration */}
        {(watchedBookingMode === "slots" || watchedBookingMode === "both") && (
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-3">
              Slot Duration *
            </Text>
            <Text className="text-sm text-gray-600 mb-3">
              Select multiple slot durations to offer more flexibility
            </Text>
            <Controller
              control={control}
              name="slotDuration"
              render={({ field: { onChange, value } }) => {
                const selectedDurations = Array.isArray(value)
                  ? value
                  : value
                  ? [value]
                  : [];

                const toggleDuration = (duration: number) => {
                  const newDurations = selectedDurations.includes(duration)
                    ? selectedDurations.filter((d) => d !== duration)
                    : [...selectedDurations, duration];
                  onChange(newDurations);
                };

                return (
                  <View className="flex-row flex-wrap gap-2">
                    {SLOT_DURATIONS.map((slot) => (
                      <TouchableOpacity
                        key={slot.value}
                        className={`px-4 py-2 rounded-lg border ${
                          selectedDurations.includes(slot.value)
                            ? "bg-blue-600 border-blue-600"
                            : "bg-white border-gray-300"
                        }`}
                        onPress={() => toggleDuration(slot.value)}
                      >
                        <Text
                          className={`font-medium ${
                            selectedDurations.includes(slot.value)
                              ? "text-white"
                              : "text-gray-700"
                          }`}
                        >
                          {slot.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                );
              }}
            />
            {errors.slotDuration && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.slotDuration.message}
              </Text>
            )}
          </View>
        )}

        {/* Booking Settings */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-3">
            Booking Settings
          </Text>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Max Advance Days *
              </Text>
              <Text className="text-xs text-gray-500 mb-2">
                How many days ahead can customers book? (e.g., 30 means they can
                book up to 30 days from today)
              </Text>
              <Controller
                control={control}
                name="maxAdvanceDays"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`border rounded-lg px-3 py-2 text-base ${
                      errors.maxAdvanceDays
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(parseInt(text) || 0)}
                    value={value?.toString() || ""}
                    placeholder="30"
                    keyboardType="numeric"
                  />
                )}
              />
              {errors.maxAdvanceDays && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.maxAdvanceDays.message}
                </Text>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Min Notice Hours *
              </Text>
              <Text className="text-xs text-gray-500 mb-2">
                Minimum hours required before booking (e.g., 2 means customers
                must book at least 2 hours ahead)
              </Text>
              <Controller
                control={control}
                name="minNoticeHours"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`border rounded-lg px-3 py-2 text-base ${
                      errors.minNoticeHours
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(parseInt(text) || 0)}
                    value={value?.toString() || ""}
                    placeholder="2"
                    keyboardType="numeric"
                  />
                )}
              />
              {errors.minNoticeHours && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.minNoticeHours.message}
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="flex-row gap-3 p-5 bg-white border-t border-gray-200">
        <TouchableOpacity
          className="flex-1 py-3 px-4 border border-gray-300 rounded-lg"
          onPress={onBack}
        >
          <Text className="text-center text-gray-700 font-medium">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 px-4 rounded-lg ${
            isValid ? "bg-blue-600" : "bg-gray-300"
          }`}
          onPress={handleSubmit(onSubmit, handleError)}
          disabled={!isValid}
        >
          <Text
            className={`text-center font-medium ${
              isValid ? "text-white" : "text-gray-500"
            }`}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>

      <TimePickerModal />
    </View>
  );
}
