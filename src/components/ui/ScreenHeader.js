/**
 * ScreenHeader — an in-content header for "bare" screens that draw their own
 * chrome (brand screens over video, focus modes). Everything else uses the
 * native navigation bar through <Screen title=…>.
 *
 *   <ScreenHeader leftIcon="x" title="Box breathing" subtitle="4 · 4 · 4 · 4" />
 *   <ScreenHeader transparent />            // glass back button over media
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { GUTTER, spacing } from "@/theme";
import { AppText } from "./AppText";
import { IconButton } from "./IconButton";

export function ScreenHeader({
  title,
  subtitle,
  leftIcon = "chevron-left",
  onLeftPress,
  right,
  transparent = false,
  padded = true,
}) {
  const router = useRouter();

  const handleBack = () => {
    if (onLeftPress) return onLeftPress();
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  return (
    <View style={[styles.row, !padded && styles.flush]}>
      <IconButton
        icon={leftIcon}
        onPress={handleBack}
        variant={transparent ? "glass" : "surface"}
        accessibilityLabel={leftIcon === "x" ? "Close" : "Go back"}
      />
      <View style={styles.titles}>
        {title ? (
          <AppText
            variant="title"
            numberOfLines={1}
            align="center"
            color={transparent ? "#FFFFFF" : "text"}
          >
            {title}
          </AppText>
        ) : null}
        {subtitle ? (
          <AppText variant="caption" color="textMuted" numberOfLines={1} align="center">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: GUTTER,
    paddingVertical: spacing.sm,
  },
  flush: { paddingHorizontal: 0 },
  titles: { flex: 1, alignItems: "center" },
  right: { minWidth: 44, alignItems: "flex-end" },
});
