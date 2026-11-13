/**
 * Smoke test: renders every route of the real app (src/app) with the demo
 * member signed in, and fails on any render error. Run with: npm test
 *
 * Native-only modules (video, glass, symbols) render as plain host views in
 * Jest; this checks our code paths, not native drawing.
 */
import { act, screen } from "@testing-library/react-native";
import { renderRouter } from "expo-router/testing-library";
import { DEMO_USER } from "@/constants/demo-account";
import { useProfileStore } from "@/stores/profile-store";
import { useSessionStore } from "@/stores/session-store";
import { useTrainingStore } from "@/stores/training-store";

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

const MEMBER_ROUTES = [
  ["/", "Good"],
  ["/train", "Plan"],
  ["/train?view=library", "Exercises"],
  ["/train?view=library&sub=routines", "Create routine"],
  ["/train?view=progress", "Strength"],
  ["/train?view=progress&sub=history", "sessions logged"],
  ["/train?view=progress&sub=body", "Body weight"],
  ["/fuel", "Meal log"],
  ["/mind", "How are you today?"],
  ["/explore", "Four pillars, one membership"],
  ["/profile", "Membership"],
  ["/exercise/barbell-bench-press", "Technique"],
  ["/coaches", "Meet the people behind the performance."],
  ["/coaches/selva", "Approach"],
  ["/coaches/request?coachId=selva", "FORMAT"],
  ["/coaches/request?topic=nutrition", "Dr. Rahul Nair"],
  ["/membership", "Compare features"],
  ["/ecosystem", "The four pillars"],
  ["/pillar/physical", "Strength Foundations"],
  ["/pillar/athletic", "Reaction training"],
  ["/pillar/nutrition", "Every gram counted"],
  ["/pillar/mental", "Wellbeing check"],
  ["/assessment", "Body metrics"],
  ["/breathing?pattern=box", "Box breathing"],
  ["/session/deep-focus", "Deep Focus"],
  ["/session/visualization", "Visualization"],
  ["/reaction", "Reaction drill"],
  ["/journal", "Evening reflection"],
  ["/journal/new?set=evening", "What went well today?"],
  ["/reframe", "What happened?"],
  ["/wellbeing", "Five quick statements"],
  ["/meal/new", "Add to today"],
  ["/routine/new", "Training type"],
  ["/discover", "Members, in their words"],
];

function signInDemo() {
  useProfileStore.getState().ensureProfile(DEMO_USER.id);
  useSessionStore.getState().setSession({ user: DEMO_USER, accessToken: null });
}

beforeEach(() => {
  useTrainingStore.getState().resetTraining();
});

describe("member routes render", () => {
  beforeAll(signInDemo);

  test.each(MEMBER_ROUTES)("%s", async (url, expected) => {
    await renderRouter("./src/app", { initialUrl: url });
    await flush();
    expect(screen.getAllByText(expected, { exact: false }).length).toBeGreaterThan(0);
  });

  test("history entry renders", async () => {
    const entry = useTrainingStore.getState().history[0];
    await renderRouter("./src/app", { initialUrl: `/history/${entry.id}` });
    await flush();
    expect(screen.getAllByText("Exercises", { exact: false }).length).toBeGreaterThan(0);
  });

  test("live workout + session complete render", async () => {
    // Store updates before mounting don't need act().
    useTrainingStore.getState().startWorkout("rt-push");
    await renderRouter("./src/app", { initialUrl: "/workout/active" });
    await flush();
    expect(screen.getAllByText("Finish workout").length).toBeGreaterThan(0);
  });

  test("session complete renders", async () => {
    const store = useTrainingStore.getState();
    store.startWorkout("rt-push");
    const session = useTrainingStore.getState().activeSession.session;
    useTrainingStore.getState().completeSet(session.exercises[0].id, 0);
    useTrainingStore.getState().finishWorkout();
    await renderRouter("./src/app", { initialUrl: "/workout/complete" });
    await flush();
    expect(screen.getAllByText("SESSION COMPLETE").length).toBeGreaterThan(0);
  });
});
