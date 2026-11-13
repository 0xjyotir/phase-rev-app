/**
 * Profile — account, baseline, ecosystem links, settings and sign out.
 */
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Wordmark } from "@/components/brand/Wordmark";
import { AppText, Avatar, Card, Chip, Dialog, Divider, ListRow, Screen } from "@/components/ui";
import { siteMeta } from "@/constants/brand";
import { coaches } from "@/constants/coaches";
import { getTierById } from "@/constants/membership";
import { AssessmentSummaryCard } from "@/features/profile/AssessmentSummaryCard";
import { SettingsCard } from "@/features/profile/SettingsCard";
import { useMember } from "@/hooks/useMember";
import { useProfile } from "@/hooks/useProfile";
import { haptics } from "@/lib/haptics";
import { isApiConfigured } from "@/services/api-client";
import { useProfileStore } from "@/stores/profile-store";
import { useTrainingStore } from "@/stores/training-store";
import { spacing } from "@/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useMember();
  const { profile, actions } = useProfile();
  const tier = getTierById(user?.tierId);
  const [dialog, setDialog] = useState(null); // "signout" | "reset" | null

  const resetDemoData = () => {
    useTrainingStore.getState().resetTraining();
    actions.resetProfile();
    if (user) useProfileStore.getState().ensureProfile(user.id);
    haptics.success();
    setDialog(null);
  };

  return (
    <Screen edges={["top"]}>
      <AppText variant="h1">Profile</AppText>

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

      <Card padding="none">
        <ListRow
          icon="users"
          title="Coaches"
          subtitle={`${coaches.length} specialists across every pillar`}
          onPress={() => router.push("/coaches")}
        />
        <Divider inset={64} />
        <ListRow
          icon="award"
          title="Membership"
          subtitle={tier ? `${tier.name} · $${tier.price}/${tier.period}` : "Choose a plan"}
          onPress={() => router.push("/membership")}
        />
        <Divider inset={64} />
        <ListRow
          icon="list"
          title="Routines"
          subtitle="Build and reuse training plans"
          onPress={() =>
            router.navigate({ pathname: "/train", params: { view: "library", sub: "routines" } })
          }
        />
      </Card>

      <SettingsCard />

      <Card padding="none">
        <ListRow icon="info" title="About" subtitle={siteMeta.description} />
        <Divider inset={64} />
        <ListRow
          icon="server"
          title="Data"
          detail={isApiConfigured() ? "Connected" : "Demo mode"}
          subtitle="Profile and training data are stored on this device"
        />
        <Divider inset={64} />
        <ListRow
          icon="refresh-ccw"
          title="Reset demo data"
          subtitle="Regenerate sample workouts, meals and moods"
          onPress={() => setDialog("reset")}
        />
        <Divider inset={64} />
        <ListRow icon="log-out" title="Sign out" danger onPress={() => setDialog("signout")} />
      </Card>

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
        message="Workouts, meal log, moods and assessment go back to the sample data. This can't be undone."
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
  footer: { alignItems: "center", gap: spacing.xs, marginTop: spacing.md },
});
