/**
 * TextField — labelled input.
 *
 *   <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
 *   <TextField label="Weight" suffix="kg" keyboardType="decimal-pad" compact />
 *   <TextField icon="search" placeholder="Search" variant="search" />
 *
 * Props:
 *   label, hint, error   text around the input
 *   suffix               unit shown inside the field ("kg", "cm")
 *   icon                 leading icon
 *   compact              shorter field for dense rows
 *   variant              "default" | "search" (iOS search-field look: rounded, filled)
 *   clearable            show a clear button while there's text
 */
import { forwardRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { IS_IOS } from "@/lib/platform";
import { useTheme, useThemedStyles } from "@/providers/ThemeProvider";
import { fonts, radius, spacing } from "@/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";
import { Surface } from "./Surface";

export const TextField = forwardRef(function TextField(
  {
    label,
    hint,
    error,
    suffix,
    icon,
    compact = false,
    variant = "default",
    clearable = false,
    multiline = false,
    style,
    inputStyle,
    onFocus,
    onBlur,
    value,
    onChangeText,
    ...inputProps
  },
  ref,
) {
  const { colors, isDark, glass } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [focused, setFocused] = useState(false);
  const isSearch = variant === "search";
  // iOS 26 search fields are Liquid Glass capsules, like the system search bar.
  const glassSearch = isSearch && glass;
  const Field = glassSearch ? Surface : View;

  return (
    <View style={[styles.wrapper, style]}>
      {label ? (
        <AppText variant="captionStrong" color="textMuted" style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <Field
        {...(glassSearch ? { radius: radius.pill } : null)}
        style={[
          styles.field,
          isSearch && styles.search,
          glassSearch && styles.searchGlass,
          compact && styles.compact,
          multiline && styles.multiline,
          focused && !isSearch && { borderColor: colors.accent },
          error && { borderColor: colors.danger },
        ]}
      >
        {icon ? <Icon name={icon} size={isSearch ? 15 : 17} color="textMuted" /> : null}
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          placeholderTextColor={colors.textTertiary}
          selectionColor={colors.accent}
          cursorColor={colors.accent}
          keyboardAppearance={isDark ? "dark" : "light"}
          clearButtonMode={IS_IOS && (clearable || isSearch) ? "while-editing" : "never"}
          style={[
            styles.input,
            compact && styles.inputCompact,
            multiline && styles.inputMultiline,
            inputStyle,
          ]}
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
        {!IS_IOS && (clearable || isSearch) && value ? (
          <Pressable onPress={() => onChangeText?.("")} hitSlop={10} accessibilityLabel="Clear">
            <Icon name="x-circle" size={16} color="textMuted" />
          </Pressable>
        ) : null}
        {suffix ? (
          <AppText variant="small" color="textMuted">
            {suffix}
          </AppText>
        ) : null}
      </Field>

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
    wrapper: { gap: spacing.xs + 2 },
    label: { marginLeft: spacing.xs },
    field: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      minHeight: 50,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.md,
      borderCurve: "continuous",
      borderWidth: 1,
      borderColor: "transparent",
      backgroundColor: theme.colors.surfaceSoft,
    },
    search: { minHeight: 40, borderRadius: radius.sm, paddingHorizontal: spacing.md },
    searchGlass: { minHeight: 44, borderRadius: radius.pill, backgroundColor: "transparent" },
    compact: { minHeight: 42, paddingHorizontal: spacing.md },
    multiline: { alignItems: "flex-start", paddingVertical: spacing.md },
    input: {
      flex: 1,
      minWidth: 0,
      paddingVertical: spacing.sm,
      fontFamily: fonts.regular,
      fontSize: IS_IOS ? 17 : 16,
      color: theme.colors.text,
      // RN Web: remove the default focus outline (we draw our own border)
      outlineStyle: "none",
    },
    inputCompact: { fontFamily: fonts.semibold, fontVariant: ["tabular-nums"] },
    inputMultiline: { minHeight: 84, textAlignVertical: "top", paddingVertical: 0 },
    hint: { marginLeft: spacing.xs },
  });
