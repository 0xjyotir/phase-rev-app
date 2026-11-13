/**
 * Card — the main content surface.
 *
 *   <Card>…</Card>                    // solid content surface (all platforms)
 *   <Card glass>…</Card>              // Liquid Glass on iOS 26+ — only for cards that
 *                                     // float over content (e.g. the rest-timer dock)
 *   <Card active>…</Card>             // cyan ring — live workout / today / recommended
 *   <Card tone="soft" padding="md">   // inner tile (translucent fill, never glass)
 *   <Card tone="accent">              // cyan-tinted tile
 *   <Card onPress={open}>…</Card>     // pressable, with a subtle press-in
 *
 * Apple's iOS 26 guidance: Liquid Glass belongs to the controls and navigation
 * layer that floats above content (nav bar, tab bar, buttons, chips, floating
 * docks) — not to the content itself. So cards are solid by default, like the
 * grouped cards in Fitness and Health, and every control on them is glass.
 * Use tone="soft" for tiles inside a card.
 */
import { Pressable, StyleSheet, View } from "react-native";
import { haptics } from "@/lib/haptics";
import { splitLayoutStyle } from "@/lib/style";
import { useTheme } from "@/providers/ThemeProvider";
import { CARD_PADDING, radius } from "@/theme";
import { Surface } from "./Surface";

const PADDING = { none: 0, sm: 12, md: 16, lg: CARD_PADDING };

export function Card({
  children,
  tone = "surface",
  padding = "lg",
  active = false,
  glass = false,
  onPress,
  style,
  accessibilityLabel,
  accessibilityHint,
}) {
  const { colors } = useTheme();
  const { outer, inner } = onPress ? splitLayoutStyle(style) : { outer: null, inner: style };
  const pad = { padding: PADDING[padding] };
  const cornerRadius = tone === "surface" ? radius.xl : tone === "accent" ? radius.lg : radius.md;

  const ring = active ? (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        styles.ring,
        { borderColor: colors.accent, borderRadius: cornerRadius },
      ]}
    />
  ) : null;

  let body;
  if (tone === "surface") {
    body = (
      <Surface solid={!glass} radius={cornerRadius} style={[styles.surface, pad, inner]}>
        {children}
        {ring}
      </Surface>
    );
  } else {
    const fill = {
      soft: colors.surfaceSoft,
      accent: colors.accentSoft,
      champagne: colors.champagneSoft,
      inverse: colors.surfaceInverse,
    }[tone];
    body = (
      <View
        style={[
          styles.tile,
          pad,
          { borderRadius: cornerRadius, backgroundColor: fill ?? colors.surfaceSoft },
          inner,
        ]}
      >
        {children}
        {ring}
      </View>
    );
  }

  if (!onPress) return body;

  return (
    <Pressable
      onPress={() => {
        haptics.tap();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [outer, pressed && styles.pressed]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  surface: { overflow: "hidden" },
  tile: { borderCurve: "continuous", overflow: "hidden" },
  ring: { borderWidth: 1.5, borderCurve: "continuous" },
  pressed: { opacity: 0.9, transform: [{ scale: 0.985 }] },
});
