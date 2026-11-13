/**
 * The five member tabs.
 *
 *   Today    → (home)/index      daily hub ("Rev overview" on the web)
 *   Train    → (train)/train     workouts: Today · Library · Progress
 *   Fuel     → (fuel)/fuel       Rev Nutrition
 *   Mind     → (mind)/mind       Mental wellness
 *   Explore  → (explore)/explore the whole Phase Rev ecosystem (the website's story,
 *                                pillars, coaches, membership, community)
 *
 * iOS 26+  → the system tab bar (NativeTabs): Liquid Glass, SF Symbols, it
 *            minimises while you scroll, and a live workout appears as the tab
 *            bar accessory — exactly like Music's mini player.
 * elsewhere → JavaScript tabs with a solid bar and a floating "Resume" pill
 *            (Android, iOS 18 and earlier, web).
 *
 * Each tab hosts its own native stack (see (group)/_layout.js) for large titles.
 */
import { BottomTabBar, Tabs } from "expo-router/js-tabs";
import { NativeTabs } from "expo-router/native-tabs";
import { View } from "react-native";
import { Icon } from "@/components/ui";
import { ActiveWorkoutPill } from "@/features/workouts/components/ActiveWorkoutPill";
import { useActiveSession } from "@/features/workouts/hooks/useTraining";
import { LIQUID_GLASS } from "@/lib/platform";
import { useTheme } from "@/providers/ThemeProvider";
import { fonts } from "@/theme";

const TABS = [
  { name: "(home)", title: "Today", sf: ["house", "house.fill"], md: "home", icon: "home" },
  {
    name: "(train)",
    title: "Train",
    sf: ["dumbbell", "dumbbell.fill"],
    md: "fitness_center",
    icon: "dumbbell",
  },
  { name: "(fuel)", title: "Fuel", sf: ["fork.knife", "fork.knife"], md: "restaurant", icon: "fork" },
  {
    name: "(mind)",
    title: "Mind",
    sf: ["brain.head.profile", "brain.head.profile.fill"],
    md: "self_improvement",
    icon: "brain",
  },
  {
    name: "(explore)",
    title: "Explore",
    sf: ["safari", "safari.fill"],
    md: "explore",
    icon: "compass",
  },
];

export default function TabsLayout() {
  return LIQUID_GLASS ? <GlassTabs /> : <ClassicTabs />;
}

/** iOS 26+: the native UITabBar with Liquid Glass. */
function GlassTabs() {
  const { colors } = useTheme();
  const { activeSession } = useActiveSession();

  return (
    <NativeTabs tintColor={colors.accent} minimizeBehavior="onScrollDown">
      {activeSession ? (
        <NativeTabs.BottomAccessory>
          <WorkoutAccessory />
        </NativeTabs.BottomAccessory>
      ) : null}
      {TABS.map((tab) => (
        <NativeTabs.Trigger key={tab.name} name={tab.name}>
          <NativeTabs.Trigger.Icon sf={{ default: tab.sf[0], selected: tab.sf[1] }} md={tab.md} />
          <NativeTabs.Trigger.Label>{tab.title}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}

function WorkoutAccessory() {
  const placement = NativeTabs.BottomAccessory.usePlacement();
  return <ActiveWorkoutPill variant="accessory" placement={placement} />;
}

/** Android, iOS 18 and earlier, web: JavaScript tabs + floating resume pill. */
function ClassicTabs() {
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => (
        <View>
          <ActiveWorkoutPill variant="floating" />
          <BottomTabBar {...props} />
        </View>
      )}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.separator,
        },
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11, fontWeight: "600" },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => <Icon name={tab.icon} size={size - 2} color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}
