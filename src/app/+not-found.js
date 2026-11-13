/**
 * 404 — any unknown route (e.g. a stale deep link).
 */
import { useRouter } from "expo-router";
import { Button, EmptyState, Screen } from "@/components/ui";

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <Screen scroll={false} contentStyle={{ justifyContent: "center" }}>
      <EmptyState
        icon="compass"
        title="This page took a rest day"
        message="The screen you were looking for doesn't exist."
        action={<Button label="Back to home" onPress={() => router.replace("/")} />}
      />
    </Screen>
  );
}
