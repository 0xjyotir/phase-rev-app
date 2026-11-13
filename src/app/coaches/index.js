/**
 * Coaches — the roster (web: /coaches).
 * Filter by specialty, tap a coach for their full profile.
 */
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { AppText, Card, Chip, Screen, ScreenHeader } from "@/components/ui";
import { coachFilters, coaches, testimonials } from "@/constants/coaches";
import { CoachCard } from "@/features/coaches/CoachCard";
import { spacing } from "@/theme";

export default function CoachesScreen() {
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? coaches : coaches.filter((coach) => coach.category === filter);
  const quote = testimonials[0];

  return (
    <Screen header={<ScreenHeader title="Coaches" />}>
      <View style={styles.header}>
        <AppText variant="eyebrow" color="accent">
          Elite coaches
        </AppText>
        <AppText variant="h1">The right coach changes the way you train.</AppText>
        <AppText variant="body" color="textMuted">
          50+ specialists across strength, athletic performance, nutrition and mental wellness.
        </AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {coachFilters.map((item) => (
          <Chip
            key={item.id}
            label={item.label}
            size="md"
            selected={filter === item.id}
            onPress={() => setFilter(item.id)}
          />
        ))}
      </ScrollView>

      {visible.map((coach) => (
        <CoachCard key={coach.id} coach={coach} />
      ))}

      <Card tone="soft" style={styles.quote}>
        <AppText variant="body">“{quote.quote}”</AppText>
        <AppText variant="caption" color="textMuted">
          {quote.author} · {quote.role}
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm },
  chips: { gap: spacing.sm },
  quote: { gap: spacing.sm },
});
