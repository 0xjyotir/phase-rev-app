/**
 * Style helpers.
 */
import { StyleSheet } from "react-native";

const OUTER_KEYS = new Set([
  "flex",
  "flexGrow",
  "flexShrink",
  "flexBasis",
  "alignSelf",
  "width",
  "minWidth",
  "maxWidth",
  "margin",
  "marginTop",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "marginHorizontal",
  "marginVertical",
  "position",
  "top",
  "left",
  "right",
  "bottom",
  "zIndex",
]);

/**
 * Splits a style into the part that positions a component in its parent
 * (`outer`: flex, width, margins…) and the part that styles its own box
 * (`inner`: padding, gap, background, flexDirection…).
 *
 * Used by pressable wrappers so `<Card style={{ flex: 1, gap: 8 }} onPress>`
 * keeps both its size in the row and its internal layout.
 */
export function splitLayoutStyle(style) {
  const flat = StyleSheet.flatten(style) ?? {};
  const outer = {};
  const inner = {};
  for (const [key, value] of Object.entries(flat)) {
    if (OUTER_KEYS.has(key)) outer[key] = value;
    else inner[key] = value;
  }
  if (outer.flex != null || outer.width != null || outer.alignSelf === "stretch") {
    inner.flexGrow = inner.flexGrow ?? 1;
  }
  return { outer, inner };
}
