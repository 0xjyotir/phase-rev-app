/**
 * Smoke test for the iOS 26 path: Liquid Glass available → native tabs with the
 * workout accessory, glass surfaces and native bar-button items.
 */
import { act, screen } from "@testing-library/react-native";
import { renderRouter } from "expo-router/testing-library";
import { DEMO_USER } from "@/constants/demo-account";
import { useProfileStore } from "@/stores/profile-store";
import { useSessionStore } from "@/stores/session-store";
import { useTrainingStore } from "@/stores/training-store";

jest.mock("@/lib/platform", () => ({
  IS_IOS: true,
  IS_ANDROID: false,
  IS_WEB: false,
  IOS_VERSION: 26,
  LIQUID_GLASS: true,
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
jest.mock("expo-video", () => {
  const { View } = require("react-native");
  return {
    useVideoPlayer: () => ({ play: jest.fn(), pause: jest.fn() }),
    VideoView: (props) => <View testID="video" {...props} />,
  };
});
jest.mock("expo-keep-awake", () => ({ useKeepAwake: jest.fn() }));
jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: () => Promise.resolve(),
  hideAsync: () => Promise.resolve(),
}));
jest.mock("@/features/nutrition/lib/world-map", () => ({
  getHighlightedCountries: () => new Set(),
  projectGlobe: () => ({ countries: [], graticule: "" }),
}));

async function flush() {
  for (let i = 0; i < 4; i += 1) {
    await act(async () => {
      await Promise.resolve();
    });
  }
}

beforeAll(() => {
  useProfileStore.getState().ensureProfile(DEMO_USER.id);
  useSessionStore.getState().setSession({ user: DEMO_USER, accessToken: null });
});

test.each([
  ["/", "At a glance"],
  ["/train", "Plan"],
  ["/fuel", "Meal log"],
  ["/mind", "Sessions & practices"],
  ["/explore", "Choose your level of support"],
  ["/profile", "Sign out"],
  ["/pillar/athletic", "Reaction training"],
])("glass %s", async (url, expected) => {
  useTrainingStore.getState().startWorkout("rt-pull");
  await renderRouter("./src/app", { initialUrl: url });
  await flush();
  expect(screen.getAllByText(expected, { exact: false }).length).toBeGreaterThan(0);
});
