/**
 * SegmentedControl — switch between 2–4 views.
 *
 *   iOS            → the real UISegmentedControl (picks up Liquid Glass on iOS 26)
 *   Android / web  → the Phase Rev capsule switcher (web: `.phys-tracker-capsule`)
 *
 *   <SegmentedControl
 *     options={[{ id: "today", label: "Today" }, { id: "library", label: "Library" }]}
 *     value={view}
 *     onChange={setView}
 *   />
 */
import NativeSegmentedControl from "@react-native-segmented-control/segmented-control";
import { Pressable, StyleSheet, View } from "react-native";
import { haptics } from "@/lib/haptics";
import { IS_IOS } from "@/lib/platform";
import { useTheme, useThemedStyles } from "@/providers/ThemeProvider";
import { postScriptFonts, radius, spacing } from "@/theme";
import { AppText } from "./AppText";

export function SegmentedControl({ options, value, onChange, size = "md", style }) {
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.id === value),
  );

  if (IS_IOS) {
    return (
      <NativeSegmentedControl
        values={options.map((option) => option.label)}
        selectedIndex={selectedIndex}
        appearance={theme.isDark ? "dark" : "light"}
        fontStyle={{ fontFamily: postScriptFonts.medium, fontSize: size === "sm" ? 13 : 14 }}
        activeFontStyle={{
          fontFamily: postScriptFonts.semibold,
          fontSize: size === "sm" ? 13 : 14,
        }}
        onChange={(event) => {
          const next = options[event.nativeEvent.selectedSegmentIndex];
          if (!next || next.disabled || next.id === value) return;
          haptics.select();
          onChange(next.id);
        }}
        style={[{ height: size === "sm" ? 32 : 36 }, style]}
        accessibilityRole="tablist"
      />
    );
  }

  return (
    <View style={[styles.capsule, style]} accessibilityRole="tablist">
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <Pressable
            key={option.id}
            onPress={() => {
              if (option.disabled || selected) return;
              haptics.select();
              onChange(option.id);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled: option.disabled }}
            style={[
              styles.segment,
              size === "sm" && styles.segmentSmall,
              selected && styles.selected,
              option.disabled && styles.disabled,
            ]}
          >
            <AppText
              variant={size === "sm" ? "captionStrong" : "smallStrong"}
              color={selected ? "text" : "textMuted"}
              numberOfLines={1}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    capsule: {
      flexDirection: "row",
      padding: 3,
      gap: 2,
      borderRadius: radius.pill,
      backgroundColor: theme.colors.surfaceSoft,
    },
    segment: {
      flex: 1,
      minHeight: 34,
      paddingHorizontal: spacing.md,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
    },
    segmentSmall: { minHeight: 30 },
    selected: {
      backgroundColor: theme.isDark ? "rgba(255,255,255,0.14)" : theme.colors.surface,
      ...theme.shadow,
      shadowOpacity: theme.isDark ? 0 : 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: theme.isDark ? 0 : 1,
    },
    disabled: { opacity: 0.4 },
  });
