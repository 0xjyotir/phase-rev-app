/**
 * Haptics wrapper — respects Profile → Settings → Haptics and never throws
 * (web and some Android devices have no haptic engine).
 *
 *   haptics.tap()      light tick for buttons/toggles
 *   haptics.success()  set completed, session finished
 *   haptics.warning()  rest timer finished
 */
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { usePreferencesStore } from "@/stores/preferences-store";

function enabled() {
  return Platform.OS !== "web" && usePreferencesStore.getState().hapticsEnabled;
}

function safely(run) {
  if (!enabled()) return;
  run().catch(() => {});
}

export const haptics = {
  tap: () => safely(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  select: () => safely(() => Haptics.selectionAsync()),
  success: () => safely(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning: () => safely(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
};
