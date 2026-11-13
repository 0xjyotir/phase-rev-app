/**
 * CoachCard — portrait card for the coach roster (web: CoachFlyerCard).
 * Photo with a dark gradient, name, role and highlight. Tap → /coaches/[id].
 */
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui";
import { palette, radius, spacing } from "@/theme";

export function CoachCard({ coach, style }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/coaches/${coach.id}`)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }, style]}
      accessibilityRole="button"
      accessibilityLabel={`${coach.name}, ${coach.role}`}
    >
      <Image
        source={coach.portrait}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition="top"
        transition={200}
      />
      <LinearGradient
        colors={["transparent", "rgba(5,5,5,0.55)", "rgba(5,5,5,0.95)"]}
        locations={[0.35, 0.65, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.text}>
        <AppText variant="eyebrow" color={palette.cyan}>
          {coach.pillar} · {coach.experience}
        </AppText>
        <AppText variant="display" color={palette.navText} style={styles.name} numberOfLines={2}>
          {coach.name.toUpperCase()}
        </AppText>
        <AppText variant="smallMedium" color={palette.navMuted}>
          {coach.role} · {coach.highlight}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    aspectRatio: 4 / 5,
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: palette.black,
    justifyContent: "flex-end",
  },
  text: { padding: spacing.xl, gap: spacing.xs },
  name: { fontSize: 28, lineHeight: 32 },
});
