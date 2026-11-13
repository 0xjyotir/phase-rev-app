/**
 * Smoke test: the public screens a visitor can reach without signing in
 * (welcome, login and the public ecosystem). Run with: npm test
 *
 * Native-only modules (video, glass, symbols) render as plain host views in
 * Jest; this checks our code paths, not native drawing.
 */
import { act, screen } from "@testing-library/react-native";
import { renderRouter } from "expo-router/testing-library";
import { useSessionStore } from "@/stores/session-store";

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

// d3-geo ships ESM-only (.mjs); the globe math is covered by its own module, not this smoke test.
jest.mock("@/features/nutrition/lib/world-map", () => ({
  getHighlightedCountries: () => new Set(),
  projectGlobe: () => ({ countries: [], graticule: "" }),
}));

jest.mock("expo-font", () => ({ useFonts: () => [true, null], isLoaded: () => true }));

jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: () => Promise.resolve(),
  hideAsync: () => Promise.resolve(),
}));

/** Lets the router, store hydration and effects settle. */
async function flush() {
  for (let i = 0; i < 4; i += 1) {
    await act(async () => {
      await Promise.resolve();
    });
  }
}

describe("guest routes render", () => {
  beforeAll(() => {
    useSessionStore.getState().clearSession();
  });

  test.each([
    ["/welcome", "Enter Rev"],
    ["/login", "Welcome back"],
    ["/discover", "Ready to start?"],
    ["/pillar/nutrition", "Rev Nutrition"],
    ["/coaches", "Coaches"],
    ["/membership", "Start your 7-day trial"],
  ])("%s", async (url, expected) => {
    await renderRouter("./src/app", { initialUrl: url });
    await flush();
    expect(screen.getAllByText(expected, { exact: false }).length).toBeGreaterThan(0);
  });
});
