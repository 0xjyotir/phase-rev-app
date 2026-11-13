/**
 * Thought reframe (sheet) — the Mental pillar's CBT activity ("Anxiety Reset").
 *
 * A guided thought record in five short steps:
 *   what happened → the automatic thought → how strongly you believe it (and
 *   the feeling) → evidence for and against → a more balanced thought, then
 *   re-rate. The drop in belief is the win. Saved to the member profile.
 */
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card, Chip, Screen, Stepper, TextField } from "@/components/ui";
import { reframeFeelings, reframeSteps } from "@/constants/mental";
import { StepIndicator } from "@/features/assessment/components/StepIndicator";
import { useProfile } from "@/hooks/useProfile";
import { haptics } from "@/lib/haptics";
import { spacing } from "@/theme";

const percent = (value) => `${value}%`;

export default function ReframeScreen() {
  const router = useRouter();
  const { actions } = useProfile();
  const [stepIndex, setStepIndex] = useState(0);
  const [record, setRecord] = useState({
    situation: "",
    thought: "",
    beliefBefore: 70,
    feelings: [],
    evidenceFor: "",
    evidenceAgainst: "",
    balanced: "",
    beliefAfter: 40,
  });
  const update = (patch) => setRecord((current) => ({ ...current, ...patch }));
  const step = reframeSteps[stepIndex];
  const isLast = stepIndex === reframeSteps.length - 1;

  const valid = {
    situation: record.situation.trim().length > 0,
    thought: record.thought.trim().length > 0,
    feeling: record.feelings.length > 0,
    evidence: record.evidenceFor.trim().length > 0 || record.evidenceAgainst.trim().length > 0,
    balanced: record.balanced.trim().length > 0,
  }[step.id];

  const save = () => {
    actions.saveReframe({ ...record });
    haptics.success();
    router.back();
  };

  const toggleFeeling = (feeling) =>
    update({
      feelings: record.feelings.includes(feeling)
        ? record.feelings.filter((item) => item !== feeling)
        : [...record.feelings, feeling],
    });

  return (
    <Screen
      variant="modal"
      title="Thought reframe"
      keyboardAware
      footer={
        <View style={styles.footer}>
          {stepIndex > 0 ? (
            <Button
              label="Back"
              variant="secondary"
              size="lg"
              style={styles.flex}
              onPress={() => setStepIndex((i) => i - 1)}
            />
          ) : null}
          <Button
            label={isLast ? "Save reframe" : "Continue"}
            icon={isLast ? "check" : "arrow-right"}
            iconPosition="right"
            size="lg"
            style={styles.flexWide}
            disabled={!valid}
            onPress={isLast ? save : () => setStepIndex((i) => i + 1)}
          />
        </View>
      }
    >
      <StepIndicator
        steps={reframeSteps.map((item) => ({ id: item.id, title: item.title, description: item.hint }))}
        currentIndex={stepIndex}
      />

      {step.id === "situation" ? (
        <TextField
          placeholder={step.placeholder}
          value={record.situation}
          onChangeText={(situation) => update({ situation })}
          multiline
          autoFocus
        />
      ) : null}

      {step.id === "thought" ? (
        <TextField
          placeholder={step.placeholder}
          value={record.thought}
          onChangeText={(thought) => update({ thought })}
          multiline
          autoFocus
        />
      ) : null}

      {step.id === "feeling" ? (
        <>
          <Card tone="soft" style={styles.gapSm}>
            <AppText variant="captionStrong" color="textMuted">
              YOUR THOUGHT
            </AppText>
            <AppText variant="bodyMedium">“{record.thought.trim()}”</AppText>
          </Card>
          <Stepper
            label="How strongly you believe it"
            value={record.beliefBefore}
            min={0}
            max={100}
            step={10}
            format={percent}
            onChange={(beliefBefore) => update({ beliefBefore })}
          />
          <AppText variant="captionStrong" color="textMuted">
            HOW IT MADE YOU FEEL
          </AppText>
          <View style={styles.chips}>
            {reframeFeelings.map((feeling) => (
              <Chip
                key={feeling}
                label={feeling}
                size="md"
                selected={record.feelings.includes(feeling)}
                onPress={() => toggleFeeling(feeling)}
              />
            ))}
          </View>
        </>
      ) : null}

      {step.id === "evidence" ? (
        <>
          <TextField
            label="What supports the thought?"
            placeholder="I missed my second set of squats."
            value={record.evidenceFor}
            onChangeText={(evidenceFor) => update({ evidenceFor })}
            multiline
          />
          <TextField
            label="What doesn't fit it?"
            placeholder="I've added 10 kg in eight weeks. I slept five hours last night."
            value={record.evidenceAgainst}
            onChangeText={(evidenceAgainst) => update({ evidenceAgainst })}
            multiline
          />
        </>
      ) : null}

      {step.id === "balanced" ? (
        <>
          <TextField
            placeholder={step.placeholder}
            value={record.balanced}
            onChangeText={(balanced) => update({ balanced })}
            multiline
            autoFocus
          />
          <Stepper
            label="How strongly you believe the original thought now"
            value={record.beliefAfter}
            min={0}
            max={100}
            step={10}
            format={percent}
            onChange={(beliefAfter) => update({ beliefAfter })}
          />
          {record.beliefAfter < record.beliefBefore ? (
            <Card tone="accent" style={styles.gapSm}>
              <AppText variant="bodyStrong" color="accentStrong">
                Belief down {record.beliefBefore - record.beliefAfter} points
              </AppText>
              <AppText variant="small" color="textMuted">
                {"That’s the reframe working. Come back to it whenever the thought returns."}
              </AppText>
            </Card>
          ) : null}
        </>
      ) : null}

      <AppText variant="caption" color="textMuted" align="center">
        A CBT-inspired self-help exercise — not a substitute for professional support.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gapSm: { gap: spacing.sm },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  footer: { flexDirection: "row", gap: spacing.sm },
  flex: { flex: 1, alignSelf: "stretch" },
  flexWide: { flex: 2, alignSelf: "stretch" },
});
