/**
 * Divider — hairline separator using the theme border color.
 *
 *   <Divider />                 full width
 *   <Divider inset={spacing.lg} />  indented (list rows)
 */
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";

export function Divider({ inset = 0, style }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.line, { backgroundColor: colors.border, marginLeft: inset }, style]} />
  );
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, alignSelf: "stretch" },
});
