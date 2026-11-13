/**
 * HeaderActions — renders header action descriptors as buttons (Android/web).
 * On iOS the same descriptors become native bar button items instead
 * (see lib/header-items.js); this component is never used there.
 */
import { Pressable, StyleSheet, View } from "react-native";
import { haptics } from "@/lib/haptics";
import { openMenuFallback } from "@/lib/header-items";
import { spacing } from "@/theme";
import { AppText } from "./AppText";
import { IconButton } from "./IconButton";

export function HeaderActions({ actions = [] }) {
  const visible = actions.filter(Boolean);
  if (!visible.length) return null;

  return (
    <View style={styles.row}>
      {visible.map((action, index) => {
        if (action.element) return <View key={`custom-${index}`}>{action.element}</View>;
        const onPress = action.menu ? () => openMenuFallback(action.menu) : action.onPress;
        if (action.icon) {
          return (
            <IconButton
              key={action.label ?? action.icon}
              icon={action.icon}
              variant={action.prominent ? "accent" : "ghost"}
              size={40}
              iconSize={20}
              disabled={action.disabled}
              onPress={onPress}
              accessibilityLabel={action.accessibilityLabel ?? action.label}
            />
          );
        }
        return (
          <Pressable
            key={action.label}
            onPress={() => {
              haptics.tap();
              onPress?.();
            }}
            disabled={action.disabled}
            hitSlop={10}
            accessibilityRole="button"
            style={({ pressed }) => [styles.text, (pressed || action.disabled) && styles.dim]}
          >
            <AppText variant="bodyStrong" color={action.prominent ? "accentStrong" : "text"}>
              {action.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  text: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  dim: { opacity: 0.5 },
});
