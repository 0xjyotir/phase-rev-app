/**
 * MindToolsCard — the reflective tools of the Mental pillar, as an
 * inset-grouped list: guided journal, thought reframe (CBT) and the
 * wellbeing check — each showing its latest result.
 */
import { useRouter } from "expo-router";
import { ListRow, ListSection } from "@/components/ui";
import { formatRelativeDay } from "@/lib/dates";
import { scoreBand } from "@/features/mental/lib/wellbeing-band";

export function MindToolsCard({ profile }) {
  const router = useRouter();
  const lastJournal = profile.journal.entries[0];
  const lastReframe = profile.reframes[0];
  const lastCheck = profile.wellbeing.checks[0];
  const band = lastCheck ? scoreBand(lastCheck.score) : null;

  return (
    <ListSection>
      <ListRow
        icon="book-open"
        iconTint="#2F7FD8"
        title="Guided journal"
        subtitle={
          lastJournal
            ? `${profile.journal.entries.length} ${profile.journal.entries.length === 1 ? "entry" : "entries"} · last ${formatRelativeDay(lastJournal.createdAt).toLowerCase()}`
            : "Prompts that turn a few lines into insight"
        }
        onPress={() => router.push("/journal")}
      />
      <ListRow
        icon="refresh-cw"
        iconTint="#8B6CEF"
        title="Thought reframe"
        subtitle={
          lastReframe
            ? `CBT activity · last ${formatRelativeDay(lastReframe.createdAt).toLowerCase()}`
            : "CBT activity · untangle one difficult thought"
        }
        onPress={() => router.push("/reframe")}
      />
      <ListRow
        icon="activity"
        iconTint="#2BA98A"
        title="Wellbeing check"
        subtitle={
          lastCheck
            ? `${lastCheck.score}/100 · ${band?.label} · ${formatRelativeDay(lastCheck.createdAt).toLowerCase()}`
            : "Five statements · two minutes"
        }
        onPress={() => router.push("/wellbeing")}
      />
    </ListSection>
  );
}
