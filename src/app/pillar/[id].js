/**
 * Pillar page — /pillar/physical · /pillar/athletic · /pillar/nutrition · /pillar/mental
 * Web equivalent: /physical-performance, /athletic-performance, /rev-nutrition,
 * /mental-wellness — hero, the pillar's sections, what's included, closing CTA.
 *
 * Public: visitors can read everything; member tools ask them to sign in.
 */
import { useLocalSearchParams } from "expo-router";
import { useHeaderHeight } from "expo-router/react-navigation";
import { useRef } from "react";
import { IS_IOS } from "@/lib/platform";
import { EmptyState, Screen } from "@/components/ui";
import { ecosystemDimensions } from "@/constants/brand";
import { getPillarById, pillarFinalCtas, pillarHeroes } from "@/constants/pillars";
import { AthleticPillar } from "@/features/pillars/AthleticPillar";
import { MentalPillar } from "@/features/pillars/MentalPillar";
import { NutritionPillar } from "@/features/pillars/NutritionPillar";
import { PhysicalPillar } from "@/features/pillars/PhysicalPillar";
import { FinalCta, IncludedCard, PillarHero } from "@/features/pillars/PillarParts";
import { useMemberLink } from "@/hooks/useMemberLink";

export default function PillarScreen() {
  const { id } = useLocalSearchParams();
  const go = useMemberLink();
  const scrollRef = useRef(null);
  const anchor = useRef(0);
  const headerHeight = useHeaderHeight();
  const pillar = getPillarById(id);

  if (!pillar) {
    return (
      <Screen title="Pillar">
        <EmptyState
          icon="compass"
          title="Pillar not found"
          message="Try Explore for all four pillars."
        />
      </Screen>
    );
  }

  const hero = pillarHeroes[pillar.id];
  const cta = pillarFinalCtas[pillar.id];
  const image = ecosystemDimensions.pillars.find((item) => item.id === pillar.id)?.image;
  const scrollToAnchor = () => scrollRef.current?.scrollTo({ y: anchor.current, animated: true });
  const captureAnchor = (event) => {
    // iOS content scrolls under the translucent bar, so offset by its height.
    anchor.current = event.nativeEvent.layout.y - (IS_IOS ? headerHeight : 0) - 12;
  };

  // Hero + closing CTAs per pillar (website destinations, mapped to app screens).
  const actions = {
    physical: {
      heroPrimary: () => go("/train"),
      heroSecondary: () => go("/coaches", true),
      ctaPrimary: () => go("/train"),
      ctaSecondary: () => go("/membership", true),
    },
    athletic: {
      heroPrimary: () => go("/membership", true),
      heroSecondary: scrollToAnchor,
      ctaPrimary: () => go("/membership", true),
      ctaSecondary: () => go("/coaches", true),
    },
    nutrition: {
      heroPrimary: () => go("/fuel"),
      heroSecondary: () => go("/assessment", true),
      ctaPrimary: () => go("/membership", true),
      ctaSecondary: () => go("/coaches/request?topic=nutrition"),
    },
    mental: {
      heroPrimary: () => go("/mind"),
      heroSecondary: scrollToAnchor,
      ctaPrimary: () => go("/membership", true),
      ctaSecondary: () => go("/ecosystem", true),
    },
  }[pillar.id];

  return (
    <Screen title={pillar.label} scrollRef={scrollRef}>
      <PillarHero
        hero={hero}
        image={image}
        onPrimary={actions.heroPrimary}
        onSecondary={actions.heroSecondary}
      />

      {pillar.id === "physical" ? <PhysicalPillar /> : null}
      {pillar.id === "athletic" ? <AthleticPillar onSportsLayout={captureAnchor} /> : null}
      {pillar.id === "nutrition" ? <NutritionPillar /> : null}
      {pillar.id === "mental" ? <MentalPillar onSessionsLayout={captureAnchor} /> : null}

      <IncludedCard items={pillar.items} />
      <FinalCta cta={cta} onPrimary={actions.ctaPrimary} onSecondary={actions.ctaSecondary} />
    </Screen>
  );
}
