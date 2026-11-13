/**
 * QuickLinks — shortcuts into the rest of the ecosystem (assessment, coaches,
 * membership), as an inset-grouped list under the main Today cards.
 */
import { useRouter } from "expo-router";
import { ListRow, ListSection } from "@/components/ui";

const LINKS = [
  {
    id: "assessment",
    icon: "clipboard",
    tint: "#2F7FD8",
    title: "Assessment",
    subtitle: "Retake your baseline in two minutes",
    href: "/assessment",
  },
  {
    id: "coaches",
    icon: "users",
    tint: "#2BA98A",
    title: "Coaches",
    subtitle: "Book a session with a specialist",
    href: "/coaches",
  },
  {
    id: "membership",
    icon: "award",
    tint: "#C4A265",
    title: "Membership",
    subtitle: "Compare tiers and what’s included",
    href: "/membership",
  },
];

export function QuickLinks() {
  const router = useRouter();
  return (
    <ListSection>
      {LINKS.map((link) => (
        <ListRow
          key={link.id}
          icon={link.icon}
          iconTint={link.tint}
          title={link.title}
          subtitle={link.subtitle}
          onPress={() => router.push(link.href)}
        />
      ))}
    </ListSection>
  );
}
