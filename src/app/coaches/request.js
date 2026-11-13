/**
 * Session request (sheet) — "Train with Selva", "Book a consultation".
 * Params: ?coachId=<id>  or  ?topic=nutrition (the nutrition team).
 *
 * The website books coaching through Performance / Elite memberships; until
 * live booking exists, the request is saved to the member's profile (Profile →
 * Session requests) and the coach's team follows up.
 */
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import {
  AppText,
  Avatar,
  Button,
  Card,
  Icon,
  ListRow,
  ListSection,
  Screen,
  TextField,
} from "@/components/ui";
import { coachingFormats, coachingTimes, getCoachById } from "@/constants/coaches";
import { nutritionExpert } from "@/constants/nutrition";
import { OptionList } from "@/features/assessment/components/OptionList";
import { useProfile } from "@/hooks/useProfile";
import { haptics } from "@/lib/haptics";
import { spacing } from "@/theme";

export default function CoachRequestScreen() {
  const router = useRouter();
  const { coachId, topic } = useLocalSearchParams();
  const { actions } = useProfile();
  const coach = getCoachById(coachId);
  const isNutrition = !coach && topic === "nutrition";

  const [format, setFormat] = useState(coachingFormats[1].id);
  const [time, setTime] = useState(coachingTimes[0].id);
  const [note, setNote] = useState("");

  const who = coach ? coach.name : isNutrition ? nutritionExpert.name : "the Phase Rev team";
  const firstName = coach ? coach.name.split(" ")[0] : isNutrition ? "the nutrition team" : "our team";

  const send = () => {
    actions.requestCoach({
      coachId: coach?.id ?? null,
      topic: isNutrition ? "nutrition" : (coach?.category ?? "general"),
      format,
      time,
      note: note.trim() || undefined,
    });
    haptics.success();
    Alert.alert(
      "Request sent",
      `${firstName.charAt(0).toUpperCase()}${firstName.slice(1)} will reach out within a day to schedule your first session. You'll find it under Profile → Session requests.`,
      [{ text: "Done", onPress: () => router.back() }],
    );
  };

  return (
    <Screen
      variant="modal"
      title={isNutrition ? "Book a consultation" : "Request a session"}
      keyboardAware
      footer={<Button label="Send request" icon="check" size="lg" fullWidth onPress={send} />}
    >
      <Card style={styles.who}>
        <Avatar source={coach?.portrait} name={who} size={56} />
        <View style={styles.flex}>
          <AppText variant="title">{who}</AppText>
          <AppText variant="caption" color="textMuted">
            {coach ? `${coach.role} · ${coach.availability}` : isNutrition ? `${nutritionExpert.role} · ${nutritionExpert.credentials.join(" · ")}` : "We'll match you with the right specialist"}
          </AppText>
        </View>
      </Card>

      <View style={styles.gapSm}>
        <AppText variant="captionStrong" color="textMuted" style={styles.label}>
          FORMAT
        </AppText>
        <OptionList
          options={coachingFormats}
          value={format}
          onChange={setFormat}
        />
      </View>

      <ListSection header="Preferred time">
        {coachingTimes.map((item) => (
          <ListRow
            key={item.id}
            icon={item.id === "morning" ? "sun" : item.id === "evening" ? "moon" : "clock"}
            iconTint={item.id === "evening" ? "#5E5CE6" : item.id === "morning" ? "#FF9F0A" : undefined}
            title={item.label}
            right={time === item.id ? <Icon name="check" size={16} color="accent" weight="bold" /> : <View />}
            onPress={() => setTime(item.id)}
          />
        ))}
      </ListSection>

      <TextField
        label="What would you like to work on?"
        placeholder="e.g. My squat stalls at 110 kg and my knees ache after leg day."
        value={note}
        onChangeText={setNote}
        multiline
      />

      <AppText variant="caption" color="textMuted" align="center">
        Coaching sessions are included with Performance (monthly) and Elite (weekly) memberships.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  who: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  flex: { flex: 1, gap: 2 },
  gapSm: { gap: spacing.sm },
  label: { marginLeft: spacing.lg },
});
