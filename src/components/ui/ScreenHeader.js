/**
 * ScreenHeader — custom header for stack screens (back · title · action).
 *
 * We draw our own header instead of the native one so every screen keeps the
 * Phase Rev typography and doesn't inherit platform glass/blur defaults.
 *
 *   <ScreenHeader title="Coach profile" />                    // back button on the left
 *   <ScreenHeader title="New routine" leftIcon="x" right={<Button label="Save" size="sm" />} />
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { GUTTER, spacing } from "@/theme";
import { AppText } from "./AppText";
import { IconButton } from "./IconButton";

export function ScreenHeader({
  title,
  subtitle,
  leftIcon = "arrow-left",
  onLeftPress,
  right,
  transparent = false,
}) {
  const router = useRouter();

  const handleBack = () => {
    if (onLeftPress) return onLeftPress();
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  return (
    <View style={styles.row}>
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
  titles: { flex: 1, alignItems: "center" },
  right: { minWidth: 44, alignItems: "flex-end" },
});
