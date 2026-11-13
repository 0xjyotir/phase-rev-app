/**
 * TierCard — one membership tier (web: PricingPreviewSection glass tiers).
 * The highlighted tier (Performance) gets the cyan ring + "Recommended".
 */
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card, Chip, Icon } from "@/components/ui";
import { spacing } from "@/theme";

export function TierCard({ tier, isCurrent, onSelect, highlightLabel = "Most selected" }) {
  return (
    <Card active={tier.highlighted} style={styles.card}>
      <View style={styles.header}>
        <AppText variant="h3" style={styles.flex}>
          {tier.name}
        </AppText>
        {isCurrent ? (
          <Chip label="Your plan" tone="success" />
        ) : tier.highlighted ? (
          <Chip label={highlightLabel} tone="accent" />
        ) : null}
      </View>
      <View style={styles.priceRow}>
        <AppText variant="metricLarge" tabular>
          ${tier.price}
        </AppText>
        <AppText variant="small" color="textMuted">
          / {tier.period}
        </AppText>
      </View>
      <AppText variant="small" color="textMuted">
        {tier.description}
      </AppText>
      <View style={styles.features}>
        {tier.features.map((feature) => (
          <View key={feature} style={styles.feature}>
            <Icon name="check-circle" size={16} color="accent" />
            <AppText variant="small" style={styles.flex}>
              {feature}
            </AppText>
          </View>
        ))}
      </View>
      <Button
        label={isCurrent ? "Current plan" : tier.cta}
        variant={tier.highlighted ? "primary" : "secondary"}
        fullWidth
        disabled={isCurrent}
        onPress={() => onSelect(tier)}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  flex: { flex: 1 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: spacing.xs },
  features: { gap: spacing.sm },
  feature: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
});
