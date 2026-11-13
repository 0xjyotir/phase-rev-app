/**
 * DemoAccountCard — shows the demo credentials with a one-tap "Use demo account".
 * Same helper as the website login (FRONTEND_BACKEND_INTEGRATION.md §13).
 *
 * Remove when real accounts exist.
 */
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card, Icon } from "@/components/ui";
import { DEMO_CREDENTIALS } from "@/constants/demo-account";
import { spacing } from "@/theme";

export function DemoAccountCard({ onUse }) {
  return (
    <Card tone="soft" padding="lg" style={styles.card}>
      <View style={styles.header}>
        <Icon name="key" size={16} color="champagne" />
        <AppText variant="eyebrow" color="champagne">
          Demo member
        </AppText>
      </View>
      <AppText variant="small" color="textMuted">
        Explore the full member experience with sample training, nutrition and mood data.
      </AppText>
      <View style={styles.credentials}>
        <AppText variant="smallMedium" selectable>
          {DEMO_CREDENTIALS.email}
        </AppText>
        <AppText variant="smallMedium" color="textMuted" selectable>
          {DEMO_CREDENTIALS.password}
        </AppText>
      </View>
      <Button
        label="Use demo account"
        variant="secondary"
        size="sm"
        onPress={() => onUse(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password)}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  credentials: { gap: 2, marginVertical: spacing.xs },
});
