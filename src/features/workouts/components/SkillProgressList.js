/**
 * SkillProgressList — calisthenics skill progressions (web: CalisthenicsSkills).
 */
import { StyleSheet, View } from "react-native";
import { AppText, Card, ProgressBar, SectionHeader } from "@/components/ui";
import { spacing } from "@/theme";

export function SkillProgressList({ skills }) {
  return (
    <Card style={styles.card}>
      <SectionHeader title="Skill progressions" subtitle="Where each calisthenics skill stands" />
      {skills.map((skill) => (
        <View key={skill.id} style={styles.skill}>
          <View style={styles.row}>
            <AppText variant="smallStrong" style={styles.flex}>
              {skill.name}
            </AppText>
            <AppText variant="caption" color="textMuted">
              {skill.level} · {skill.detail}
            </AppText>
          </View>
          <ProgressBar percent={skill.progress} height={6} />
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  skill: { gap: spacing.xs },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  flex: { flex: 1 },
});
