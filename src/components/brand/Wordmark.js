/**
 * Wordmark — the two-tone "PHASE REV" logotype.
 *
 * Matches the website navbar: Oswald, uppercase, "REV" in cyan (#00BCD4),
 * optional mono tagline underneath ("REWORK, REBUILD, RECHARGE").
 *
 *   <Wordmark size="lg" showTagline />
 *   <Wordmark size="sm" tone="adaptive" />  // follows light/dark theme
 */
import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { siteMeta } from "@/constants/brand";
import { useTheme } from "@/providers/ThemeProvider";
import { fonts, palette, spacing } from "@/theme";

const SIZES = { sm: 18, md: 24, lg: 36, xl: 52 };

export function Wordmark({ size = "md", showTagline = false, tone = "light", align = "left" }) {
  const { colors } = useTheme();
  const fontSize = SIZES[size] ?? SIZES.md;
  const firstColor = tone === "adaptive" ? colors.text : palette.navText;

  return (
    <View
      style={[styles.wrapper, align === "center" && styles.center]}
      accessibilityLabel={siteMeta.name}
    >
      <AppText
        style={[styles.mark, { fontSize, lineHeight: fontSize * 1.15, color: firstColor }]}
        accessibilityRole="header"
      >
        {siteMeta.wordmark.first.toUpperCase()}{" "}
        <AppText style={[styles.mark, { fontSize, color: palette.cyan }]}>
          {siteMeta.wordmark.second.toUpperCase()}
        </AppText>
      </AppText>
      {showTagline ? (
        <AppText variant="eyebrow" color={tone === "adaptive" ? "textMuted" : palette.navMuted}>
          {siteMeta.tagline}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  center: { alignItems: "center" },
  mark: { fontFamily: fonts.display, letterSpacing: 1 },
});
