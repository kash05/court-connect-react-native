import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../lib/store";
import { setPropertyForm } from "../../lib/store/slices/propertySlice";
import { PropertyForm } from "../../lib/types/property";
import { BasicInfoStep } from "./basicInfoStep";
import { PropertyDetailStep } from "./propertyDetail";

type FormStep =
  | "basicInfo"
  | "propertyDetail"
  | "timingAndAvailability"
  | "bookingAndPricing"
  | "media";

const STEPS: { key: FormStep; title: string; description: string }[] = [
  {
    key: "basicInfo",
    title: "Basic Info",
    description: "Property name, description, and contact details",
  },
  {
    key: "propertyDetail",
    title: "Property Details",
    description: "Sports, facilities, and amenities",
  },
  {
    key: "timingAndAvailability",
    title: "Timing & Availability",
    description: "Opening hours and booking settings",
  },
  {
    key: "bookingAndPricing",
    title: "Booking & Pricing",
    description: "Rates, policies, and payment settings",
  },
  {
    key: "media",
    title: "Media",
    description: "Photos, videos, and floor plans",
  },
];

export function MultiStepPropertyForm() {
  const dispatch = useDispatch();
  const { propertyForm } = useSelector((state: RootState) => state.properties);
  const [currentStep, setCurrentStep] = useState<FormStep>("basicInfo");
  const [completedSteps, setCompletedSteps] = useState<Set<FormStep>>(
    new Set()
  );

  const currentStepIndex = STEPS.findIndex((step) => step.key === currentStep);

  const updateFormData = (stepKey: FormStep, data: any) => {
    const updatedForm: PropertyForm = {
      ...propertyForm,
      [stepKey]: data,
    };
    dispatch(setPropertyForm(updatedForm));
  };

  const handleNext = (stepKey: FormStep, data: any) => {
    updateFormData(stepKey, data);
    setCompletedSteps((prev) => new Set([...prev, stepKey]));

    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < STEPS.length) {
      setCurrentStep(STEPS[nextStepIndex].key);
    } else {
      handleFormSubmit();
    }
  };

  const handleBack = () => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(STEPS[prevStepIndex].key);
    }
  };

  const handleFormSubmit = () => {
    console.log("Form completed:", propertyForm);
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        {STEPS.map((step, index) => (
          <View key={step.key} style={styles.progressStep}>
            <View
              style={[
                styles.progressDot,
                completedSteps.has(step.key) && styles.completedDot,
                step.key === currentStep && styles.activeDot,
              ]}
            >
              <Text
                style={[
                  styles.progressNumber,
                  (completedSteps.has(step.key) || step.key === currentStep) &&
                    styles.activeProgressNumber,
                ]}
              >
                {index + 1}
              </Text>
            </View>
            {index < STEPS.length - 1 && (
              <View
                style={[
                  styles.progressLine,
                  completedSteps.has(step.key) && styles.completedLine,
                ]}
              />
            )}
          </View>
        ))}
      </View>
      <View style={styles.stepInfo}>
        <Text style={styles.stepTitle}>{STEPS[currentStepIndex].title}</Text>
        <Text style={styles.stepDescription}>
          {STEPS[currentStepIndex].description}
        </Text>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "basicInfo":
        return (
          <BasicInfoStep
            data={propertyForm.basicInfo}
            onNext={(data) => handleNext("basicInfo", data)}
            onBack={handleBack}
          />
        );
      case "propertyDetail":
        return (
          <PropertyDetailStep
            data={propertyForm.propertyDetail}
            onNext={(data) => handleNext("propertyDetail", data)}
            onBack={handleBack}
          />
        );
      case "timingAndAvailability":
        // TODO: Implement TimingAvailabilityStep
        return (
          <View>
            <Text>Timing & Availability Step - To be implemented</Text>
          </View>
        );
      case "bookingAndPricing":
        // TODO: Implement BookingPricingStep
        return (
          <View>
            <Text>Booking & Pricing Step - To be implemented</Text>
          </View>
        );
      case "media":
        // TODO: Implement MediaStep
        return (
          <View>
            <Text>Media Step - To be implemented</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderProgressBar()}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentStep()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  progressContainer: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e9ecef",
  },
  activeDot: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  completedDot: {
    backgroundColor: "#28a745",
    borderColor: "#28a745",
  },
  progressNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6c757d",
  },
  activeProgressNumber: {
    color: "#fff",
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: "#e9ecef",
    marginHorizontal: 4,
  },
  completedLine: {
    backgroundColor: "#28a745",
  },
  stepInfo: {
    alignItems: "center",
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
