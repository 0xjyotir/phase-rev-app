/**
 * SegmentedControl — the capsule tab switcher (web: `.phys-tracker-capsule`).
 *
 *   <SegmentedControl
 *     options={[{ id: "today", label: "Today" }, { id: "library", label: "Library" }]}
 *     value={view}
 *     onChange={setView}
 *   />
 *
 * Options can be disabled: { id, label, disabled: true } (e.g. locked mid-workout).
 */
import { Pressable, StyleSheet, View } from "react-native";
import { haptics } from "@/lib/haptics";
import { useTheme, useThemedStyles } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";
import { AppText } from "./AppText";

export function SegmentedControl({ options, value, onChange, size = "md", style }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

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
              selected && { backgroundColor: colors.accentSoft },
              option.disabled && styles.disabled,
            ]}
          >
            <AppText
              variant={size === "sm" ? "smallStrong" : "bodyStrong"}
              color={selected ? "accentStrong" : "textMuted"}
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
      padding: spacing.xs,
      gap: spacing.xs,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      ...theme.shadow,
    },
    segment: {
      flex: 1,
      minHeight: 40,
      paddingHorizontal: spacing.md,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
    },
    segmentSmall: { minHeight: 34 },
    disabled: { opacity: 0.4 },
  });
