/**
 * Welcome — the first screen for visitors. Mirrors the website homepage hero:
 * looping hero video, "REWORK YOUR BODY. REBUILD YOUR PERFORMANCE. RECHARGE YOUR LIFE."
 *
 * Two ways in, like the website: sign in to Rev, or explore the public
 * ecosystem (pillars, coaches, memberships, the assessment) as a guest.
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeroVideo } from "@/components/brand/HeroVideo";
import { Wordmark } from "@/components/brand/Wordmark";
import { AppText, Button } from "@/components/ui";
import { brandMedia, welcomeHero } from "@/constants/brand";
import { pillars } from "@/constants/pillars";
import { GUTTER, palette, spacing } from "@/theme";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <HeroVideo source={brandMedia.heroVideo}>
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <Wordmark size="md" showTagline />

        <View style={styles.bottom}>
          <AppText variant="eyebrow" color={palette.cyan}>
            {welcomeHero.badge}
          </AppText>

          <View accessibilityRole="header" accessible>
            {welcomeHero.headline.map((line) => (
              <AppText
                key={line.text}
                variant="hero"
                color={line.accent ? palette.cyan : palette.navText}
                style={styles.headlineLine}
                maxFontSizeMultiplier={1.1}
              >
                {line.text}
              </AppText>
            ))}
          </View>

          <AppText variant="small" color={palette.navMuted}>
            {welcomeHero.subheadline}
          </AppText>

          <View style={styles.pillarRow}>
            {pillars.map((pillar) => (
              <View key={pillar.id} style={styles.pillar}>
                <AppText variant="eyebrow" color={palette.cyan}>
                  {pillar.number}
                </AppText>
                <AppText variant="caption" color={palette.navText}>
                  {pillar.shortLabel}
                </AppText>
              </View>
            ))}
          </View>

          <View style={styles.actions}>
            <Button
              label={welcomeHero.primaryCta}
              variant="brand"
              size="lg"
              icon="arrow-right"
              iconPosition="right"
              fullWidth
              onPress={() => router.push("/login")}
            />
            <Button
              label={welcomeHero.secondaryCta}
              variant="outlineLight"
              size="lg"
              fullWidth
              onPress={() => router.push("/discover")}
            />
          </View>

          <View style={styles.metaRow}>
            {welcomeHero.meta.map((item) => (
              <View key={item.label} style={styles.meta}>
                <AppText variant="metricSmall" color={palette.navText} tabular>
                  {item.value}
                </AppText>
                <AppText variant="eyebrow" color={palette.navMuted}>
                  {item.label}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </HeroVideo>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: GUTTER + spacing.xs,
    paddingTop: spacing.lg,
    justifyContent: "space-between",
  },
  bottom: { gap: spacing.lg, paddingBottom: spacing.md },
  headlineLine: { fontSize: 38, lineHeight: 42 },
  pillarRow: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.14)",
    paddingVertical: spacing.md,
  },
  pillar: { flex: 1, gap: spacing.xxs },
  actions: { gap: spacing.sm },
  metaRow: { flexDirection: "row", justifyContent: "space-between" },
  meta: { alignItems: "center", gap: spacing.xxs, flex: 1 },
});
