/**
 * Athletic Performance pillar page sections.
 * Web: /athletic-performance (SportsCardsSection, AthleticFeaturesSection,
 * CoachesGridSection "Sport coaches", FinalCtaSection).
 *
 * In the app the "Beyond physical training" features are real tools:
 * performance psychology and visualization run guided sessions, and
 * reaction training is a tap drill that keeps your history.
 */
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card, Carousel, Icon } from "@/components/ui";
import { getCoachesByPillar } from "@/constants/coaches";
import { athleticFeatures, athleticSports } from "@/constants/pillars";
import { CoachCard } from "@/features/coaches/CoachCard";
import { useMemberLink } from "@/hooks/useMemberLink";
import { useProfile } from "@/hooks/useProfile";
import { formatRelativeDay } from "@/lib/dates";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";
import { SectionIntro } from "./PillarParts";

export function AthleticPillar({ onSportsLayout }) {
  const go = useMemberLink();
  const { colors } = useTheme();
  const { profile, isMember } = useProfile();
  const lastReaction = profile.athletic.reactionResults[0];
  const sportCoaches = getCoachesByPillar("athletic");

  return (
    <>
      <View onLayout={onSportsLayout}>
        <SectionIntro
          eyebrow="Sports"
          headline={["SPORT-SPECIFIC", "PROGRAMS."]}
          body="Tailored conditioning for the sports you compete in."
        />
      </View>
      {athleticSports.map((sport) => (
        <Card key={sport.id} style={styles.sport}>
          <View style={styles.sportTop}>
            <View style={[styles.sportIcon, { backgroundColor: colors.accentSoft }]}>
              <Icon name={sport.icon} size={22} color="accent" />
            </View>
            <View style={styles.flex}>
              <AppText variant="h3">{sport.title}</AppText>
              <AppText variant="small" color="textMuted">
                {sport.tagline}
              </AppText>
            </View>
          </View>
          <AppText variant="captionStrong" color="textMuted">
            INCLUDES
          </AppText>
          <View style={styles.gapSm}>
            {sport.features.map((feature) => (
              <View key={feature} style={styles.point}>
                <Icon name="check" size={12} color="accent" weight="bold" />
                <AppText variant="smallMedium">{feature}</AppText>
              </View>
            ))}
          </View>
        </Card>
      ))}

      <SectionIntro
        eyebrow={athleticFeatures.eyebrow}
        headline={["BEYOND PHYSICAL", "TRAINING."]}
        body={athleticFeatures.subtitle}
      />
      {athleticFeatures.items.map((feature, index) => (
        <Card key={feature.id} style={styles.feature}>
          <View style={styles.featureTop}>
            <View style={[styles.featureIcon, { borderColor: colors.borderStrong }]}>
              <Icon name={feature.icon} size={18} color="textMuted" />
            </View>
            <AppText variant="eyebrow" color="textTertiary">
              {String(index + 1).padStart(2, "0")}
            </AppText>
          </View>
          <AppText variant="title">{feature.title}</AppText>
          <AppText variant="small" color="textMuted">
            {feature.description}
          </AppText>
          {feature.id === "reaction" && lastReaction && isMember ? (
            <Card tone="soft" padding="md" style={styles.result}>
              <Icon name="zap" size={14} color="accent" />
              <AppText variant="caption" color="textMuted" style={styles.flex}>
                Last round {formatRelativeDay(lastReaction.createdAt).toLowerCase()}: average{" "}
                <AppText variant="captionStrong">{lastReaction.average} ms</AppText> · best{" "}
                {lastReaction.best} ms
              </AppText>
            </Card>
          ) : null}
          <Button
            label={feature.action.label}
            variant="soft"
            icon={feature.id === "reaction" ? "zap" : "play"}
            onPress={() => go(feature.action.href)}
          />
        </Card>
      ))}

      <SectionIntro
        eyebrow="Coaches"
        headline={["SPORT", "COACHES."]}
        body="S&C and performance coaching built around how athletes actually train."
      />
      <Carousel
        data={sportCoaches}
        itemWidth={230}
        renderItem={(coach) => <CoachCard coach={coach} size="sm" />}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  gapSm: { gap: spacing.sm },
  sport: { gap: spacing.md },
  sportTop: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  sportIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  point: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  feature: { gap: spacing.md },
  featureTop: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  result: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
});
