/**
 * Avatar — photo if provided, otherwise initials on a soft cyan circle.
 *
 *   <Avatar name="Alex Rivera" size={56} />
 *   <Avatar source={coach.portrait} name={coach.name} />
 */
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { getInitials } from "@/lib/format";
import { useTheme } from "@/providers/ThemeProvider";
import { AppText } from "./AppText";

export function Avatar({ name, source, size = 44, style }) {
  const { colors } = useTheme();
  const shape = { width: size, height: size, borderRadius: size / 2 };

  if (source) {
    return (
      <Image
        source={source}
        style={[shape, style]}
        contentFit="cover"
        contentPosition="top"
        accessibilityLabel={name}
      />
    );
  }

  return (
    <View
      style={[styles.fallback, shape, { backgroundColor: colors.accentSoft }, style]}
      accessibilityLabel={name}
    >
      <AppText
        variant={size >= 56 ? "h3" : size >= 36 ? "smallStrong" : "captionStrong"}
        color="accentStrong"
        maxFontSizeMultiplier={1}
      >
        {getInitials(name)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: "center", justifyContent: "center" },
});
