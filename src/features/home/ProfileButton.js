/**
 * ProfileButton — the member's avatar in the navigation bar (top-right of
 * Today and Explore), the iOS-standard place for "your account". Tap → /profile.
 */
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Avatar } from "@/components/ui";
import { useMember } from "@/hooks/useMember";
import { haptics } from "@/lib/haptics";

export function ProfileButton({ size = 34 }) {
  const router = useRouter();
  const { user } = useMember();

  return (
    <Pressable
      onPress={() => {
        haptics.tap();
        router.push("/profile");
      }}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Profile and settings"
      style={({ pressed }) => pressed && { opacity: 0.7 }}
    >
      <Avatar name={user?.displayName ?? "Guest"} size={size} />
    </Pressable>
  );
}

/** Header action descriptor for <Screen headerActions>. */
export const profileHeaderAction = {
  element: <ProfileButton />,
  hidesSharedBackground: true,
};
