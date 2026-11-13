/**
 * ProgressPhotosCard — monthly photo slots (placeholders, same as the web build).
 * Photo capture/upload is a planned follow-up (expo-image-picker + storage API).
 */
import { StyleSheet, View } from "react-native";
import { AppText, Card, Icon, SectionHeader } from "@/components/ui";
import { formatShortDate } from "@/lib/dates";
import { useTheme } from "@/providers/ThemeProvider";
import { useTrainingStore } from "@/stores/training-store";
import { radius, spacing } from "@/theme";

export function ProgressPhotosCard() {
  const { colors } = useTheme();
  const photos = useTrainingStore((state) => state.photos);

  return (
    <Card style={styles.card}>
      <SectionHeader title="Progress photos" subtitle="Monthly check-ins · coming soon" />
      <View style={styles.row}>
        {photos.map((photo) => (
          <View key={photo.id} style={styles.slotWrapper}>
            <View
              style={[
                styles.slot,
                { backgroundColor: colors.surfaceSoft, borderColor: colors.borderStrong },
              ]}
            >
              <Icon name="camera" size={20} color="textMuted" />
              <AppText variant="caption" color="textMuted">
                {photo.angle}
              </AppText>
            </View>
            <AppText variant="caption" color="textMuted" align="center">
              {formatShortDate(photo.date)}
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  row: { flexDirection: "row", gap: spacing.sm },
  slotWrapper: { flex: 1, gap: spacing.xs },
  slot: {
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
});
