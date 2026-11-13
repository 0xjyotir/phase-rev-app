/**
 * ExploreFeed — the website's homepage story, told natively.
 * Shared by the Explore tab (members) and /discover (guests).
 *
 * Web: phaserev/src/sections/home/* in the same order —
 *   hero → method → pillars → one system → ecosystem → coaches →
 *   membership → community → stories → final CTA
 */
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { BrandHeadline } from "@/components/brand/BrandHeadline";
import { MediaCard } from "@/components/brand/MediaCard";
import {
  AppText,
  Button,
  Card,
  Carousel,
  Chip,
  Icon,
  SectionHeader,
  SegmentedControl,
} from "@/components/ui";
import {
  brandMedia,
  brandMethod,
  coachingTeaser,
  community,
  ecosystemDimensions,
  finalCta,
  heroStats,
  membershipTeaser,
  oneSystem,
  storiesCopy,
  welcomeHero,
} from "@/constants/brand";
import { coaches, testimonials } from "@/constants/coaches";
import { membershipTiers } from "@/constants/membership";
import { pillars } from "@/constants/pillars";
import { CoachCard } from "@/features/coaches/CoachCard";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/providers/ThemeProvider";
import { palette, radius, spacing } from "@/theme";

export function ExploreFeed({ isGuest = false }) {
  const router = useRouter();

  return (
    <>
      <HeroCard isGuest={isGuest} />
      <StatsRow />
      <MethodCard />

      <SectionHeader
        size="lg"
        eyebrow="The pillars"
        title="Four pillars, one membership"
        subtitle="Tap a pillar to see its programs, tools and coaches"
      />
      <PillarGrid />

      <OneSystemCard />

      <SectionHeader
        size="lg"
        eyebrow={ecosystemDimensions.eyebrow}
        title="Four dimensions. One human."
      />
      <DimensionsCard />

      <SectionHeader
        size="lg"
        eyebrow={coachingTeaser.eyebrow}
        title="The right coach changes the way you train"
        subtitle={coachingTeaser.body}
        actionLabel="All coaches"
        onActionPress={() => router.push("/coaches")}
      />
      <Carousel
        data={coaches}
        itemWidth={230}
        renderItem={(coach) => <CoachCard coach={coach} size="sm" />}
      />

      <SectionHeader
        size="lg"
        eyebrow={membershipTeaser.eyebrow}
        title="Choose your level of support"
        actionLabel="Compare"
        onActionPress={() => router.push("/membership")}
      />
      <MembershipTeaser />

      <CommunityCard />

      <SectionHeader size="lg" eyebrow={storiesCopy.eyebrow} title="Members, in their words" />
      <Carousel
        paging
        dots
        data={testimonials}
        renderItem={(story) => <StoryCard story={story} />}
      />

      <FinalCtaCard />
    </>
  );
}

function HeroCard({ isGuest }) {
  const router = useRouter();
  return (
    <MediaCard video={brandMedia.heroVideo} aspectRatio={4 / 5} gradient="full" gap={spacing.lg}>
      <AppText variant="eyebrow" color={palette.cyan}>
        {welcomeHero.badge}
      </AppText>
      <BrandHeadline lines={welcomeHero.headline} size="sm" onMedia />
      <AppText variant="small" color={palette.navMuted}>
        {welcomeHero.subheadline}
      </AppText>
      <View style={styles.heroActions}>
        <Button
          label="Start your assessment"
          variant="brand"
          icon="arrow-right"
          iconPosition="right"
          fullWidth
          onPress={() => router.push("/assessment")}
        />
        <Button
          label={isGuest ? "Sign in to Rev" : "Explore the ecosystem"}
          variant="outlineLight"
          fullWidth
          onPress={() => router.push(isGuest ? "/login" : "/ecosystem")}
        />
      </View>
    </MediaCard>
  );
}

