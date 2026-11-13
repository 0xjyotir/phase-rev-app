/**
 * Divider — hairline separator.
 *
 *   <Divider />                     full width
 *   <Divider inset={58} />          indented past a row's icon (list rows)
 */
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";

export function Divider({ inset = 0, style }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.line, { backgroundColor: colors.separator, marginLeft: inset }, style]} />
  );
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, alignSelf: "stretch" },
});
