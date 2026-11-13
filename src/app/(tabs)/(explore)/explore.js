/**
 * Explore — the whole Phase Rev ecosystem inside the member app.
 * Web equivalent: the public website (/, /ecosystem, pillar pages, /coaches,
 * /pricing) — the story, the pillars, the coaches, memberships and community.
 */
import { Screen } from "@/components/ui";
import { ExploreFeed } from "@/features/explore/ExploreFeed";
import { profileHeaderAction } from "@/features/home/ProfileButton";

export default function ExploreScreen() {
  return (
    <Screen variant="tab" title="Explore" lazy headerActions={[profileHeaderAction]}>
      <ExploreFeed />
    </Screen>
  );
}
