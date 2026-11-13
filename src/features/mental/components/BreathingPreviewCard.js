/**
 * BreathingPreviewCard — idle breathing ring + pattern picker + Start.
 * Opens the full-screen guided session at /breathing?pattern=<id>.
 */
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card, Chip } from "@/components/ui";
import { breathingPatterns } from "@/constants/mental";
import { spacing } from "@/theme";
import { BreathingCircle } from "./BreathingCircle";

export function BreathingPreviewCard() {
  const router = useRouter();
  const [patternId, setPatternId] = useState(breathingPatterns[0].id);
  const pattern = breathingPatterns.find((p) => p.id === patternId);

  return (
    <Card style={styles.card}>
      <BreathingCircle pattern={pattern} running={false} size={170} />
      <AppText variant="smallStrong" color="accentStrong" align="center">
        {pattern.name} · {pattern.summary}
      </AppText>
      <View style={styles.chips}>
        {breathingPatterns.map((p) => (
          <Chip
            key={p.id}
            label={p.name}
            selected={p.id === patternId}
            onPress={() => setPatternId(p.id)}
          />
        ))}
      </View>
      <AppText variant="small" color="textMuted" align="center">
        {pattern.description}
      </AppText>
      <Button
        label="Start session"
        icon="play"
        fullWidth
        onPress={() => router.push({ pathname: "/breathing", params: { pattern: patternId } })}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "center" },
});
