/**
 * useFirstFocus — true once the screen has been focused at least once.
 *
 * Native tabs mount every tab at launch. Tabs with heavy content (the Fuel
 * globe, the Explore video) use this to build their content the first time the
 * member actually opens them, and keep it mounted afterwards.
 */
import { useIsFocused } from "expo-router";
import { useState } from "react";

export function useFirstFocus() {
  const isFocused = useIsFocused();
  const [seen, setSeen] = useState(isFocused);
  if (isFocused && !seen) setSeen(true); // render-time update — no extra effect pass
  return seen;
}
