/**
 * Assessment (modal) — 4-step baseline profile wizard.
 * Web: homepage #assessment (AssessmentPreviewSection) — here it saves to the
 * member profile (FRONTEND_BACKEND_INTEGRATION.md → PUT /users/me/assessment).
 *
 *   1 Body metrics  →  2 Your target  →  3 Training load  →  4 Your profile
 */
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card, Screen, ScreenHeader } from "@/components/ui";
import {
  assessmentActivityLevels,
  assessmentCopy,
  assessmentDefaults,
  assessmentGoals,
  assessmentSteps,
} from "@/constants/assessment";
import { AssessmentResults } from "@/features/assessment/components/AssessmentResults";
import { BmiGauge } from "@/features/assessment/components/BmiGauge";
import { BodyMetricsForm } from "@/features/assessment/components/BodyMetricsForm";
import { OptionList } from "@/features/assessment/components/OptionList";
import { StepIndicator } from "@/features/assessment/components/StepIndicator";
import { calculateBmi } from "@/features/assessment/lib/bmi";
import { useProfile } from "@/hooks/useProfile";
import { haptics } from "@/lib/haptics";
import { spacing } from "@/theme";

export default function AssessmentScreen() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const { profile, actions } = useProfile();
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState(() => ({
    ...assessmentDefaults,
    ...(profile.assessment ?? {}),
  }));

  const bmi = calculateBmi(values.weightKg, values.heightCm);
  const update = (patch) => setValues((current) => ({ ...current, ...patch }));
  const isLast = stepIndex === assessmentSteps.length - 1;
  const stepValid =
    stepIndex !== 0 || (values.heightCm > 100 && values.weightKg > 30 && values.age > 12);

  const goTo = (index) => {
    setStepIndex(index);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const save = () => {
    actions.saveAssessment({
      ...values,
      bmi: Math.round((bmi ?? 0) * 10) / 10,
      completedAt: new Date().toISOString(),
    });
    haptics.success();
    router.back();
  };

  const delta = Math.round((values.targetWeightKg - values.weightKg) * 10) / 10;

  return (
    <Screen
      scrollRef={scrollRef}
      keyboardAware
      header={
        <ScreenHeader
          title={assessmentCopy.eyebrow}
          subtitle={`${assessmentCopy.duration} · saved to your profile`}
          leftIcon="x"
        />
      }
      footer={
        <View style={styles.footer}>
          {stepIndex > 0 ? (
            <Button
              label="Back"
              variant="secondary"
              style={styles.flex}
              onPress={() => goTo(stepIndex - 1)}
            />
          ) : null}
          <Button
            label={isLast ? "Save to profile" : "Continue"}
            icon={isLast ? "check" : "arrow-right"}
            iconPosition="right"
            style={styles.flexWide}
            disabled={!stepValid}
            onPress={isLast ? save : () => goTo(stepIndex + 1)}
          />
        </View>
      }
    >
      <StepIndicator steps={assessmentSteps} currentIndex={stepIndex} />

      {stepIndex === 0 ? (
        <>
          <Card>
            <BodyMetricsForm values={values} onChange={update} />
          </Card>
          <Card>
            <BmiGauge bmi={bmi} />
          </Card>
        </>
      ) : null}

      {stepIndex === 1 ? (
        <>
          <Card style={styles.gapSm}>
            <BodyMetricsForm values={values} onChange={update} fields={["target"]} />
            <AppText variant="small" color="textMuted">
              {delta === 0
                ? "Holding your current weight."
                : `${delta > 0 ? "Gain" : "Lose"} ${Math.abs(delta)} kg from where you are now.`}
            </AppText>
          </Card>
          <OptionList
            options={assessmentGoals}
            value={values.goalId}
            onChange={(goalId) => update({ goalId })}
          />
        </>
      ) : null}

      {stepIndex === 2 ? (
        <OptionList
          options={assessmentActivityLevels}
          value={values.activityId}
          onChange={(activityId) => update({ activityId })}
        />
      ) : null}

      {stepIndex === 3 ? <AssessmentResults values={values} bmi={bmi} /> : null}

      <AppText variant="caption" color="textMuted" align="center">
        {assessmentCopy.footnote}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gapSm: { gap: spacing.md },
  footer: { flexDirection: "row", gap: spacing.sm },
  flex: { flex: 1, alignSelf: "stretch" },
  flexWide: { flex: 2, alignSelf: "stretch" },
});
