/**
 * OptionList — single-choice list of cards (goals, activity levels).
 */
import { Pressable, StyleSheet, View } from "react-native";
import { AppText, Icon } from "@/components/ui";
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
            style={[
              styles.option,
              {
                backgroundColor: selected ? colors.accentSoft : colors.surface,
                borderColor: selected ? colors.accent : colors.border,
              },
            ]}
          >
            <View style={styles.text}>
              <AppText variant="bodyStrong" color={selected ? "accentStrong" : "text"}>
                {option.label}
              </AppText>
              <AppText variant="caption" color="textMuted">
                {option.description}
              </AppText>
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
              {selected ? <Icon name="check" size={12} color="onAccent" /> : null}
            </View>
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
    borderRadius: radius.lg,
    borderWidth: 1.5,
  },
  text: { flex: 1, gap: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
