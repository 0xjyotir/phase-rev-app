/**
 * Discover — the public ecosystem for visitors (no account needed), reached
 * from Welcome → "Explore Phase Rev". Same content as the members' Explore tab,
 * with sign-in as the next step — like browsing the website before joining.
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card, Screen } from "@/components/ui";
import { ExploreFeed } from "@/features/explore/ExploreFeed";
import { useMember } from "@/hooks/useMember";
import { spacing } from "@/theme";

export default function DiscoverScreen() {
  const router = useRouter();
  const { isSignedIn } = useMember();

  return (
    <Screen
      title="Phase Rev"
      largeTitle
      headerActions={
        isSignedIn ? undefined : [{ label: "Sign in", prominent: true, onPress: () => router.push("/login") }]
      }
    >
      <ExploreFeed isGuest={!isSignedIn} />

      {!isSignedIn ? (
        <Card style={styles.join}>
          <AppText variant="title">Ready to start?</AppText>
          <AppText variant="small" color="textMuted">
            Sign in to log workouts, track macros and mood, and save your baseline to your profile.
          </AppText>
          <View style={styles.actions}>
            <Button label="Sign in to Rev" fullWidth onPress={() => router.push("/login")} />
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  join: { gap: spacing.sm },
  actions: { marginTop: spacing.sm },
});
