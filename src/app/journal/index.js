/**
 * Journal — the Mental pillar's guided journaling, newest first.
 * Tap "+" for a new entry (guided prompt sets); long-press an entry to delete.
 */
import { useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { AppText, Button, Card, EmptyState, Screen } from "@/components/ui";
import { journalPromptSets } from "@/constants/mental";
import { useProfile } from "@/hooks/useProfile";
import { formatLongDate, formatTimeOfDay } from "@/lib/dates";
import { haptics } from "@/lib/haptics";
import { spacing } from "@/theme";

export default function JournalScreen() {
  const router = useRouter();
  const { profile, actions } = useProfile();
  const entries = profile.journal.entries;

  const remove = (entry) => {
    haptics.warning();
    Alert.alert("Delete entry?", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => actions.deleteJournalEntry(entry.id) },
    ]);
  };

  return (
    <Screen
      title="Journal"
      largeTitle
      headerActions={[{ label: "New entry", icon: "edit", onPress: () => router.push("/journal/new") }]}
    >
      <View style={styles.sets}>
        {Object.entries(journalPromptSets).map(([id, set]) => (
          <Button
            key={id}
            label={set.title}
            variant="secondary"
            size="sm"
            onPress={() => router.push({ pathname: "/journal/new", params: { set: id } })}
          />
        ))}
      </View>

      {entries.length === 0 ? (
        <EmptyState
          icon="book-open"
          title="Your journal is empty"
          message="A few honest lines a day turn into the clearest picture of how you train and live."
          action={<Button label="Write your first entry" onPress={() => router.push("/journal/new")} />}
        />
      ) : (
        entries.map((entry) => (
          <Pressable
            key={entry.id}
            onLongPress={() => remove(entry)}
            delayLongPress={350}
            accessibilityHint="Long-press to delete"
          >
            <Card style={styles.entry}>
              <View style={styles.entryTop}>
                <AppText variant="title" style={styles.flex}>
                  {entry.title ?? "Journal"}
                </AppText>
                <AppText variant="caption" color="textMuted">
                  {formatTimeOfDay(entry.createdAt)}
                </AppText>
              </View>
              <AppText variant="eyebrow" color="accent">
                {formatLongDate(entry.createdAt)}
              </AppText>
              {(entry.answers ?? []).map((answer) => (
                <View key={answer.prompt} style={styles.answer}>
                  <AppText variant="captionStrong" color="textMuted">
                    {answer.prompt}
                  </AppText>
                  <AppText variant="body">{answer.text}</AppText>
                </View>
              ))}
            </Card>
          </Pressable>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  sets: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  entry: { gap: spacing.md },
  entryTop: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  answer: { gap: 4 },
});
