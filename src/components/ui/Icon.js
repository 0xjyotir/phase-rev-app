/**
 * Icon — one name, the right glyph on every platform.
 *
 *   iOS            → SF Symbols (expo-symbols), so icons match the system UI,
 *                    scale with the text and render with Apple's optical weights
 *   Android / web  → Feather (the closest match to the website's lucide icons)
 *
 * Names are the app's own keys (mostly Feather names, e.g. "droplet", "zap"),
 * mapped in ./icon-map.json — every SF Symbol there is validated against the
 * official symbol list.
 *
 *   <Icon name="droplet" color="accent" size={18} />
 *   <Icon name="heart-fill" color="danger" />
 */
import Feather from "@expo/vector-icons/Feather";
import { SymbolView } from "expo-symbols";
import { IS_IOS } from "@/lib/platform";
import { useTheme } from "@/providers/ThemeProvider";
import ICON_MAP from "./icon-map.json";

/** @typedef {keyof typeof ICON_MAP} IconName */

export function Icon({ name, size = 20, color = "text", weight = "medium", style }) {
  const { colors } = useTheme();
  const tint = colors[color] ?? color;
  const entry = ICON_MAP[name];
  const featherName = entry?.feather ?? name;

  const fallback = <Feather name={featherName} size={size} color={tint} style={style} />;

  if (IS_IOS && entry?.sf) {
    return (
      <SymbolView
        name={entry.sf}
        size={size}
        tintColor={tint}
        weight={weight}
        resizeMode="scaleAspectFit"
        style={[{ width: size, height: size }, style]}
        fallback={fallback}
      />
    );
  }

  return fallback;
}
