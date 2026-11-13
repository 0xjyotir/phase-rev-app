/**
 * Mental Wellness pillar page sections.
 * Web: /mental-wellness (MeditationCardsSection, MoodTrackerSection with the
 * box-breathing card, FinalCtaSection) + the pillar's six practices.
 */
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card } from "@/components/ui";
import { breathingPatterns, mentalPageCopy } from "@/constants/mental";
import { BreathingCircle } from "@/features/mental/components/BreathingCircle";
import { MindSessionsList } from "@/features/mental/components/MindSessionsList";
import { useMemberLink } from "@/hooks/useMemberLink";
import { spacing } from "@/theme";
import { FeatureTile, SectionIntro } from "./PillarParts";

const PRACTICES = [
  {
    id: "meditation",
    icon: "eye",
    title: "Meditation",
    description: "Guided focus and wind-down sessions.",
    href: "/session/deep-focus",
  },
  {
    id: "breathing",
    icon: "wind",
    title: "Breathing",
    description: "Reset, box and wind-down patterns.",
    href: "/breathing",
  },
  {
    id: "journal",
    icon: "book-open",
    title: "Guided journaling",
    description: "Prompts that turn a few lines into insight.",
    href: "/journal",
  },
  {
    id: "mood",
    icon: "smile",
    title: "Mood tracking",
    description: "A five-second daily check-in.",
    href: "/mind",
  },
  {
    id: "cbt",
    icon: "refresh-cw",
    title: "CBT activities",
    description: "Reframe one difficult thought.",
    href: "/reframe",
  },
  {
    id: "wellbeing",
    icon: "activity",
    title: "Wellbeing check",
    description: "Five statements, scored over time.",
    href: "/wellbeing",
  },
];

export function MentalPillar({ onSessionsLayout }) {
  const go = useMemberLink();
  const reset = breathingPatterns.find((pattern) => pattern.id === "phase-rev");

  return (
    <>
      <SectionIntro
        eyebrow="Practices"
        headline={["SIX WAYS TO", "TRAIN YOUR MIND."]}
        body="Every practice in the pillar is a working tool in Rev."
      />
      <View style={styles.grid}>
        {PRACTICES.map((practice) => (
          <FeatureTile
            key={practice.id}
            icon={practice.icon}
            title={practice.title}
            description={practice.description}
            onPress={() => go(practice.href)}
          />
        ))}
      </View>

      <View onLayout={onSessionsLayout}>
        <SectionIntro
          eyebrow="Practice"
          headline={["SESSIONS &", "PRACTICES."]}
          body={mentalPageCopy.sessionsSubtitle}
        />
      </View>
      <MindSessionsList />

      <SectionIntro
        eyebrow="Wellbeing"
        headline={["TRACK HOW", "YOU FEEL."]}
        body={mentalPageCopy.moodSubtitle}
      />
      <Card style={styles.breath}>
        <AppText variant="title">{mentalPageCopy.boxBreathing.title}</AppText>
        <AppText variant="caption" color="textMuted">
          {mentalPageCopy.boxBreathing.summary}
        </AppText>
        <BreathingCircle pattern={reset} running={false} size={150} />
        <AppText variant="small" color="textMuted" align="center">
          Inhale 4s · Hold 2s · Exhale 4s
        </AppText>
        <Button
          label="Start breathing"
          icon="play"
          fullWidth
          onPress={() => go({ pathname: "/breathing", params: { pattern: "phase-rev" } })}
        />
        <Button
          label="Log today's mood"
          variant="secondary"
          fullWidth
          onPress={() => go("/mind")}
        />
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  breath: { gap: spacing.md, alignItems: "stretch" },
});
