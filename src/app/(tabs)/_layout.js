/**
 * Bottom tabs — the five member areas.
 *
 *   Home    → (tabs)/index.js    dashboard ("Rev overview" on the web)
 *   Train   → (tabs)/train.js    workouts: Today · Library · Progress
 *   Fuel    → (tabs)/fuel.js     Rev Nutrition
 *   Mind    → (tabs)/mind.js     Mental wellness
 *   Profile → (tabs)/profile.js  account, assessment, coaches, membership, settings
 *
 * The custom tab bar adds a "workout in progress" pill above the tabs so a
 * live session is always one tap away, whatever tab you're on.
 */
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs, BottomTabBar } from "expo-router/js-tabs";
import { View } from "react-native";
import { ActiveWorkoutPill } from "@/features/workouts/components/ActiveWorkoutPill";
import { useTheme } from "@/providers/ThemeProvider";
import { fonts } from "@/theme";

const TABS = [
  { name: "index", title: "Home", icon: "home-variant-outline", iconActive: "home-variant" },
  { name: "train", title: "Train", icon: "dumbbell", iconActive: "dumbbell" },
  { name: "fuel", title: "Fuel", icon: "food-apple-outline", iconActive: "food-apple" },
  { name: "mind", title: "Mind", icon: "meditation", iconActive: "meditation" },
  {
    name: "profile",
    title: "Profile",
    icon: "account-circle-outline",
    iconActive: "account-circle",
  },
];

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => (
        <View>
          <ActiveWorkoutPill />
          <BottomTabBar {...props} />
        </View>
      )}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11 },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons
                name={focused ? tab.iconActive : tab.icon}
                size={size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
