/**
 * Coach profile — full-bleed portrait under a transparent glass navigation
 * bar, positioning, approach, focus, credentials, availability, the official
 * Phase Rev coach flyer, and "Train with …" (session request).
 * Web: CoachProfileModal / CoachProfilesSection.
 */
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AppText,
  Button,
  Card,
  Chip,
  EmptyState,
  Icon,
  Screen,
  SectionHeader,
} from "@/components/ui";
import { getCoachById } from "@/constants/coaches";
import { useMemberLink } from "@/hooks/useMemberLink";
import { useTheme } from "@/providers/ThemeProvider";
import { GUTTER, palette, spacing } from "@/theme";

export default function CoachProfileScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const go = useMemberLink();
  const coach = getCoachById(id);

  if (!coach) {
    return (
      <Screen title="Coach">
        <EmptyState icon="user-x" title="Coach not found" />
      </Screen>
    );
  }

  const firstName = coach.name.split(" ")[0];

  return (
    <Screen
      title=""
      headerTransparent
      headerTint="#FFFFFF"
      padded={false}
      glow={false}
      contentInsetAdjustmentBehavior="never"
      contentStyle={{ paddingTop: 0, paddingBottom: insets.bottom + spacing.huge }}
      gap={0}
    >
      {/* Photo hero is always dark, so keep light status-bar icons on this screen. */}
      <StatusBar style="light" />
      <View style={styles.hero}>
        <Image
          source={coach.portrait}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          contentPosition="top"
          transition={200}
        />
        <LinearGradient
          colors={["rgba(5,5,5,0.45)", "transparent", "rgba(5,5,5,0.55)", colors.background]}
          locations={[0, 0.28, 0.72, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroText}>
          <AppText variant="eyebrow" color={palette.cyan}>
            {coach.pillar} · {coach.role}
          </AppText>
          <AppText variant="hero" color={palette.navText} maxFontSizeMultiplier={1.1}>
            {coach.name.toUpperCase()}
          </AppText>
          <AppText variant="bodyMedium" color={palette.navText}>
            {coach.tagline}
          </AppText>
        </View>
      </View>

      <View style={styles.body}>
        <AppText variant="h3">{coach.positioning}</AppText>
        <AppText variant="body" color="textMuted">
          {coach.bio}
        </AppText>

        <View style={styles.chips}>
          <Chip icon="award" label={coach.highlight} tone="champagne" size="md" />
          <Chip icon="clock" label={coach.experience} size="md" />
        </View>

        <Button
          label={`Train with ${firstName}`}
          icon="calendar"
          size="lg"
          fullWidth
          onPress={() => go(`/coaches/request?coachId=${coach.id}`)}
        />

        <Card style={styles.gapSm}>
          <SectionHeader title="Approach" />
          <AppText variant="body">{coach.approach}</AppText>
        </Card>

        <Card style={styles.gapSm}>
          <SectionHeader title="Focus areas" />
          <View style={styles.chips}>
            {coach.focus.map((item) => (
              <Chip key={item} label={item} tone="accent" size="md" />
            ))}
          </View>
        </Card>

        <Card style={styles.gapSm}>
          <SectionHeader title="Credentials" />
          {coach.credentials.map((credential) => (
            <View key={credential} style={styles.credential}>
              <Icon name="check-circle" size={16} color="accent" />
              <AppText variant="body">{credential}</AppText>
            </View>
          ))}
        </Card>

        <Card tone="accent" style={styles.availability}>
          <Icon name="calendar" size={18} color="accentStrong" />
          <View style={styles.flex}>
            <AppText variant="captionStrong" color="textMuted">
              AVAILABILITY
            </AppText>
            <AppText variant="smallStrong">{coach.availability}</AppText>
          </View>
        </Card>

        {/* The official Phase Rev coach flyer (same artwork as the website). */}
        <Card padding="none">
          <Image
            source={coach.flyer}
            style={styles.flyer}
            contentFit="cover"
            accessibilityLabel={`${coach.name} coach flyer`}
          />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { height: 560, justifyContent: "flex-end" },
  heroText: { paddingHorizontal: GUTTER, paddingBottom: spacing.xl, gap: spacing.xs },
  body: { paddingHorizontal: GUTTER, gap: spacing.xl, paddingTop: spacing.sm },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  gapSm: { gap: spacing.md },
  flyer: { width: "100%", aspectRatio: 2 / 3 },
  credential: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  availability: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  flex: { flex: 1, gap: 2 },
});
