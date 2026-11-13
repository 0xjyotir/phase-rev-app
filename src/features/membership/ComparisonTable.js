/**
 * ComparisonTable — feature × tier matrix (web: FeatureComparisonSection).
 * `true` → check, `false` → dash, string → the qualifier ("Monthly").
 */
import { StyleSheet, View } from "react-native";
import { AppText, Card, Divider, Icon } from "@/components/ui";
import { featureComparison, membershipTiers } from "@/constants/membership";
import { useTheme } from "@/providers/ThemeProvider";
import { spacing } from "@/theme";

export function ComparisonTable() {
  const { colors } = useTheme();

  return (
    <Card padding="none">
      <View style={[styles.row, styles.headerRow]}>
        <AppText variant="captionStrong" color="textMuted" style={styles.featureCol}>
          Feature
        </AppText>
        {membershipTiers.map((tier) => (
          <AppText
            key={tier.id}
            variant="captionStrong"
            color={tier.highlighted ? "accentStrong" : "textMuted"}
            style={styles.tierCol}
          >
            {tier.name}
          </AppText>
        ))}
      </View>
      {featureComparison.map((row) => (
        <View key={row.feature}>
          <Divider />
          <View style={styles.row}>
            <AppText variant="small" style={styles.featureCol}>
              {row.feature}
            </AppText>
            {membershipTiers.map((tier) => {
              const value = row[tier.id];
              return (
                <View
                  key={tier.id}
                  style={[
                    styles.tierCol,
                    styles.cell,
                    tier.highlighted && { backgroundColor: colors.accentSoft },
                  ]}
                >
                  {value === true ? (
                    <Icon name="check" size={16} color="accent" />
                  ) : value === false ? (
                    <AppText variant="small" color="textMuted">
                      —
                    </AppText>
                  ) : (
                    <AppText variant="captionStrong">{value}</AppText>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md },
  headerRow: { paddingVertical: spacing.md },
  featureCol: { flex: 1.6, paddingVertical: spacing.md, paddingRight: spacing.sm },
  tierCol: { flex: 1, textAlign: "center" },
  cell: { alignItems: "center", justifyContent: "center", alignSelf: "stretch" },
});