function StatsRow() {
  return (
    <Card padding="md">
      <View style={styles.statsRow}>
        {heroStats.map((stat, index) => (
          <View key={stat.label} style={[styles.stat, index > 0 && styles.statDivider]}>
            <AppText variant="metricSmall" color="accentStrong" tabular>
              {stat.value}
            </AppText>
            <AppText variant="micro" color="textMuted" align="center" numberOfLines={2}>
              {stat.label}
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}

function MethodCard() {
  const router = useRouter();
  return (
    <Card style={styles.gapLg}>
      <AppText variant="eyebrow" color="accent">
        {brandMethod.eyebrow}
      </AppText>
      <BrandHeadline lines={brandMethod.headline} size="md" accentLast />
      <View style={styles.gapXs}>
        {brandMethod.lines.map((line, index) => (
          <AppText
            key={line}
            variant={index === brandMethod.lines.length - 1 ? "bodyStrong" : "body"}
            color={index === brandMethod.lines.length - 1 ? "text" : "textMuted"}
          >
            {line}
          </AppText>
        ))}
      </View>
      <AppText variant="small" color="textMuted">
        {brandMethod.explanation}
      </AppText>
      <View style={styles.wordRow}>
        {brandMethod.pillars.map((word) => (
          <AppText key={word} variant="eyebrow" color="textTertiary">
            {word}
          </AppText>
        ))}
      </View>
      <Button
        label={brandMethod.cta}
        variant="secondary"
        icon="arrow-right"
        iconPosition="right"
        onPress={() => router.push("/ecosystem")}
      />
    </Card>
  );
}

export function PillarGrid() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View style={styles.grid}>
      {pillars.map((pillar) => (
        <Card
          key={pillar.id}
          padding="md"
          style={styles.pillarTile}
          onPress={() => router.push(`/pillar/${pillar.id}`)}
          accessibilityLabel={`${pillar.label}. ${pillar.tagline}`}
        >
          <View style={styles.pillarTop}>
            <View style={[styles.pillarIcon, { backgroundColor: colors.accentSoft }]}>
              <Icon name={pillar.icon} size={18} color="accent" />
            </View>
            <AppText variant="eyebrow" color="textTertiary">
              {pillar.number}
            </AppText>
          </View>
          <AppText variant="bodyStrong" numberOfLines={2}>
            {pillar.label}
          </AppText>
          <AppText variant="caption" color="textMuted" numberOfLines={3}>
            {pillar.tagline}
          </AppText>
        </Card>
      ))}
    </View>
  );
}

function OneSystemCard() {
  const { colors } = useTheme();
  return (
    <Card style={styles.gapLg}>
      <BrandHeadline lines={oneSystem.headline} size="sm" accentLast />
      <View style={styles.flow}>
        {oneSystem.steps.map((step, index) => (
          <View key={step.id} style={styles.flowItem}>
            <View style={[styles.flowIcon, { backgroundColor: colors.accentSoft }]}>
              <Icon name={step.icon} size={16} color="accent" />
            </View>
            <AppText variant="micro" color="text" align="center">
              {step.label}
            </AppText>
            {index < oneSystem.steps.length - 1 ? (
              <View style={[styles.flowConnector, { backgroundColor: colors.borderStrong }]} />
            ) : null}
          </View>
        ))}
      </View>
    </Card>
  );
}

const DIMENSION_OPTIONS = ecosystemDimensions.pillars.map((pillar) => ({
  id: pillar.id,
  label: pillar.label,
}));

export function DimensionsCard() {
  const router = useRouter();
  const [activeId, setActiveId] = useState(ecosystemDimensions.pillars[0].id);
  const active =
    ecosystemDimensions.pillars.find((pillar) => pillar.id === activeId) ??
    ecosystemDimensions.pillars[0];

  return (
    <View style={styles.gapMd}>
      <SegmentedControl options={DIMENSION_OPTIONS} value={activeId} onChange={setActiveId} />
      <MediaCard
        image={active.image}
        aspectRatio={4 / 3}
        onPress={() => router.push(`/pillar/${active.id}`)}
        accessibilityLabel={`${active.label}: ${active.tagline}`}
        gap={spacing.sm}
      >
        <View style={styles.athleteBadge}>
          <AppText variant="eyebrow" color={palette.navText}>
            {ecosystemDimensions.centerLabel}
          </AppText>
        </View>
        <AppText variant="brandTitle" color={palette.navText}>
          {active.label.toUpperCase()}
        </AppText>
        <AppText variant="smallMedium" color={palette.navMuted}>
          {active.tagline}
        </AppText>
        <View style={styles.inlineLink}>
          <AppText variant="smallStrong" color={palette.cyan}>
            Explore {active.label.toLowerCase()}
          </AppText>
          <Icon name="arrow-right" size={13} color={palette.cyan} weight="bold" />
        </View>
      </MediaCard>
      <AppText variant="caption" color="textMuted" align="center">
        {ecosystemDimensions.intro}
      </AppText>
    </View>
  );
}

function MembershipTeaser() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <Card padding="none">
      {membershipTiers.map((tier, index) => (
        <Pressable
          key={tier.id}
          onPress={() => {
            haptics.tap();
            router.push("/membership");
          }}
          style={({ pressed }) => [
            styles.tierRow,
            index > 0 && {
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: colors.separator,
            },
            pressed && { backgroundColor: colors.surfaceStrong },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`${tier.name}, $${tier.price} per ${tier.period}`}
        >
          <View style={styles.flex}>
            <View style={styles.tierTitle}>
              <AppText variant="bodyStrong">{tier.name}</AppText>
              {tier.highlighted ? (
                <Chip label={membershipTeaser.highlightLabel} tone="accent" />
              ) : null}
            </View>
            <AppText variant="caption" color="textMuted" numberOfLines={2}>
              {tier.description}
            </AppText>
          </View>
          <View style={styles.price}>
            <AppText variant="metricSmall" tabular>
              ${tier.price}
            </AppText>
            <AppText variant="caption" color="textMuted">
              /{tier.period}
            </AppText>
          </View>
        </Pressable>
      ))}
    </Card>
  );
}

function CommunityCard() {
  const router = useRouter();
  return (
    <MediaCard
      image={community.image}
      imagePosition="center"
      height={420}
      gradient="left"
      gap={spacing.md}
    >
      <AppText variant="eyebrow" color={palette.cyan}>
        {community.eyebrow}
      </AppText>
      <View>
        <BrandHeadline lines={community.headline} size="md" onMedia />
        <AppText variant="brandTitle" color={palette.cyan}>
          {community.subheadline}
        </AppText>
      </View>
      <AppText variant="small" color={palette.navMuted}>
        {community.body}
      </AppText>
      <View style={styles.communityStats}>
        {community.stats.map((stat) => (
          <View key={stat.label}>
            <AppText variant="eyebrow" color={palette.navMuted}>
              {stat.label}
            </AppText>
            <AppText variant="metricSmall" color={palette.navText} tabular>
              {stat.value}
            </AppText>
          </View>
        ))}
      </View>
      <Button
        label={community.cta}
        variant="brand"
        icon="arrow-right"
        iconPosition="right"
        onPress={() => router.push("/ecosystem")}
      />
    </MediaCard>
  );
}

function StoryCard({ story }) {
  return (
    <Card style={styles.story}>
      <Icon name="quote" size={22} color="accent" />
      <AppText variant="h3">“{story.quote}”</AppText>
      <View style={styles.storyMeta}>
        <View style={styles.flex}>
          <AppText variant="smallStrong">— {story.author}</AppText>
          <AppText variant="caption" color="textMuted">
            {story.role}
          </AppText>
        </View>
        <Chip label={story.pillar} tone="accent" />
      </View>
    </Card>
  );
}

function FinalCtaCard() {
  const router = useRouter();
  return (
    <MediaCard image={finalCta.image} height={460} gradient="full" gap={spacing.lg}>
      <BrandHeadline lines={finalCta.headline} size="md" onMedia accentLast />
      <AppText variant="small" color={palette.navMuted}>
        {finalCta.body}
      </AppText>
      <View style={styles.heroActions}>
        <Button
          label={finalCta.primaryCta}
          variant="brand"
          fullWidth
          onPress={() => router.push("/assessment")}
        />
        <Button
          label={finalCta.secondaryCta}
          variant="outlineLight"
          fullWidth
          onPress={() => router.push("/membership")}
        />
      </View>
    </MediaCard>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gapXs: { gap: spacing.xs },
  gapMd: { gap: spacing.md },
  gapLg: { gap: spacing.lg },
  heroActions: { gap: spacing.sm, marginTop: spacing.xs },
  statsRow: { flexDirection: "row" },
  stat: { flex: 1, alignItems: "center", gap: 2, paddingHorizontal: 2 },
  statDivider: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: "rgba(127,140,150,0.3)",
  },
  wordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  pillarTile: { width: "47.8%", flexGrow: 1, gap: spacing.sm, minHeight: 150 },
  pillarTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  pillarIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  flow: { flexDirection: "row", justifyContent: "space-between" },
  flowItem: { flex: 1, alignItems: "center", gap: spacing.xs },
  flowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  flowConnector: {
    position: "absolute",
    top: 20,
    right: -10,
    width: 20,
    height: StyleSheet.hairlineWidth * 2,
  },
  athleteBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.35)",
    marginBottom: spacing.xs,
  },
  inlineLink: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.xs },
  tierRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg },
  tierTitle: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: 2 },
  price: { alignItems: "flex-end" },
  communityStats: { flexDirection: "row", gap: spacing.xxl, flexWrap: "wrap" },
  story: { gap: spacing.lg, minHeight: 260, justifyContent: "space-between" },
  storyMeta: { flexDirection: "row", alignItems: "center", gap: spacing.md },
});
