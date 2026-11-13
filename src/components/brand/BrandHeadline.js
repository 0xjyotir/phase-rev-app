/**
 * BrandHeadline — the website's uppercase Oswald headline voice.
 *
 *   <BrandHeadline lines={["YOUR BODY DOESN'T", "EXIST IN SILOS."]} />
 *   <BrandHeadline lines={[{ text: "GYM.", accent: false }, { text: "CALISTHENICS.", accent: true }]} />
 *   <BrandHeadline lines={…} size="lg" onMedia />   // white text over photos/video
 *
 * Lines may be strings or { text, accent } objects; accent lines render in Rev cyan.
 * The last line is accented automatically when `accentLast` is set.
 */
import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { palette } from "@/theme";

const SIZES = { sm: [22, 26], md: [30, 34], lg: [38, 42] };

export function BrandHeadline({
  lines,
  size = "md",
  onMedia = false,
  accentLast = false,
  align = "left",
  style,
}) {
  const { colors, isDark } = useTheme();
  const [fontSize, lineHeight] = SIZES[size] ?? SIZES.md;
  const base = onMedia ? palette.navText : colors.text;
  const accent = onMedia || isDark ? palette.cyan : colors.accentStrong;

  return (
    <View style={style} accessible accessibilityRole="header">
      {lines.map((line, index) => {
        const text = typeof line === "string" ? line : line.text;
        const isAccent =
          (typeof line === "object" && line.accent) || (accentLast && index === lines.length - 1);
        return (
          <AppText
            key={`${text}-${index}`}
            variant="display"
            color={isAccent ? accent : base}
            align={align}
            maxFontSizeMultiplier={1.15}
            style={[styles.line, { fontSize, lineHeight }]}
          >
            {text}
          </AppText>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  line: { textTransform: "uppercase" },
});
