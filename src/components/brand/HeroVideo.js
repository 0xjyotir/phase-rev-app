/**
 * HeroVideo — full-bleed looping, muted background video with the brand
 * gradient on top (same asset as the website hero: herophaserev.mp4).
 *
 *   <HeroVideo source={brandMedia.heroVideo}>
 *     …content drawn over the video…
 *   </HeroVideo>
 *
 * Uses expo-video (expo-av is no longer the recommended video module).
 */
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer, VideoView } from "expo-video";
import { StyleSheet, View } from "react-native";
import { palette } from "@/theme";

export function HeroVideo({ source, children, style }) {
  const player = useVideoPlayer(source, (instance) => {
    instance.loop = true;
    instance.muted = true;
    instance.play();
  });

  return (
    <View style={[styles.root, style]}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
        allowsPictureInPicture={false}
        pointerEvents="none"
      />
      {/* Teal glow from the top + deep black fade at the bottom = website hero look */}
      <LinearGradient
        colors={["rgba(8,95,112,0.35)", "rgba(5,5,5,0.25)", "rgba(5,5,5,0.92)", palette.black]}
        locations={[0, 0.35, 0.72, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: "hidden", backgroundColor: palette.black },
});
