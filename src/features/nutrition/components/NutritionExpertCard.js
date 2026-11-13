/**
 * NutritionExpertCard — "Backed by certified nutritionists" (web: NutritionExpertSection):
 * the lead nutritionist, credentials, practice stats and a member testimonial.
 *
 *   compact   hide the stats + testimonial (used on the Fuel tab)
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, Avatar, Button, Card, Chip, Icon, StatRow, StatTile } from "@/components/ui";
import { nutritionExpert } from "@/constants/nutrition";
import { useMember } from "@/hooks/useMember";
import { formatNumber } from "@/lib/format";
import { spacing } from "@/theme";

export function NutritionExpertCard({ compact = false }) {
  const router = useRouter();
  const { isSignedIn } = useMember();

  return (
    <Card style={styles.card}>
      <View style={styles.titles}>
        <AppText variant="eyebrow" color="champagne">
          {nutritionExpert.eyebrow}
        </AppText>
        <AppText variant="title">{nutritionExpert.title}</AppText>
        {!compact ? (
          <AppText variant="small" color="textMuted">
            {nutritionExpert.subtitle}
          </AppText>
        ) : null}
      </View>

      <View style={styles.row}>
        <Avatar name={nutritionExpert.name} size={56} />
        <View style={styles.flex}>
          <AppText variant="bodyStrong">{nutritionExpert.name}</AppText>
          <AppText variant="caption" color="textMuted">
            {nutritionExpert.role} · {formatNumber(nutritionExpert.sessions)} sessions · ★{" "}
            {nutritionExpert.rating}
          </AppText>
        </View>
      </View>
      <AppText variant="small" color="textMuted">
        {nutritionExpert.bio}
      </AppText>
      <View style={styles.chips}>
        {nutritionExpert.credentials.map((credential) => (
          <Chip key={credential} label={credential} tone="champagne" />
        ))}
      </View>

      {!compact ? (
        <>
          <StatRow>
            {nutritionExpert.stats.map((stat) => (
              <StatTile key={stat.label} label={stat.label} value={stat.value} tone="soft" />
            ))}
          </StatRow>
          <Card tone="soft" style={styles.quote}>
            <Icon name="quote" size={16} color="champagne" />
            <AppText variant="body">“{nutritionExpert.testimonial.quote}”</AppText>
            <AppText variant="caption" color="textMuted">
              {nutritionExpert.testimonial.author} · {nutritionExpert.testimonial.role}
            </AppText>
          </Card>
        </>
      ) : null}

      <Button
        label="Book a consultation"
        icon="calendar"
        variant="secondary"
        fullWidth
        onPress={() => router.push(isSignedIn ? "/coaches/request?topic=nutrition" : "/login")}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  titles: { gap: spacing.xs },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  flex: { flex: 1, gap: 2 },
  chips: { flexDirection: "row", gap: spacing.xs, flexWrap: "wrap" },
  quote: { gap: spacing.sm },
});
