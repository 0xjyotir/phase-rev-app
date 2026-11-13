/**
 * Membership — "Invest in your evolution."
 * Web equivalent: /pricing (hero, tiers, feature comparison, 7-day trial CTA).
 *
 * No payments in this build: members request a plan change (the team follows
 * up); visitors start with sign-in. When billing lands, `choose` becomes an
 * in-app purchase / Stripe call.
 */
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { BrandHeadline } from "@/components/brand/BrandHeadline";
import { AppText, Button, Card, Dialog, Screen, SectionHeader } from "@/components/ui";
import { membershipCopy, membershipTiers } from "@/constants/membership";
import { ComparisonTable } from "@/features/membership/ComparisonTable";
import { TierCard } from "@/features/membership/TierCard";
import { useMember } from "@/hooks/useMember";
import { haptics } from "@/lib/haptics";
import { spacing } from "@/theme";

export default function MembershipScreen() {
  const router = useRouter();
  const { user, isSignedIn } = useMember();
  const [selected, setSelected] = useState(null);
  const [requested, setRequested] = useState(false);

  const choose = (tier) => {
    if (!isSignedIn) {
      router.push("/login");
      return;
    }
    setSelected(tier);
  };

  return (
    <Screen title="Membership" largeTitle>
      <View style={styles.hero}>
        <AppText variant="eyebrow" color="accent">
          {membershipCopy.eyebrow}
        </AppText>
        <BrandHeadline lines={["INVEST IN", "YOUR EVOLUTION."]} size="lg" accentLast />
        <AppText variant="body" color="textMuted">
          {membershipCopy.subheadline}
        </AppText>
      </View>

      <SectionHeader
        size="lg"
        title={membershipCopy.tiersTitle}
        subtitle={membershipCopy.tiersSubtitle}
      />
      {membershipTiers.map((tier) => (
        <TierCard
          key={tier.id}
          tier={tier}
          isCurrent={user?.tierId === tier.id}
          highlightLabel={membershipCopy.highlightLabel}
          onSelect={choose}
        />
      ))}

      <SectionHeader
        size="lg"
        title={membershipCopy.compareTitle}
        subtitle="Every tier includes all four pillars"
      />
      <ComparisonTable />

      <Card style={styles.trial}>
        <AppText variant="h3">{membershipCopy.trial.headline}</AppText>
        <AppText variant="small" color="textMuted">
          {membershipCopy.trial.body}
        </AppText>
        <Button
          label={isSignedIn ? "Talk to a coach" : membershipCopy.trial.primaryCta}
          fullWidth
          onPress={() => router.push(isSignedIn ? "/coaches" : "/login")}
        />
        {!isSignedIn ? (
          <Button
            label={membershipCopy.trial.secondaryCta}
            variant="secondary"
            fullWidth
            onPress={() => router.push("/coaches")}
          />
        ) : null}
      </Card>

      <Dialog
        visible={Boolean(selected)}
        title={selected ? `Switch to ${selected.name}?` : ""}
        message={
          selected
            ? `$${selected.price}/${selected.period}. In-app billing is coming soon — our team will confirm your change by email within a day.`
            : ""
        }
        confirmLabel="Request change"
        onConfirm={() => {
          setSelected(null);
          haptics.success();
          setRequested(true);
        }}
        onCancel={() => setSelected(null)}
      />
      <Dialog
        visible={requested}
        title="Request sent"
        message="We'll email you to confirm your new membership."
        confirmLabel="Done"
        hideCancel
        onConfirm={() => setRequested(false)}
        onCancel={() => setRequested(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: spacing.md },
  trial: { gap: spacing.md },
});
