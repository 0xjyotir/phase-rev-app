/**
 * Platform capabilities, resolved once at startup.
 *
 *   IS_IOS / IS_ANDROID / IS_WEB   plain platform flags
 *   LIQUID_GLASS                   true on iOS 26+ where Apple's Liquid Glass API exists
 *
 * Liquid Glass drives the whole iOS look: native tab bar, glass navigation bars,
 * glass cards and glass buttons. Everywhere else (iOS 18 and earlier, Android,
 * web) the same components fall back to solid, platform-appropriate surfaces.
 *
 * Users who turn on Settings → Accessibility → Reduce Transparency still get
 * solid surfaces — see hooks/useReduceTransparency.js.
 */
import { isGlassEffectAPIAvailable, isLiquidGlassAvailable } from "expo-glass-effect";
import { Platform } from "react-native";

export const IS_IOS = Platform.OS === "ios";
export const IS_ANDROID = Platform.OS === "android";
export const IS_WEB = Platform.OS === "web";

/** Major iOS version (e.g. 26), or 0 on other platforms. */
export const IOS_VERSION = IS_IOS ? parseInt(String(Platform.Version), 10) || 0 : 0;

function detectLiquidGlass() {
  if (!IS_IOS) return false;
  try {
    // Both checks: some iOS 26 betas report glass as available but lack the API.
    return isLiquidGlassAvailable() && isGlassEffectAPIAvailable();
  } catch {
    return false;
  }
}

/** True when the device can render native Liquid Glass (iOS 26+). */
export const LIQUID_GLASS = detectLiquidGlass();
