/**
 * QuickLinks — shortcuts into the rest of the ecosystem (assessment, coaches,
 * membership). Horizontal tiles under the main Home cards.
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, Card, Icon } from "@/components/ui";
import { spacing } from "@/theme";

const LINKS = [
  {
    id: "assessment",
    icon: "clipboard",
    title: "Assessment",
    subtitle: "Your baseline",
    href: "/assessment",
  },
  { id: "coaches", icon: "users", title: "Coaches", subtitle: "Meet the team", href: "/coaches" },
  {
    id: "membership",
    icon: "award",
    title: "Membership",
    subtitle: "Your tier",
    href: "/membership",
  },
];

export function QuickLinks() {
  const router = useRouter();
  return (
    <View style={styles.row}>
      {LINKS.map((link) => (
        <Card key={link.id} padding="md" style={styles.tile} onPress={() => router.push(link.href)}>
          <Icon name={link.icon} size={20} color="accent" />
          <AppText variant="smallStrong" numberOfLines={1}>
            {link.title}
          </AppText>
          <AppText variant="caption" color="textMuted" numberOfLines={1}>
            {link.subtitle}
          </AppText>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.sm },
  tile: { flex: 1, gap: spacing.xs },
});
