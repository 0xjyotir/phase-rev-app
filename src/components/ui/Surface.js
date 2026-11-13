/**
 * Surface — the material every card, button and floating bar is made of.
 *
 *   iOS 26+   → native Liquid Glass (expo-glass-effect GlassView). The glass picks
 *               up the ambient light field behind it, adapts to light/dark, and
 *               (when `interactive`) shimmers under the finger like system controls.
 *   elsewhere → an opaque, platform-appropriate surface with a hairline edge.
 *
 *   <Surface style={{ padding: 20 }}>…</Surface>
 *   <Surface variant="clear" interactive radius={999}>…</Surface>   // glass button
 *   <Surface tint={colors.accent}>…</Surface>                       // tinted glass
 *
 * Props:
 *   variant      "regular" (default) | "clear" (more see-through, for media)
 *   tint         optional tint color for the glass / fill color for the fallback
 *   interactive  glass reacts to touch (buttons, toggles)
 *   radius       corner radius (continuous on iOS)
 *   solid        force the opaque fallback (e.g. inside another glass surface)
 */
import { GlassView } from "expo-glass-effect";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { radius as radii } from "@/theme";

export function Surface({
  children,
  variant = "regular",
  tint,
  interactive = false,
  radius = radii.xl,
  solid = false,
  style,
  ...viewProps
}) {
  const theme = useTheme();
  const shape = { borderRadius: radius, borderCurve: "continuous" };

  if (theme.glass && !solid) {
    return (
      <GlassView
        glassEffectStyle={variant}
        tintColor={tint}
        isInteractive={interactive}
        style={[shape, style]}
        {...viewProps}
      >
        {children}
      </GlassView>
    );
  }

  const { colors, isDark } = theme;
  return (
    <View
      style={[
        shape,
        styles.solid,
        {
          backgroundColor: tint ?? (variant === "clear" ? colors.surfaceSoft : colors.surface),
          borderColor: isDark ? colors.border : "transparent",
        },
        !tint && variant !== "clear" && theme.shadow,
        style,
      ]}
      {...viewProps}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  solid: { borderWidth: StyleSheet.hairlineWidth },
});
