/**
 * SettingsCard — appearance (system / light / dark) and haptics.
 * Writes to preferences-store; ThemeProvider and lib/haptics read from it.
 */
import { StyleSheet, Switch, View } from "react-native";
import { AppText, Card, Divider, ListRow, SectionHeader, SegmentedControl } from "@/components/ui";
import { useTheme } from "@/providers/ThemeProvider";
import { usePreferencesStore } from "@/stores/preferences-store";
import { spacing } from "@/theme";

const APPEARANCE_OPTIONS = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

export function SettingsCard() {
  const { colors } = useTheme();
  const appearance = usePreferencesStore((state) => state.appearance);
  const setAppearance = usePreferencesStore((state) => state.setAppearance);
  const hapticsEnabled = usePreferencesStore((state) => state.hapticsEnabled);
  const setHapticsEnabled = usePreferencesStore((state) => state.setHapticsEnabled);

  return (
    <Card padding="none">
      <View style={styles.section}>
        <SectionHeader title="Appearance" subtitle="Dark mode matches the Phase Rev website" />
        <SegmentedControl
          options={APPEARANCE_OPTIONS}
          value={appearance}
          onChange={setAppearance}
          size="sm"
        />
      </View>
      <Divider />
      <ListRow
        icon="smartphone"
        title="Haptics"
        subtitle="Vibrate on set completion and rest timer end"
        right={
          <Switch
            value={hapticsEnabled}
            onValueChange={setHapticsEnabled}
            trackColor={{ true: colors.accent, false: colors.borderStrong }}
            thumbColor="#FFFFFF"
          />
        }
      />
      <View style={styles.footnote}>
        <AppText variant="caption" color="textMuted">
          Settings are stored on this device.
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  section: { padding: spacing.lg, gap: spacing.md },
  footnote: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
});
