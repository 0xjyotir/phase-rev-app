/**
 * Assessment (sheet) — 4-step baseline profile wizard.
 * Web: homepage #assessment (AssessmentPreviewSection). Members save it to
 * their profile (FRONTEND_BACKEND_INTEGRATION.md → PUT /users/me/assessment).
 *
 *   1 Body metrics  →  2 Your target  →  3 Training load  →  4 Your profile
 *
 * Like the website, steps 1–3 are open to everyone; the results step is for
 * members (visitors are invited to sign in).
 */
import { useRouter } from "expo-router";
import { useHeaderHeight } from "expo-router/react-navigation";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card, Icon, Screen } from "@/components/ui";
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
import { IS_IOS } from "@/lib/platform";
import { useTheme } from "@/providers/ThemeProvider";
import { spacing } from "@/theme";

export default function AssessmentScreen() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const headerHeight = useHeaderHeight();
  const { colors } = useTheme();
  const { profile, actions, isMember } = useProfile();
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
    haptics.select();
    setStepIndex(index);
    // iOS content starts under the translucent bar (inset = header height).
    scrollRef.current?.scrollTo({ y: IS_IOS ? -headerHeight : 0, animated: true });
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
  const primaryLabel = isLast ? (isMember ? "Save to profile" : "Sign in to save") : "Continue";
  const primaryAction = isLast
    ? isMember
      ? save
      : () => router.push("/login")
    : () => goTo(stepIndex + 1);

  return (
    <Screen
      variant="modal"
      title={assessmentCopy.eyebrow}
      scrollRef={scrollRef}
      keyboardAware
      footer={
        <View style={styles.footer}>
          {stepIndex > 0 ? (
            <Button
              label="Back"
              variant="secondary"
              size="lg"
              style={styles.flex}
              onPress={() => goTo(stepIndex - 1)}
            />
          ) : null}
          <Button
            label={primaryLabel}
            icon={isLast ? (isMember ? "check" : "lock") : "arrow-right"}
            iconPosition="right"
            size="lg"
            style={styles.flexWide}
            disabled={!stepValid}
            onPress={primaryAction}
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

      {stepIndex === 3 && isMember ? <AssessmentResults values={values} bmi={bmi} /> : null}

      {stepIndex === 3 && !isMember ? (
        <Card style={styles.gate}>
          <View style={[styles.lock, { backgroundColor: colors.accentSoft }]}>
            <Icon name="lock" size={22} color="accent" />
          </View>
          <AppText variant="h3" align="center">
            Your profile is ready
          </AppText>
          <AppText variant="small" color="textMuted" align="center">
            Sign in to see your BMI summary, starting fuel targets and recommended pillar path —
            saved to your account.
          </AppText>
        </Card>
      ) : null}

      <AppText variant="caption" color="textMuted" align="center">
        {assessmentCopy.footnote} · {assessmentCopy.duration}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gapSm: { gap: spacing.md },
  footer: { flexDirection: "row", gap: spacing.sm },
  flex: { flex: 1, alignSelf: "stretch" },
  flexWide: { flex: 2, alignSelf: "stretch" },
  gate: { alignItems: "center", gap: spacing.md, paddingVertical: spacing.xxxl },
  lock: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
