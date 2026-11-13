/**
 * Coach profile — portrait hero, positioning, approach, focus, credentials,
 * and the official coach flyer.
 * Web: CoachProfileModal / CoachProfilesSection.
 */
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AppText,
  Button,
  Card,
  Chip,
  Dialog,
  EmptyState,
  Icon,
  Screen,
  ScreenHeader,
  SectionHeader,
} from "@/components/ui";
import { getCoachById } from "@/constants/coaches";
import { useTheme } from "@/providers/ThemeProvider";
import { GUTTER, palette, spacing } from "@/theme";

export default function CoachProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const coach = getCoachById(id);
  const [requested, setRequested] = useState(false);

  if (!coach) {
    return (
      <Screen header={<ScreenHeader title="Coach" />}>
        <EmptyState icon="user-x" title="Coach not found" />
      </Screen>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Photo hero is always dark, so keep light status-bar icons on this screen. */}
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            source={coach.portrait}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            contentPosition="top"
          />
          <LinearGradient
            colors={["rgba(5,5,5,0.35)", "transparent", "rgba(5,5,5,0.6)", colors.background]}
            locations={[0, 0.3, 0.75, 1]}
            style={StyleSheet.absoluteFill}
          />
          <SafeAreaView edges={["top"]}>
            <ScreenHeader transparent />
          </SafeAreaView>
          <View style={styles.heroText}>
            <AppText variant="eyebrow" color={palette.cyan}>
              {coach.pillar} · {coach.role}
            </AppText>
            <AppText variant="hero" color={palette.navText}>
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

          {/* The official Phase Rev coach flyer (same artwork as the website). */}
          <Card padding="none">
            <Image
              source={coach.flyer}
              style={styles.flyer}
              contentFit="cover"
              accessibilityLabel={`${coach.name} coach flyer`}
            />
          </Card>

          <Card tone="soft" style={styles.availability}>
            <Icon name="calendar" size={18} color="accent" />
            <AppText variant="smallMedium" style={styles.flex}>
              {coach.availability}
            </AppText>
          </Card>

          <Button
            label={`Train with ${coach.name.split(" ")[0]}`}
            size="lg"
            fullWidth
            onPress={() => setRequested(true)}
          />
        </View>
      </ScrollView>

      <Dialog
        visible={requested}
        title="Request sent"
        message={`${coach.name.split(" ")[0]}'s team will reach out to schedule your first session. Live booking arrives with the next release.`}
        confirmLabel="Got it"
        hideCancel
        onConfirm={() => {
          setRequested(false);
          router.back();
        }}
        onCancel={() => setRequested(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: spacing.huge },
  hero: { height: 520, justifyContent: "space-between" },
  heroText: { paddingHorizontal: GUTTER, paddingBottom: spacing.lg, gap: spacing.xs },
  body: { paddingHorizontal: GUTTER, gap: spacing.lg },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  gapSm: { gap: spacing.md },
  flyer: { width: "100%", aspectRatio: 2 / 3 },
  credential: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  availability: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  flex: { flex: 1 },
});
