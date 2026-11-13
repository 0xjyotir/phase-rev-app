/**
 * Building blocks shared by the four pillar pages (/pillar/[id]).
 */
import { StyleSheet, View } from "react-native";
import { BrandHeadline } from "@/components/brand/BrandHeadline";
import { MediaCard } from "@/components/brand/MediaCard";
import { AppText, Button, Card, Chip, Icon } from "@/components/ui";
import { useTheme } from "@/providers/ThemeProvider";
import { palette, radius, spacing } from "@/theme";

/** Photo hero with the pillar's eyebrow, Oswald headline, meta row and two CTAs. */
export function PillarHero({ hero, image, onPrimary, onSecondary }) {
  return (
    <MediaCard image={image} aspectRatio={4 / 5} gradient="full" gap={spacing.lg}>
      <AppText variant="eyebrow" color={palette.cyan}>
        {hero.eyebrow}
      </AppText>
      <BrandHeadline lines={hero.headline} size="md" onMedia />
      <AppText variant="small" color={palette.navMuted}>
        {hero.subheadline}
      </AppText>
      <View style={styles.meta}>
        {hero.meta.map((item) => (
          <View key={item.label} style={styles.metaItem}>
            <AppText variant="metricSmall" color={palette.navText} tabular>
              {item.value}
            </AppText>
            <AppText variant="micro" color={palette.navMuted} numberOfLines={2}>
              {item.label}
            </AppText>
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <Button label={hero.primaryCta} variant="brand" fullWidth onPress={onPrimary} />
        {hero.secondaryCta ? (
          <Button label={hero.secondaryCta} variant="outlineLight" fullWidth onPress={onSecondary} />
        ) : null}
      </View>
    </MediaCard>
  );
}

/** Eyebrow + Oswald headline + body, used to open a section. */
export function SectionIntro({ eyebrow, headline, body, accentLast = true }) {
  return (
    <View style={styles.intro}>
      {eyebrow ? (
        <AppText variant="eyebrow" color="accent">
          {eyebrow}
        </AppText>
      ) : null}
      {headline ? (
        <BrandHeadline
          lines={Array.isArray(headline) ? headline : [headline]}
          size="sm"
          accentLast={accentLast}
        />
      ) : null}
      {body ? (
        <AppText variant="small" color="textMuted">
          {body}
        </AppText>
      ) : null}
    </View>
  );
}

/** Numbered feature card: "01 · Gym — description — points". */
export function NumberedCard({ number, icon, title, description, points, children }) {
  const { colors } = useTheme();
  return (
    <Card style={styles.numbered}>
      <View style={styles.numberedTop}>
        <AppText variant="eyebrow" color="textTertiary">
          {number}
        </AppText>
        <View style={[styles.rule, { backgroundColor: colors.separator }]} />
        {icon ? <Icon name={icon} size={20} color="accent" /> : null}
      </View>
      <AppText variant="h3">{title}</AppText>
      {description ? (
        <AppText variant="small" color="textMuted">
          {description}
        </AppText>
      ) : null}
      {points?.length ? (
        <View style={styles.points}>
          {points.map((point) => (
            <View key={point} style={styles.point}>
              <Icon name="check" size={12} color="accent" weight="bold" />
              <AppText variant="smallMedium">{point}</AppText>
            </View>
          ))}
        </View>
      ) : null}
      {children}
    </Card>
  );
}

/** "What's included" chip cloud. */
export function IncludedCard({ title = "What's included", items }) {
  return (
    <Card style={styles.included}>
      <AppText variant="captionStrong" color="textMuted">
        {title.toUpperCase()}
      </AppText>
      <View style={styles.chips}>
        {items.map((item) => (
          <Chip key={item} label={item} tone="accent" size="md" />
        ))}
      </View>
    </Card>
  );
}

/** Closing call to action (web: FinalCtaSection). */
export function FinalCta({ cta, onPrimary, onSecondary }) {
  return (
    <Card style={styles.final}>
      <BrandHeadline lines={cta.headline} size="md" accentLast />
      <AppText variant="small" color="textMuted">
        {cta.body}
      </AppText>
      <Button label={cta.primaryCta} fullWidth onPress={onPrimary} />
      {cta.secondaryCta ? (
        <Button label={cta.secondaryCta} variant="secondary" fullWidth onPress={onSecondary} />
      ) : null}
    </Card>
  );
}

/** Small icon + title + description row used in feature grids. */
export function FeatureTile({ icon, title, description, footer, onPress, style }) {
  const { colors } = useTheme();
  return (
    <Card padding="md" style={[styles.tile, style]} onPress={onPress}>
      <View style={[styles.tileIcon, { backgroundColor: colors.accentSoft }]}>
        <Icon name={icon} size={18} color="accent" />
      </View>
      <AppText variant="bodyStrong">{title}</AppText>
      <AppText variant="caption" color="textMuted">
        {description}
      </AppText>
      {footer}
    </Card>
  );
}

const styles = StyleSheet.create({
  meta: { flexDirection: "row", gap: spacing.md },
  metaItem: { flex: 1, gap: 2 },
  actions: { gap: spacing.sm },
  intro: { gap: spacing.sm, marginTop: spacing.md },
  numbered: { gap: spacing.md },
  numberedTop: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  rule: { flex: 1, height: StyleSheet.hairlineWidth },
  points: { gap: spacing.sm },
  point: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  included: { gap: spacing.md },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  final: { gap: spacing.md },
  tile: { width: "47.8%", flexGrow: 1, gap: spacing.sm },
  tileIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
