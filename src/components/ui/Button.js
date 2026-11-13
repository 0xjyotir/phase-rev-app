/**
 * Button — pill-shaped, like the web `.phys-btn`.
 *
 *   <Button label="Start workout" icon="play" onPress={start} />
 *   <Button label="Change plan" variant="ghost" />
 *   <Button label="Finish" variant="primary" size="lg" fullWidth loading={saving} />
 *
 * Variants (rev-app.css):
 *   primary   — cyan fill            (.phys-btn-primary)
 *   secondary — surface + border     (.phys-btn-secondary)
 *   ghost     — text only            (.phys-btn-ghost)
 *   danger    — red text on soft red
 *   brand     — marketing teal/cyan on dark (Welcome screen)
 */
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { haptics } from "@/lib/haptics";
import { useTheme, useThemedStyles } from "@/providers/ThemeProvider";
import { HIT_SIZE, palette, radius, spacing } from "@/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth = false,
  disabled = false,
  loading = false,
  style,
  accessibilityLabel,
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const tone = getTone(variant, colors);
  const isDisabled = disabled || loading;

  const handlePress = () => {
    haptics.tap();
    onPress?.();
  };

  const iconNode = icon ? (
    <Icon name={icon} size={size === "lg" ? 20 : 18} color={tone.fg} />
  ) : null;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        size === "lg" && styles.large,
        size === "sm" && styles.small,
        { backgroundColor: tone.bg, borderColor: tone.border },
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={tone.fg} />
      ) : (
        <View style={styles.row}>
          {iconPosition === "left" && iconNode}
          {label ? (
            <AppText variant={size === "sm" ? "smallStrong" : "bodyStrong"} color={tone.fg}>
              {label}
            </AppText>
          ) : null}
          {iconPosition === "right" && iconNode}
        </View>
      )}
    </Pressable>
  );
}

function getTone(variant, colors) {
  switch (variant) {
    case "secondary":
      return { bg: colors.surface, fg: colors.text, border: colors.border };
    case "ghost":
      return { bg: "transparent", fg: colors.textMuted, border: "transparent" };
    case "soft":
      return { bg: colors.accentSoft, fg: colors.accentStrong, border: "transparent" };
    case "danger":
      return { bg: colors.dangerSoft, fg: colors.danger, border: "transparent" };
    case "brand":
      return { bg: palette.cyanLight, fg: palette.cyanInk, border: "transparent" };
    case "outlineLight":
      return {
        bg: "rgba(255,255,255,0.06)",
        fg: palette.navText,
        border: "rgba(255,255,255,0.18)",
      };
    case "primary":
    default:
      return { bg: colors.accent, fg: colors.onAccent, border: "transparent" };
  }
}

const createStyles = () =>
  StyleSheet.create({
    base: {
      minHeight: HIT_SIZE,
      paddingHorizontal: spacing.xl,
      borderRadius: radius.pill,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-start",
    },
    large: { minHeight: 54, paddingHorizontal: spacing.xxl },
    small: { minHeight: 36, paddingHorizontal: spacing.lg },
    fullWidth: { alignSelf: "stretch" },
    row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    disabled: { opacity: 0.45 },
  });
