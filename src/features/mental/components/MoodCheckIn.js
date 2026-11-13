/**
 * MoodCheckIn — "How are you today?" (web: MoodTrackerSection).
 * One mood per day, optional note. Saved via useProfile().actions.setMood.
 */
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText, Button, Card, Icon, SectionHeader, TextField } from "@/components/ui";
import { getMoodById, journalPrompts, moods } from "@/constants/mental";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";

export function MoodCheckIn({ todayEntry, onSave }) {
  const { colors } = useTheme();
  const [note, setNote] = useState(todayEntry?.note ?? "");
  const selected = todayEntry?.moodId ?? null;
  const prompt = journalPrompts[new Date().getDate() % journalPrompts.length];

  const select = (moodId) => {
    haptics.select();
    onSave(moodId, note || undefined);
  };

  return (
    <Card style={styles.card}>
      <SectionHeader
        title="How are you today?"
        subtitle="Daily check-ins surface patterns in your wellbeing"
      />
      <View style={styles.moods}>
        {moods.map((mood) => {
          const active = selected === mood.id;
          return (
            <Pressable
              key={mood.id}
              onPress={() => select(mood.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={mood.label}
              style={[
                styles.mood,
                {
                  backgroundColor: active ? colors.accentSoft : colors.surfaceSoft,
                  borderColor: active ? colors.accent : "transparent",
                },
              ]}
            >
              <Icon name={mood.icon} size={22} color={active ? "accentStrong" : "textMuted"} />
              <AppText variant="caption" color={active ? "accentStrong" : "textMuted"}>
                {mood.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {selected ? (
        <View style={styles.after}>
          <AppText variant="small" color="textMuted">
            Logged as <AppText variant="smallStrong">{getMoodById(selected)?.label}</AppText>.
            Consistency builds insight over time.
          </AppText>
          <TextField
            label={prompt}
            placeholder="A sentence is enough…"
            value={note}
            onChangeText={setNote}
            multiline
          />
          <Button
            label="Save note"
            variant="secondary"
            size="sm"
            disabled={!note.trim() || note === todayEntry?.note}
            onPress={() => {
              onSave(selected, note.trim());
              haptics.success();
            }}
          />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  moods: { flexDirection: "row", gap: spacing.xs },
  mood: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  after: { gap: spacing.md },
});
