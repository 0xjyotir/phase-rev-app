/**
 * useMemberLink — navigation that respects the website's member gating.
 *
 *   const go = useMemberLink();
 *   go("/train")            // members: switches to the Train tab · visitors: sign-in
 *   go("/membership", true) // public destination: always opens
 *
 * Public pages (pillars, coaches, memberships) are browsable by everyone;
 * anything that reads or writes member data asks visitors to sign in first —
 * the app's version of the website's MemberPreviewGate.
 *
 * Tab destinations close any screens stacked above the tabs and switch tab,
 * instead of pushing a second copy of the tabs on top of the current screen.
 */
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useMember } from "./useMember";

const TAB_ROUTES = new Set(["/", "/train", "/fuel", "/mind", "/explore"]);

export function isTabRoute(href) {
  const path = typeof href === "string" ? href.split("?")[0] : href?.pathname;
  return TAB_ROUTES.has(path);
}

export function useMemberLink() {
  const router = useRouter();
  const { isSignedIn } = useMember();

  return useCallback(
    (href, isPublic = false) => {
      if (!isPublic && !isSignedIn) {
        router.push("/login");
        return;
      }
      if (isTabRoute(href)) {
        // From a screen pushed above the tabs: return to the tabs first, then switch.
        if (router.canDismiss()) router.dismissAll();
        router.navigate(href);
      } else {
        router.push(href);
      }
    },
    [router, isSignedIn],
  );
}
