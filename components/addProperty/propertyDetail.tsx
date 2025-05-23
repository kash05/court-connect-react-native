import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  PropertyDetailFormData,
  propertyDetailSchema,
} from "../../lib/validation/addPropertyValidationSchema";

interface PropertyDetailStepProps {
  data: PropertyDetailFormData;
  onNext: (data: PropertyDetailFormData) => void;
  onBack: () => void | undefined;
}

const SPORTS_OPTIONS = [
  "Football",
  "Basketball",
  "Tennis",
  "Cricket",
  "Badminton",
  "Volleyball",
  "Swimming",
  "Table Tennis",
  "Squash",
  "Hockey",
];

const SURFACE_TYPES = [
  "Grass",
  "Artificial Turf",
  "Concrete",
  "Wooden",
  "Clay",
  "Rubber",
  "Synthetic",
  "Sand",
  "Indoor Court",
];

const FACILITIES_OPTIONS = [
  "Parking",
  "Restrooms",
  "Changing Rooms",
  "Showers",
  "Lockers",
  "First Aid",
  "Cafeteria",
  "Equipment Storage",
  "Seating Area",
  "Lighting",
];

const ACCESSIBILITY_OPTIONS = [
  "Wheelchair Access",
  "Disabled Parking",
  "Accessible Restrooms",
  "Ramps",
  "Wide Doorways",
  "Braille Signage",
  "Audio Announcements",
];

const AMENITIES_OPTIONS = [
  "WiFi",
  "Air Conditioning",
  "Sound System",
  "Scoreboard",
  "CCTV",
  "Security Guard",
  "Referee Services",
  "Coaching Available",
];

export function PropertyDetailStep({
  data,
  onNext,
  onBack,
}: Readonly<PropertyDetailStepProps>) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<PropertyDetailFormData>({
    resolver: zodResolver(propertyDetailSchema),
    defaultValues: data,
    mode: "onChange",
  });

  const watchedSports = watch("sports");
  const watchedSubUnits = watch("subUnits");

  const onSubmit = (formData: PropertyDetailFormData) => {
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

  const toggleSport = (sport: string) => {
    const currentSports = watchedSports || [];
    const newSports = currentSports.includes(sport)
      ? currentSports.filter((s) => s !== sport)
      : [...currentSports, sport];
    setValue("sports", newSports, { shouldValidate: true });
  };

  const toggleArrayItem = (
    array: string[],
    item: string,
    field: keyof PropertyDetailFormData
  ) => {
    const newArray = array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
    setValue(field as any, newArray, { shouldValidate: true });
  };

  const updateSubUnit = (sport: string, count: string) => {
    const numCount = parseInt(count) || 0;
    const newSubUnits = { ...watchedSubUnits };
    if (numCount > 0) {
      newSubUnits[sport] = numCount;
    } else {
      delete newSubUnits[sport];
    }
    setValue("subUnits", newSubUnits, { shouldValidate: true });
  };

  const renderMultiSelect = (
    title: string,
    options: string[],
    selectedItems: string[],
    field: keyof PropertyDetailFormData,
    error?: string
  ) => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.multiSelectContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.multiSelectItem,
              selectedItems.includes(option) && styles.multiSelectItemSelected,
            ]}
            onPress={() => toggleArrayItem(selectedItems, option, field)}
          >
            <Text
              style={[
                styles.multiSelectText,
                selectedItems.includes(option) &&
                  styles.multiSelectTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Property Details</Text>
        <Text style={styles.subtitle}>
          Tell us about the sports and facilities available
        </Text>

        {/* Sports Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Sports Available *</Text>
          <View style={styles.multiSelectContainer}>
            {SPORTS_OPTIONS.map((sport) => (
              <TouchableOpacity
                key={sport}
                style={[
                  styles.multiSelectItem,
                  watchedSports?.includes(sport) &&
                    styles.multiSelectItemSelected,
                ]}
                onPress={() => toggleSport(sport)}
              >
                <Text
                  style={[
                    styles.multiSelectText,
                    watchedSports?.includes(sport) &&
                      styles.multiSelectTextSelected,
                  ]}
                >
                  {sport}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.sports && (
            <Text style={styles.errorText}>{errors.sports.message}</Text>
          )}
        </View>

        {/* Sub Units */}
        {watchedSports && watchedSports.length > 0 && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Number of Courts/Fields</Text>
            <Text style={styles.helperText}>
              Specify how many courts/fields for each sport
            </Text>
            {watchedSports.map((sport) => (
              <View key={sport} style={styles.subUnitRow}>
                <Text style={styles.subUnitLabel}>{sport}</Text>
                <TextInput
                  style={styles.subUnitInput}
                  value={watchedSubUnits?.[sport]?.toString() || ""}
                  onChangeText={(text) => updateSubUnit(sport, text)}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
            ))}
          </View>
        )}

        {/* Surface Type */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Primary Surface Type *</Text>
          <Controller
            control={control}
            name="surfaceType"
            render={({ field: { onChange, value } }) => (
              <View style={styles.radioContainer}>
                {SURFACE_TYPES.map((surface) => (
                  <TouchableOpacity
                    key={surface}
                    style={[
                      styles.radioItem,
                      value === surface && styles.radioItemSelected,
                    ]}
                    onPress={() => onChange(surface)}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        value === surface && styles.radioTextSelected,
                      ]}
                    >
                      {surface}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
          {errors.surfaceType && (
            <Text style={styles.errorText}>{errors.surfaceType.message}</Text>
          )}
        </View>

        {/* Equipment Rental */}
        <View style={styles.formGroup}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Equipment Rental Available</Text>
            <Controller
              control={control}
              name="equipmentRental"
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{ false: "#ddd", true: "#007AFF" }}
                  thumbColor="#fff"
                />
              )}
            />
          </View>
        </View>

        {/* Facilities */}
        <Controller
          control={control}
          name="facilities"
          render={({ field: { value } }) =>
            renderMultiSelect(
              "Facilities Available",
              FACILITIES_OPTIONS,
              value || [],
              "facilities"
            )
          }
        />

        {/* Accessibility */}
        <Controller
          control={control}
          name="accessibility"
          render={({ field: { value } }) =>
            renderMultiSelect(
              "Accessibility Features",
              ACCESSIBILITY_OPTIONS,
              value || [],
              "accessibility"
            )
          }
        />

        {/* Additional Amenities */}
        <Controller
          control={control}
          name="additionalAmenities"
          render={({ field: { value } }) =>
            renderMultiSelect(
              "Additional Amenities",
              AMENITIES_OPTIONS,
              value || [],
              "additionalAmenities"
            )
          }
        />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={onBack}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.primaryButton,
            !isValid && styles.disabledButton,
          ]}
          onPress={handleSubmit(onSubmit, handleError)}
          disabled={!isValid}
        >
          <Text style={[styles.buttonText, styles.primaryButtonText]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    lineHeight: 22,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  helperText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  multiSelectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  multiSelectItem: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  multiSelectItemSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  multiSelectText: {
    fontSize: 14,
    color: "#333",
  },
  multiSelectTextSelected: {
    color: "#fff",
  },
  radioContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  radioItem: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  radioItemSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  radioText: {
    fontSize: 14,
    color: "#333",
  },
  radioTextSelected: {
    color: "#fff",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subUnitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  subUnitLabel: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  subUnitInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    width: 80,
    textAlign: "center",
    fontSize: 16,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: "#fff",
  },
  secondaryButtonText: {
    color: "#333",
  },
});
