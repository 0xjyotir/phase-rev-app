/**
 * NumberCell — numeric input for set logging (kg, reps, seconds, RIR).
 *
 * Keeps its own text while typing (so "82." isn't swallowed) and commits a
 * number to the store when the value is complete or the field loses focus.
 * If the store value changes from outside (e.g. ticking a set fills defaults),
 * the cell updates — unless the user is currently typing in it.
 */
import { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { fonts, radius, spacing } from "@/theme";

const COMPLETE_NUMBER = /^\d+(\.\d+)?$/;

function toText(value) {
  return value == null ? "" : String(value);
}

function parse(text) {
  const normalized = text.replace(",", ".").trim();
  if (!normalized) return undefined;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : undefined;
}

export function NumberCell({
  value,
  placeholder,
  onCommit,
  decimal = true,
  completed = false,
  accessibilityLabel,
  style,
}) {
  const { colors } = useTheme();
  const [text, setText] = useState(toText(value));
  const [focused, setFocused] = useState(false);
  const lastCommitted = useRef(value);

  useEffect(() => {
    if (!focused && value !== lastCommitted.current) {
      setText(toText(value));
      lastCommitted.current = value;
    }
  }, [value, focused]);

  const commit = (nextText) => {
    const number = parse(nextText);
    lastCommitted.current = number;
    onCommit(number);
  };

  return (
    <TextInput
      value={text}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      keyboardType={decimal ? "decimal-pad" : "number-pad"}
      returnKeyType="done"
      selectTextOnFocus
      accessibilityLabel={accessibilityLabel}
      onFocus={() => setFocused(true)}
      onChangeText={(nextText) => {
        setText(nextText);
        if (COMPLETE_NUMBER.test(nextText.replace(",", ".")) || nextText === "") commit(nextText);
      }}
      onBlur={() => {
        setFocused(false);
        commit(text);
      }}
      style={[
        styles.input,
        {
          color: colors.text,
          backgroundColor: completed ? colors.surface : colors.surfaceSoft,
          borderColor: focused ? colors.accent : colors.border,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 44,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    textAlign: "center",
    fontFamily: fonts.semibold,
    fontSize: 16,
    fontVariant: ["tabular-nums"],
    outlineStyle: "none",
  },
});
