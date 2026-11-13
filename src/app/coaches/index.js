/**
 * Coaches — "Coaches who move you forward."
 * Web equivalent: /coaches (CoachHero, CoachingPhilosophy, CoachRoster with
 * specialty filters, CoachingStatement, CoachingCta).
 */
import { useRouter } from "expo-router";
import { useHeaderHeight } from "expo-router/react-navigation";
import { useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { BrandHeadline } from "@/components/brand/BrandHeadline";
import { AppText, Button, Card, Chip, EmptyState, Icon, Screen } from "@/components/ui";
import { coachFilters, coachPageCopy, getCoachesByCategory, testimonials } from "@/constants/coaches";
import { CoachCard } from "@/features/coaches/CoachCard";
import { useMemberLink } from "@/hooks/useMemberLink";
import { haptics } from "@/lib/haptics";
import { IS_IOS } from "@/lib/platform";
import { useTheme } from "@/providers/ThemeProvider";
import { GUTTER, spacing } from "@/theme";

export default function CoachesScreen() {
  const router = useRouter();
  const go = useMemberLink();
  const { colors } = useTheme();
  const scrollRef = useRef(null);
  const rosterY = useRef(0);
  const headerHeight = useHeaderHeight();
  const [filter, setFilter] = useState("all");
  const visible = getCoachesByCategory(filter);
  const { hero, philosophy, specialties, roster, statement, cta } = coachPageCopy;

  const showSpecialty = (nextFilter) => {
    haptics.select();
    setFilter(nextFilter);
    scrollRef.current?.scrollTo({ y: rosterY.current, animated: true });
  };

  return (
    <Screen title="Coaches" largeTitle scrollRef={scrollRef}>
      <View style={styles.hero}>
        <AppText variant="eyebrow" color="accent">
          {hero.eyebrow}
        </AppText>
        <BrandHeadline lines={hero.headline} size="lg" accentLast />
        <AppText variant="body" color="textMuted">
          {hero.subheadline}
        </AppText>
      </View>

      <Card padding="md">
        <View style={styles.metaRow}>
          {hero.meta.map((item, index) => (
            <View
              key={item.label}
              style={[styles.meta, index > 0 && { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: colors.separator }]}
            >
              <AppText variant="micro" color="textMuted">
                {item.label.toUpperCase()}
              </AppText>
              <AppText variant="smallStrong" numberOfLines={1}>
                {item.value}
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.gapMd}>
        <AppText variant="eyebrow" color="champagne">
          {philosophy.label}
        </AppText>
        <AppText variant="h3">{philosophy.statement}</AppText>
        <AppText variant="small" color="textMuted">
          {philosophy.body}
        </AppText>
      </Card>

      <View style={styles.specialties}>
        {specialties.map((item) => (
          <Pressable
            key={item.number}
            onPress={() => showSpecialty(item.filter)}
            style={({ pressed }) => [styles.specialty, pressed && { opacity: 0.6 }]}
            accessibilityRole="button"
            accessibilityLabel={`${item.title}. ${item.description} Show coaches.`}
          >
            <Card padding="md" style={styles.specialtyCard}>
              <AppText variant="eyebrow" color="accent">
                {item.number}
              </AppText>
              <AppText variant="bodyStrong">{item.title}</AppText>
              <AppText variant="caption" color="textMuted">
                {item.description}
              </AppText>
            </Card>
          </Pressable>
        ))}
      </View>

      <View
        style={styles.gapSm}
        onLayout={(event) => {
          rosterY.current = event.nativeEvent.layout.y - (IS_IOS ? headerHeight : 0) - 8;
        }}
      >
        <AppText variant="eyebrow" color="accent">
          {roster.eyebrow}
        </AppText>
        <AppText variant="h2">{roster.title}</AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.bleed}
        contentContainerStyle={styles.chips}
      >
        {coachFilters.map((item) => (
          <Chip
            key={item.id}
            label={item.label}
            size="md"
            selected={filter === item.id}
            onPress={() => setFilter(item.id)}
          />
        ))}
      </ScrollView>

      {visible.length ? (
        visible.map((coach) => <CoachCard key={coach.id} coach={coach} />)
      ) : (
        <EmptyState
          icon="users"
          title="Coming soon"
          message={roster.empty}
          action={<Button label="View all coaches" variant="secondary" onPress={() => setFilter("all")} />}
        />
      )}

      <Card style={styles.gapMd}>
        <BrandHeadline lines={statement.lines} size="md" accentLast />
        <AppText variant="small" color="textMuted">
          {statement.subline}
        </AppText>
      </Card>

      <Card tone="soft" style={styles.gapSm}>
        <Icon name="quote" size={18} color="accent" />
        <AppText variant="body">“{testimonials[0].quote}”</AppText>
        <AppText variant="caption" color="textMuted">
          {testimonials[0].author} · {testimonials[0].role}
        </AppText>
      </Card>

      <Card style={styles.gapMd}>
        <AppText variant="eyebrow" color="accent">
          {cta.eyebrow}
        </AppText>
        <BrandHeadline lines={cta.headline} size="md" accentLast />
        <AppText variant="small" color="textMuted">
          {cta.body}
        </AppText>
        <Button label={cta.primary} fullWidth onPress={() => go("/membership", true)} />
        <Button
          label={cta.secondary}
          variant="secondary"
          fullWidth
          onPress={() => router.push("/assessment")}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gapSm: { gap: spacing.sm },
  gapMd: { gap: spacing.md },
  hero: { gap: spacing.md },
  metaRow: { flexDirection: "row" },
  meta: { flex: 1, gap: 3, paddingHorizontal: spacing.sm },
  specialties: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  specialty: { width: "47.8%", flexGrow: 1 },
  specialtyCard: { gap: spacing.xs, flexGrow: 1 },
  bleed: { marginHorizontal: -GUTTER },
  chips: { gap: spacing.sm, paddingHorizontal: GUTTER },
});
