/**
 * Physical Performance pillar page sections.
 * Web: /physical-performance (PhysHero, PhysPaths, PhysExercises, PhysCoaches,
 * PhysTrackLure, PhysFinalCta) + physicalPrograms + TransformationSection.
 */
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  AppText,
  Button,
  Card,
  Carousel,
  Chip,
  Divider,
  Icon,
  SegmentedControl,
} from "@/components/ui";
import { getCoachesByPillar } from "@/constants/coaches";
import { exercises } from "@/constants/exercises";
import {
  physicalCoachesCopy,
  physicalExercisesCopy,
  physicalPaths,
  physicalPrograms,
  physicalTrackCopy,
  transformation,
} from "@/constants/pillars";
import { CoachCard } from "@/features/coaches/CoachCard";
import { getExerciseMeta } from "@/features/workouts/lib/labels";
import { useMemberLink } from "@/hooks/useMemberLink";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";
import { NumberedCard, SectionIntro } from "./PillarParts";

const MODES = [
  { id: "gym", label: "Gym" },
  { id: "calisthenics", label: "Calisthenics" },
];

export function PhysicalPillar() {
  const go = useMemberLink();
  const { colors } = useTheme();
  const [mode, setMode] = useState("gym");
  const preview = exercises.filter((exercise) => exercise.mode === mode).slice(0, 6);
  const physicalCoaches = getCoachesByPillar("physical");

  return (
    <>
      <SectionIntro eyebrow={physicalPaths.eyebrow} headline={physicalPaths.headline} />
      {physicalPaths.items.map((path) => (
        <NumberedCard
          key={path.id}
          number={path.number}
          icon={path.icon}
          title={path.title}
          description={path.description}
          points={path.points}
        />
      ))}

      <SectionIntro
        eyebrow="Programs"
        headline={["STRUCTURED BLOCKS.", "REAL TIMELINES."]}
        body="Progressive programs coached inside the Phase Rev system."
      />
      <Card padding="none">
        {physicalPrograms.map((program, index) => (
          <View key={program.id}>
            {index > 0 ? <Divider inset={spacing.lg} /> : null}
            <View style={styles.program}>
              <AppText variant="eyebrow" color="textTertiary" style={styles.programNumber}>
                {String(index + 1).padStart(2, "0")}
              </AppText>
              <View style={styles.flex}>
                <AppText variant="bodyStrong">{program.title}</AppText>
                <AppText variant="caption" color="textMuted">
                  {program.description}
                </AppText>
                <View style={styles.programMeta}>
                  <Chip icon="clock" label={program.duration} />
                  <Chip icon="bar-chart-2" label={program.level} tone="accent" />
                </View>
              </View>
            </View>
          </View>
        ))}
      </Card>

      <SectionIntro
        eyebrow={physicalExercisesCopy.eyebrow}
        headline={physicalExercisesCopy.headline}
        body={physicalExercisesCopy.body}
      />
      <Card style={styles.gapMd}>
        <SegmentedControl options={MODES} value={mode} onChange={setMode} size="sm" />
        <View>
          {preview.map((exercise, index) => (
            <View key={exercise.id}>
              {index > 0 ? <Divider inset={56} /> : null}
              <Pressable
                onPress={() => {
                  haptics.tap();
                  go(`/exercise/${exercise.id}`);
                }}
                style={({ pressed }) => [styles.exerciseRow, pressed && { opacity: 0.6 }]}
                accessibilityRole="button"
                accessibilityLabel={`${exercise.name}, watch form`}
              >
                <View style={[styles.play, { backgroundColor: colors.accentSoft }]}>
                  <Icon name="play" size={14} color="accent" />
                </View>
                <View style={styles.flex}>
                  <AppText variant="smallStrong">{exercise.name}</AppText>
                  <AppText variant="caption" color="textMuted">
                    {getExerciseMeta(exercise)}
                  </AppText>
                </View>
                <Icon name="chevron-right" size={13} color="textTertiary" weight="bold" />
              </Pressable>
            </View>
          ))}
        </View>
        <Button
          label={physicalExercisesCopy.cta}
          variant="secondary"
          fullWidth
          onPress={() => go({ pathname: "/train", params: { view: "library" } })}
        />
      </Card>

      <SectionIntro
        eyebrow={physicalCoachesCopy.eyebrow}
        headline={physicalCoachesCopy.headline}
        body={physicalCoachesCopy.body}
        accentLast={false}
      />
      <Carousel
        data={physicalCoaches}
        itemWidth={230}
        renderItem={(coach) => <CoachCard coach={coach} size="sm" />}
      />

      <SectionIntro
        eyebrow={physicalTrackCopy.eyebrow}
        headline={physicalTrackCopy.headline}
        body={physicalTrackCopy.body}
      />
      <Card style={styles.gapLg}>
        <View style={styles.previewHeader}>
          <View>
            <AppText variant="captionStrong" color="textMuted">
              SESSION PREVIEW
            </AppText>
            <AppText variant="title">{physicalTrackCopy.sessionPreview.title}</AppText>
          </View>
          <Chip icon="activity" label="Live log" tone="accent" />
        </View>
        <View style={styles.gapSm}>
          {physicalTrackCopy.sessionPreview.rows.map((row) => (
            <View
              key={row.name}
              style={[styles.previewRow, { backgroundColor: colors.surfaceSoft }]}
            >
              <AppText variant="smallMedium" style={styles.flex} numberOfLines={1}>
                {row.name}
              </AppText>
              <AppText variant="caption" color="accentStrong" tabular>
                {row.detail}
              </AppText>
            </View>
          ))}
        </View>
        <View style={styles.featureGrid}>
          {physicalTrackCopy.features.map((feature) => (
            <View key={feature.label} style={styles.feature}>
              <Icon name={feature.icon} size={16} color="accent" />
              <AppText variant="smallStrong">{feature.label}</AppText>
              <AppText variant="caption" color="textMuted">
                {feature.detail}
              </AppText>
            </View>
          ))}
        </View>
        <Button label="Open workouts" icon="play" fullWidth onPress={() => go("/train")} />
      </Card>

      <SectionIntro
        eyebrow={transformation.eyebrow}
        headline={["REAL", "TRANSFORMATION."]}
        body={transformation.subtitle}
      />
      <Card style={styles.gapLg}>
        <View style={styles.phases}>
          {transformation.phases.map((phase, index) => (
            <View key={phase.phase} style={styles.phaseWrap}>
              <View
                style={[
                  styles.phase,
                  { backgroundColor: index === 0 ? colors.surfaceSoft : colors.accentSoft },
                ]}
              >
                <AppText variant="eyebrow" color={index === 0 ? "textMuted" : "accentStrong"}>
                  {phase.phase}
                </AppText>
                <AppText variant="metricSmall">{phase.week}</AppText>
                <AppText variant="caption" color="textMuted" align="center">
                  {phase.label} · {phase.sub}
                </AppText>
              </View>
              {index === 0 ? (
                <Icon name="arrow-right" size={18} color="textTertiary" style={styles.phaseArrow} />
              ) : null}
            </View>
          ))}
        </View>
        <View style={styles.statRow}>
          {transformation.stats.map((stat) => (
            <View key={stat.label} style={styles.stat}>
              <AppText variant="metric" color="accentStrong" tabular>
                {stat.value}
              </AppText>
              <AppText variant="caption" color="textMuted" align="center">
                {stat.label}
              </AppText>
            </View>
          ))}
        </View>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  gapSm: { gap: spacing.sm },
  gapMd: { gap: spacing.md },
  gapLg: { gap: spacing.lg },
  program: { flexDirection: "row", gap: spacing.md, padding: spacing.lg },
  programNumber: { paddingTop: 4, width: 22 },
  programMeta: { flexDirection: "row", gap: spacing.xs, marginTop: spacing.sm, flexWrap: "wrap" },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  play: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  previewHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
  },
  featureGrid: { flexDirection: "row", flexWrap: "wrap", rowGap: spacing.lg },
  feature: { width: "50%", gap: 3, paddingRight: spacing.md },
  phases: { flexDirection: "row", alignItems: "center" },
  phaseWrap: { flex: 1, flexDirection: "row", alignItems: "center" },
  phase: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  phaseArrow: { marginHorizontal: spacing.sm },
  statRow: { flexDirection: "row" },
  stat: { flex: 1, alignItems: "center", gap: 2 },
});
