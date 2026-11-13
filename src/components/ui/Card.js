/**
 * Card — the main surface ("phys-panel" / "rounded-3xl" cards on the web).
 *
 *   <Card>…</Card>
 *   <Card active>…</Card>            // cyan ring — live workout / today
 *   <Card tone="soft" padding="md">  // inner tiles (bg surfaceSoft, no border)
 *   <Card onPress={open}>…</Card>    // becomes pressable
 */
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";

const PADDING = { none: 0, sm: spacing.md, md: spacing.lg, lg: spacing.xl };

export function Card({
  children,
  tone = "surface",
  padding = "lg",
  active = false,
  onPress,
  style,
  accessibilityLabel,
}) {
  const theme = useTheme();
  const { colors } = theme;

  const surfaceStyle = [
    styles.base,
    { padding: PADDING[padding] },
    tone === "surface" && [
      { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
      theme.shadow,
    ],
    tone === "soft" && { backgroundColor: colors.surfaceSoft, borderRadius: radius.md },
    tone === "accent" && { backgroundColor: colors.accentSoft },
    tone === "inverse" && { backgroundColor: colors.surfaceInverse },
    active && { borderColor: colors.accent, borderWidth: 1.5 },
    style,
  ];

  if (!onPress) return <View style={surfaceStyle}>{children}</View>;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [surfaceStyle, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.xl, overflow: "hidden" },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
});
