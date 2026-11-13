/**
 * CoachCard — portrait card for the roster and carousels (web: CoachFlyerCard).
 * Photo, cinematic gradient, name, role and highlight. Tap → /coaches/[id].
 *
 *   <CoachCard coach={coach} />            // roster (4:5)
 *   <CoachCard coach={coach} size="sm" />  // carousels (3:4, smaller type)
 */
import { useRouter } from "expo-router";
import { MediaCard } from "@/components/brand/MediaCard";
import { AppText } from "@/components/ui";
import { palette, spacing } from "@/theme";

export function CoachCard({ coach, size = "lg", style }) {
  const router = useRouter();
  const small = size === "sm";

  return (
    <MediaCard
      image={coach.portrait}
      aspectRatio={small ? 3 / 4 : 4 / 5}
      padding={small ? spacing.lg : spacing.xl}
      gap={spacing.xs}
      onPress={() => router.push(`/coaches/${coach.id}`)}
      accessibilityLabel={`${coach.name}, ${coach.role}`}
      style={style}
    >
      <AppText variant="eyebrow" color={palette.cyan} numberOfLines={1}>
        {coach.pillar} · {coach.experience}
      </AppText>
      <AppText
        variant="display"
        color={palette.navText}
        numberOfLines={2}
        maxFontSizeMultiplier={1.15}
        style={small ? { fontSize: 22, lineHeight: 25 } : { fontSize: 30, lineHeight: 33 }}
      >
        {coach.name.toUpperCase()}
      </AppText>
      <AppText variant={small ? "caption" : "smallMedium"} color={palette.navMuted} numberOfLines={2}>
        {coach.role} · {coach.highlight}
      </AppText>
    </MediaCard>
  );
}
