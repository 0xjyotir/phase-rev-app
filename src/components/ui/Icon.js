/**
 * Icon — Feather icons with theme-aware colors.
 *
 * Feather is the closest built-in match to the web app's lucide-react icons
 * (lucide is a Feather fork), so names mostly line up: "activity", "zap"…
 * Browse names: https://icons.expo.fyi (filter: Feather)
 *
 *   <Icon name="droplet" color="accent" size={18} />
 */
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@/providers/ThemeProvider";

export function Icon({ name, size = 20, color = "text", style }) {
  const { colors } = useTheme();
  return <Feather name={name} size={size} color={colors[color] ?? color} style={style} />;
}
