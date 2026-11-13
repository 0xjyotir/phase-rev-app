/**
 * Ecosystem — "Four pillars. One complete journey."
 * Web equivalent: /ecosystem (PillarHeroSection + EcosystemMapSection + FinalCtaSection)
 * plus the homepage's interactive "Four dimensions. One human." explorer.
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { BrandHeadline } from "@/components/brand/BrandHeadline";
import { AppText, Button, Card, Chip, Icon, Screen, SectionHeader } from "@/components/ui";
import { ecosystemPage, pillars } from "@/constants/pillars";
import { DimensionsCard } from "@/features/explore/ExploreFeed";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";

export default function EcosystemScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <Screen title="Ecosystem">
      <View style={styles.hero}>
        <AppText variant="eyebrow" color="accent">
          {ecosystemPage.eyebrow}
        </AppText>
        <BrandHeadline lines={ecosystemPage.headline} size="lg" accentLast />
        <AppText variant="body" color="textMuted">
          {ecosystemPage.subheadline}
        </AppText>
      </View>

      <DimensionsCard />

      <Card tone="accent" style={styles.connects}>
        <Icon name="rotate" size={20} color="accentStrong" />
        <View style={styles.flex}>
          <AppText variant="bodyStrong">{ecosystemPage.connects.title}</AppText>
          <AppText variant="small" color="textMuted">
            {ecosystemPage.connects.body}
          </AppText>
        </View>
      </Card>

      <SectionHeader
        size="lg"
        eyebrow="Four pillars"
        title={ecosystemPage.pillarsTitle}
        subtitle={ecosystemPage.pillarsSubtitle}
      />

      {pillars.map((pillar) => (
        <Card key={pillar.id} style={styles.pillar}>
          <View style={styles.pillarTop}>
            <View style={[styles.number, { borderColor: colors.borderStrong }]}>
              <AppText variant="eyebrow" color="textMuted">
                {pillar.number}
              </AppText>
            </View>
            <View style={[styles.line, { backgroundColor: colors.separator }]} />
            <Icon name={pillar.icon} size={20} color="accent" />
          </View>
          <View style={styles.gapXs}>
            <AppText variant="h2">{pillar.label}</AppText>
            <AppText variant="smallStrong">{pillar.tagline}</AppText>
          </View>
          <AppText variant="small" color="textMuted">
            {pillar.description}
          </AppText>
          <View style={styles.chips}>
            {pillar.items.slice(0, 5).map((item) => (
              <Chip key={item} label={item} />
            ))}
          </View>
          <Button
            label="Explore pillar"
            variant="secondary"
            icon="arrow-up-right"
            iconPosition="right"
            onPress={() => router.push(`/pillar/${pillar.id}`)}
          />
        </Card>
      ))}

      <AppText variant="small" color="textMuted" align="center" style={styles.unified}>
        {ecosystemPage.unified}
      </AppText>

      <Card style={styles.final}>
        <BrandHeadline lines={ecosystemPage.finalCta.headline} size="md" accentLast />
        <AppText variant="small" color="textMuted">
          {ecosystemPage.finalCta.body}
        </AppText>
        <Button
          label={ecosystemPage.finalCta.primaryCta}
          fullWidth
          onPress={() => router.push("/assessment")}
        />
        <Button
          label={ecosystemPage.finalCta.secondaryCta}
          variant="secondary"
          fullWidth
          onPress={() => router.push("/membership")}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  gapXs: { gap: spacing.xs },
  hero: { gap: spacing.md, paddingTop: spacing.sm },
  connects: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start" },
  pillar: { gap: spacing.md },
  pillarTop: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  number: {
    width: 36,
    height: 36,
    borderRadius: radius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  line: { flex: 1, height: StyleSheet.hairlineWidth },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  unified: { paddingHorizontal: spacing.xl },
  final: { gap: spacing.md },
});
