/**
 * AppText — the only Text component screens should use.
 *
 *   <AppText variant="h2">Session complete</AppText>
 *   <AppText variant="small" color="textMuted">57 min · 5 exercises</AppText>
 *   <AppText variant="metric" color="accentStrong" tabular>02:30</AppText>
 *
 * Props:
 *   variant  — key of `textVariants` (theme/typography.js). Default "body".
 *   color    — key of theme colors ("text", "textMuted", "accent"…) or a raw color.
 *   align    — "left" | "center" | "right"
 *   tabular  — monospaced digits so counters don't jitter
 *
 * Text scales with the system text size (Dynamic Type / Android font scale),
 * capped at 1.6× so dense layouts (set rows, timers) stay intact.
 */
import { Text } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";

export function AppText({
  variant = "body",
  color = "text",
  align,
  tabular = false,
  style,
  children,
  maxFontSizeMultiplier = 1.6,
  ...rest
}) {
  const theme = useTheme();
  const resolvedColor = theme.colors[color] ?? color;

  return (
    <Text
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[
        theme.text[variant] ?? theme.text.body,
        { color: resolvedColor },
        align && { textAlign: align },
        tabular && { fontVariant: ["tabular-nums"] },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
