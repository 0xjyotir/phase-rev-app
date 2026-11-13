/**
 * useReduceTransparency — mirrors iOS Settings → Accessibility → Display & Text Size →
 * Reduce Transparency. When it's on, glass surfaces render as solid materials.
 *
 * Always false on Android and web.
 */
import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";
import { IS_IOS } from "@/lib/platform";

export function useReduceTransparency() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!IS_IOS) return undefined;
    let mounted = true;
    AccessibilityInfo.isReduceTransparencyEnabled()
      .then((value) => mounted && setEnabled(Boolean(value)))
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener("reduceTransparencyChanged", (value) =>
      setEnabled(Boolean(value)),
    );
    return () => {
      mounted = false;
      subscription?.remove?.();
    };
  }, []);

  return enabled;
}
