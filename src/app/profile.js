/**
 * Profile — account, baseline, membership, coaching, settings and sign out,
 * as iOS-style inset-grouped lists. Opened from the avatar in the nav bar.
 */
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Switch, View } from "react-native";
import { Wordmark } from "@/components/brand/Wordmark";
import {
  AppText,
  Avatar,
  Card,
  Chip,
  Dialog,
  ListRow,
  ListSection,
  Screen,
  SegmentedControl,
} from "@/components/ui";
import { siteMeta } from "@/constants/brand";
import { getCoachById } from "@/constants/coaches";
import { getTierById } from "@/constants/membership";
import { AssessmentSummaryCard } from "@/features/profile/AssessmentSummaryCard";
import { useMember } from "@/hooks/useMember";
import { useProfile } from "@/hooks/useProfile";
import { formatRelativeDay } from "@/lib/dates";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/providers/ThemeProvider";
import { isApiConfigured } from "@/services/api-client";
import { usePreferencesStore } from "@/stores/preferences-store";
import { useProfileStore } from "@/stores/profile-store";
import { useTrainingStore } from "@/stores/training-store";
import { spacing } from "@/theme";

const APPEARANCE_OPTIONS = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

const REST_STEPS = [15, 30, 45];

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, signOut } = useMember();
  const { profile, actions } = useProfile();
  const tier = getTierById(user?.tierId);
  const [dialog, setDialog] = useState(null); // "signout" | "reset" | null

  const appearance = usePreferencesStore((state) => state.appearance);
  const setAppearance = usePreferencesStore((state) => state.setAppearance);
  const hapticsEnabled = usePreferencesStore((state) => state.hapticsEnabled);
  const setHapticsEnabled = usePreferencesStore((state) => state.setHapticsEnabled);
  const restStep = usePreferencesStore((state) => state.restStepSeconds);
  const setRestStep = usePreferencesStore((state) => state.setRestStepSeconds);

  const requests = profile.coaching.requests;

  const resetDemoData = () => {
    useTrainingStore.getState().resetTraining();
    actions.resetProfile();
    if (user) useProfileStore.getState().ensureProfile(user.id);
    haptics.success();
    setDialog(null);
  };

  const switchColors = { true: colors.accent, false: colors.surfaceStrong };

  return (
    <Screen title="Profile" largeTitle gap={spacing.xxl}>
      <Card style={styles.identity}>
        <Avatar name={user?.displayName} size={64} />
        <View style={styles.flex}>
          <AppText variant="h3">{user?.displayName}</AppText>
          <AppText variant="small" color="textMuted">
            {user?.email}
          </AppText>
          {tier ? (
            <Chip label={`${tier.name} member`} tone="accent" style={styles.tierChip} />
          ) : null}
        </View>
      </Card>

      <AssessmentSummaryCard assessment={profile.assessment} />

      <ListSection header="Membership & coaching">
        <ListRow
          icon="award"
          iconTint="#C4A265"
          title="Membership"
          detail={tier ? `${tier.name}` : "Choose"}
          subtitle={
            tier
              ? `$${tier.price}/${tier.period} · all four pillars`
              : "Every tier includes all four pillars"
          }
          onPress={() => router.push("/membership")}
        />
        <ListRow
          icon="users"
          title="Coaches"
          subtitle="Strength, athletic, nutrition and mental specialists"
          onPress={() => router.push("/coaches")}
        />
        {requests.length ? (
          <ListRow
            icon="calendar"
            iconTint="#2F7FD8"
            title="Session requests"
            detail={String(requests.length)}
            subtitle={requests
              .slice(0, 2)
              .map(
                (request) =>
                  `${getCoachById(request.coachId)?.name ?? "Nutrition team"} · ${formatRelativeDay(request.createdAt)}`,
              )
              .join("  ·  ")}
          />
        ) : null}
      </ListSection>

      <ListSection header="Training">
        <ListRow
          icon="list"
          title="Routines"
          subtitle="Build and reuse training plans"
          onPress={() =>
            router.navigate({ pathname: "/train", params: { view: "library", sub: "routines" } })
          }
        />
        <ListRow
          icon="book-open"
          iconTint="#8B6CEF"
          title="Journal"
          detail={String(profile.journal.entries.length)}
          onPress={() => router.push("/journal")}
        />
        <ListRow
          icon="compass"
          iconTint="#2BA98A"
          title="Explore Phase Rev"
          subtitle="Pillars, ecosystem, community"
          onPress={() => router.push("/ecosystem")}
        />
      </ListSection>

      <ListSection header="Appearance" footer="Dark mode matches the Phase Rev website.">
        <View style={styles.segmentRow}>
          <SegmentedControl
            options={APPEARANCE_OPTIONS}
            value={appearance}
            onChange={setAppearance}
          />
        </View>
      </ListSection>

      <ListSection header="Workout" footer="Haptics confirm completed sets and the end of a rest.">
        <ListRow
          icon="smartphone"
          iconTint="#5E5CE6"
          title="Haptics"
          right={
            <Switch
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
              trackColor={switchColors}
              ios_backgroundColor={colors.surfaceStrong}
            />
          }
        />
        <View style={styles.segmentRow}>
          <AppText variant="small" color="textMuted">
            Rest timer adjust step
          </AppText>
          <SegmentedControl
            options={REST_STEPS.map((seconds) => ({ id: String(seconds), label: `${seconds}s` }))}
            value={String(restStep)}
            onChange={(value) => setRestStep(Number(value))}
            size="sm"
          />
        </View>
      </ListSection>

      <ListSection header="Data" footer="Profile and training data are stored on this device.">
        <ListRow
          icon="server"
          iconTint="#8E8E93"
          title="Sync"
          detail={isApiConfigured() ? "Connected" : "Demo mode"}
        />
        <ListRow icon="info" iconTint="#8E8E93" title="About" subtitle={siteMeta.description} />
        <ListRow
          icon="refresh-ccw"
          iconTint="#FF9F0A"
          title="Reset demo data"
          subtitle="Regenerate sample workouts, meals and moods"
          onPress={() => setDialog("reset")}
        />
      </ListSection>

      <ListSection>
        <ListRow icon="log-out" title="Sign out" danger onPress={() => setDialog("signout")} />
      </ListSection>

      <View style={styles.footer}>
        <Wordmark size="sm" tone="adaptive" align="center" showTagline />
        <AppText variant="caption" color="textMuted">
          Version {Constants.expoConfig?.version ?? "1.0.0"}
        </AppText>
      </View>

      <Dialog
        visible={dialog === "signout"}
        title="Sign out?"
        message="Your training history stays on this device."
        confirmLabel="Sign out"
        destructive
        onConfirm={() => {
          setDialog(null);
          signOut();
        }}
        onCancel={() => setDialog(null)}
      />
      <Dialog
        visible={dialog === "reset"}
        title="Reset demo data?"
        message="Workouts, meal log, moods, journal and assessment go back to the sample data. This can't be undone."
        confirmLabel="Reset"
        destructive
        onConfirm={resetDemoData}
        onCancel={() => setDialog(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: { flexDirection: "row", alignItems: "center", gap: spacing.lg },
  flex: { flex: 1, gap: 2 },
  tierChip: { marginTop: spacing.xs },
  segmentRow: { padding: spacing.lg, gap: spacing.md },
  footer: { alignItems: "center", gap: spacing.xs, marginTop: spacing.md },
});
