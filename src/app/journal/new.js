/**
 * New journal entry (sheet) — guided prompts.
 * Params: ?set=daily|evening|training  (defaults to a free entry with one prompt)
 */
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText, Button, Chip, Screen, TextField } from "@/components/ui";
import { journalPrompts, journalPromptSets } from "@/constants/mental";
import { useProfile } from "@/hooks/useProfile";
import { haptics } from "@/lib/haptics";
import { spacing } from "@/theme";

const FREE = "free";

export default function NewJournalEntryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { actions } = useProfile();
  const [setId, setSetId] = useState(journalPromptSets[params.set] ? params.set : FREE);
  const [texts, setTexts] = useState({});

  const prompts = useMemo(() => {
    if (setId === FREE) return [journalPrompts[new Date().getDate() % journalPrompts.length]];
    return journalPromptSets[setId].prompts;
  }, [setId]);

  const answers = prompts
    .map((prompt) => ({ prompt, text: (texts[prompt] ?? "").trim() }))
    .filter((answer) => answer.text.length > 0);

  const save = () => {
    actions.addJournalEntry({
      title: setId === FREE ? "Journal" : journalPromptSets[setId].title,
      answers,
    });
    haptics.success();
    router.back();
  };

  return (
    <Screen
      variant="modal"
      title="New entry"
      keyboardAware
      headerActions={[
        { label: "Save", prominent: true, disabled: answers.length === 0, onPress: save },
      ]}
    >
      <View style={styles.sets}>
        <Chip label="Free" size="md" selected={setId === FREE} onPress={() => setSetId(FREE)} />
        {Object.entries(journalPromptSets).map(([id, set]) => (
          <Chip
            key={id}
            label={set.title}
            size="md"
            selected={setId === id}
            onPress={() => setSetId(id)}
          />
        ))}
      </View>

      {prompts.map((prompt) => (
        <TextField
          key={prompt}
          label={prompt}
          placeholder="Write freely — a sentence is enough…"
          value={texts[prompt] ?? ""}
          onChangeText={(text) => setTexts((current) => ({ ...current, [prompt]: text }))}
          multiline
        />
      ))}

      <Button
        label="Save entry"
        icon="check"
        size="lg"
        fullWidth
        disabled={!answers.length}
        onPress={save}
      />
      <AppText variant="caption" color="textMuted" align="center">
        Entries stay private on this device.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sets: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
});
