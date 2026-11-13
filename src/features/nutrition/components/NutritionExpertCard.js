/**
 * NutritionExpertCard — "Backed by certified nutritionists" (web: NutritionExpertSection).
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, Avatar, Button, Card, Chip } from "@/components/ui";
import { nutritionExpert } from "@/constants/nutrition";
import { formatNumber } from "@/lib/format";
import { spacing } from "@/theme";

export function NutritionExpertCard() {
  const router = useRouter();
  return (
    <Card style={styles.card}>
      <AppText variant="eyebrow" color="champagne">
        Expert guidance
      </AppText>
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
      <Button
        label="Book a consultation"
        variant="secondary"
        onPress={() => router.push("/coaches")}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  flex: { flex: 1, gap: 2 },
  chips: { flexDirection: "row", gap: spacing.xs, flexWrap: "wrap" },
});
