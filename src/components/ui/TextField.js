/**
 * TextField — labelled input (web: `.phys-input`, pill shaped).
 *
 *   <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
 *   <TextField label="Weight" suffix="kg" keyboardType="decimal-pad" compact />
 *
 * Props:
 *   label, hint, error   text around the input
 *   suffix               unit shown inside the field ("kg", "cm")
 *   icon                 Feather icon on the left
 *   compact              smaller height for dense tables (set logging)
 */
import { forwardRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useTheme, useThemedStyles } from "@/providers/ThemeProvider";
import { fonts, radius, spacing } from "@/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

export const TextField = forwardRef(function TextField(
  {
    label,
    hint,
    error,
    suffix,
    icon,
    compact = false,
    style,
    inputStyle,
    onFocus,
    onBlur,
    ...inputProps
  },
  ref,
) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      {label ? (
        <AppText variant="caption" color="textMuted" style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <View
        style={[
          styles.field,
          compact && styles.compact,
          focused && { borderColor: colors.accent, backgroundColor: colors.surface },
          error && { borderColor: colors.danger },
        ]}
      >
        {icon ? <Icon name={icon} size={18} color="textMuted" /> : null}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.accent}
          style={[styles.input, compact && styles.inputCompact, inputStyle]}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...inputProps}
        />
        {suffix ? (
          <AppText variant="caption" color="textMuted">
            {suffix}
          </AppText>
        ) : null}
      </View>

      {error ? (
        <AppText variant="caption" color="danger" style={styles.hint}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color="textMuted" style={styles.hint}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
});

const createStyles = (theme) =>
  StyleSheet.create({
    wrapper: { gap: spacing.xs },
    label: { marginLeft: spacing.xs },
    field: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      minHeight: 50,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceSoft,
    },
    compact: { minHeight: 42, paddingHorizontal: spacing.md },
    input: {
      flex: 1,
      minWidth: 0,
      paddingVertical: spacing.sm,
      fontFamily: fonts.medium,
      fontSize: 16,
      color: theme.colors.text,
      // RN Web: remove the default focus outline (we draw our own border)
      outlineStyle: "none",
    },
    inputCompact: { fontFamily: fonts.semibold, fontVariant: ["tabular-nums"] },
    hint: { marginLeft: spacing.xs },
  });
