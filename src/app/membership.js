/**
 * Membership — tiers + comparison (web: /pricing).
 * No payments in this build: choosing a tier shows a confirmation dialog.
 * When billing lands, `onSelect` becomes a Stripe / in-app purchase call.
 */
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText, Dialog, Screen, ScreenHeader, SectionHeader } from "@/components/ui";
import { membershipCopy, membershipTiers } from "@/constants/membership";
import { ComparisonTable } from "@/features/membership/ComparisonTable";
import { TierCard } from "@/features/membership/TierCard";
import { useMember } from "@/hooks/useMember";
import { spacing } from "@/theme";

export default function MembershipScreen() {
  const { user } = useMember();
  const [selected, setSelected] = useState(null);

  return (
    <Screen header={<ScreenHeader title="Membership" />}>
      <View style={styles.header}>
        <AppText variant="eyebrow" color="accent">
          {membershipCopy.eyebrow}
        </AppText>
        <AppText variant="h1">{membershipCopy.headline}</AppText>
        <AppText variant="body" color="textMuted">
          {membershipCopy.subheadline}
        </AppText>
      </View>

      {membershipTiers.map((tier) => (
        <TierCard
          key={tier.id}
          tier={tier}
          isCurrent={user?.tierId === tier.id}
          onSelect={setSelected}
        />
      ))}

      <SectionHeader title="Compare memberships" subtitle="Every tier includes all four pillars" />
      <ComparisonTable />

      <Dialog
        visible={Boolean(selected)}
        title={selected ? `Switch to ${selected.name}?` : ""}
        message="In-app billing is coming soon. For now our team will help you change plans — we'll email you within a day."
        confirmLabel="Request change"
        onConfirm={() => setSelected(null)}
        onCancel={() => setSelected(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm },
});
