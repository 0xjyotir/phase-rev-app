/**
 * Home tab — its own native stack (large title, glass navigation bar).
 * See components/navigation/TabStack.js.
 */
import { TabStack } from "@/components/navigation/TabStack";

export default function HomeTabLayout() {
  return <TabStack title="Today" />;
}
