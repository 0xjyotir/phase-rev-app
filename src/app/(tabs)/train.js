/**
 * Train — the workout tracker (Physical + Athletic pillars).
 * Web equivalent: /rev/workouts (phaserev/src/sections/rev/rev-workouts-content.tsx)
 *
 *   Today    → what to train + start            (views/TodayView)
 *   Library  → exercises & routines             (views/LibraryView)
 *   Progress → training · history · body        (views/ProgressView)
 *
 * The selected view lives in the URL (?view=library&sub=routines), so any
 * screen can deep-link into it:
 *   router.navigate({ pathname: "/train", params: { view: "progress" } })
 */
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { AppText, Screen, SegmentedControl } from "@/components/ui";
import { LibraryView } from "@/features/workouts/views/LibraryView";
import { ProgressView } from "@/features/workouts/views/ProgressView";
import { TodayView } from "@/features/workouts/views/TodayView";
import { GUTTER, spacing } from "@/theme";

const VIEWS = [
  { id: "today", label: "Today" },
  { id: "library", label: "Library" },
  { id: "progress", label: "Progress" },
];

const SUBTITLES = {
  today: "Plan → train → log → progress.",
  library: "Gym and calisthenics movements, plus your saved routines.",
  progress: "Trends, recent sessions and body check-ins.",
};

/** Default sub-view for each view when `sub` is missing or belongs to another view. */
const SUB_VIEWS = {
  library: { options: ["exercises", "routines"], fallback: "exercises" },
  progress: { options: ["training", "history", "body"], fallback: "training" },
};

function resolveSub(view, sub) {
  const config = SUB_VIEWS[view];
  if (!config) return null;
  return config.options.includes(sub) ? sub : config.fallback;
}

export default function TrainScreen() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const params = useLocalSearchParams();
  const view = VIEWS.some((v) => v.id === params.view) ? params.view : "today";
  const sub = resolveSub(view, params.sub);

  const go = (nextView, nextSub) => {
    router.setParams({ view: nextView, sub: nextSub ?? "" });
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const header = (
    <View style={styles.header}>
      <AppText variant="h1">Workouts</AppText>
      <AppText variant="small" color="textMuted">
        {SUBTITLES[view]}
      </AppText>
      <SegmentedControl
        options={VIEWS}
        value={view}
        onChange={(nextView) => go(nextView)}
        style={styles.segment}
      />
    </View>
  );

  return (
    <Screen edges={["top"]} header={header} scrollRef={scrollRef}>
      {view === "today" ? <TodayView onOpenRoutines={() => go("library", "routines")} /> : null}
      {view === "library" ? (
        <LibraryView
          subView={sub}
          onSubViewChange={(nextSub) => go("library", nextSub)}
          onAppliedToday={() => go("today")}
        />
      ) : null}
      {view === "progress" ? (
        <ProgressView subView={sub} onSubViewChange={(nextSub) => go("progress", nextSub)} />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: GUTTER,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  segment: { marginTop: spacing.sm },
});
