/**
 * OptionList — single-choice list of cards (goals, activity levels, formats).
 * Glass cards on iOS 26; the selected option is tinted cyan with a check.
 */
import { Pressable, StyleSheet, View } from "react-native";
import { AppText, Icon, Surface } from "@/components/ui";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";

export function OptionList({ options, value, onChange }) {
  const { colors } = useTheme();

  return (
    <View style={styles.list} accessibilityRole="radiogroup">
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <Pressable
            key={option.id}
            onPress={() => {
              haptics.select();
              onChange(option.id);
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${option.label}. ${option.description ?? ""}`}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Surface
              solid
              radius={radius.lg}
              tint={selected ? colors.accentSoft : undefined}
              style={styles.option}
            >
              <View style={styles.text}>
                <AppText variant="bodyStrong" color={selected ? "accentStrong" : "text"}>
                  {option.label}
                </AppText>
                {option.description ? (
                  <AppText variant="caption" color="textMuted">
                    {option.description}
                  </AppText>
                ) : null}
              </View>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: selected ? colors.accent : colors.borderStrong,
                    backgroundColor: selected ? colors.accent : "transparent",
                  },
                ]}
              >
                {selected ? <Icon name="check" size={12} color="onAccent" weight="bold" /> : null}
              </View>
              {selected ? (
                <View
                  pointerEvents="none"
                  style={[StyleSheet.absoluteFill, styles.ring, { borderColor: colors.accent }]}
                />
              ) : null}
            </Surface>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
  },
  ring: { borderRadius: radius.lg, borderWidth: 1.5, borderCurve: "continuous" },
  text: { flex: 1, gap: 2 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
});
