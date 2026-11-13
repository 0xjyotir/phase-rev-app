/**
 * GlassGroup — groups neighbouring Liquid Glass controls so they blend and
 * morph into each other like a system toolbar (SwiftUI's GlassEffectContainer).
 * On iOS 18 and earlier, Android and web it's a plain View.
 *
 *   <GlassGroup style={{ gap: 8 }}>
 *     <Button label="Back" variant="secondary" />
 *     <Button label="Continue" />
 *   </GlassGroup>
 */
import { GlassContainer } from "expo-glass-effect";
import { View } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";

export function GlassGroup({ spacing = 12, style, children, ...viewProps }) {
  const { glass } = useTheme();
  if (!glass) {
    return (
      <View style={style} {...viewProps}>
        {children}
      </View>
    );
  }
  return (
    <GlassContainer spacing={spacing} style={style} {...viewProps}>
      {children}
    </GlassContainer>
  );
}
