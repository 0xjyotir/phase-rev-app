/**
 * MediaCard — a rounded card with a photo or the looping brand video behind
 * its content and the website's dark cinematic gradient on top.
 *
 *   <MediaCard image={coach.portrait} height={420}>…content (bottom aligned)…</MediaCard>
 *   <MediaCard video={brandMedia.heroVideo} aspectRatio={4 / 5}>…</MediaCard>
 *
 * Content sits at the bottom; buttons inside should use variant="brand" or
 * "outlineLight" (glass over media on iOS 26).
 */
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer, VideoView } from "expo-video";
import { Pressable, StyleSheet, View } from "react-native";
import { haptics } from "@/lib/haptics";
import { palette, radius, spacing } from "@/theme";

export function MediaCard({
  image,
  video,
  imagePosition = "top",
  height,
  aspectRatio,
  onPress,
  children,
  padding = spacing.xl,
  gap = spacing.md,
  gradient = "bottom",
  style,
  accessibilityLabel,
}) {
  const box = [
    styles.card,
    height ? { height } : null,
    aspectRatio ? { aspectRatio } : null,
    style,
  ];

  const gradients = {
    bottom: {
      colors: ["rgba(5,5,5,0.05)", "rgba(5,5,5,0.35)", "rgba(5,5,5,0.92)"],
      locations: [0, 0.45, 1],
    },
    left: {
      colors: ["rgba(5,6,7,0.95)", "rgba(5,6,7,0.7)", "rgba(5,6,7,0.25)"],
      locations: [0, 0.55, 1],
      start: { x: 0, y: 0.5 },
      end: { x: 1, y: 0.5 },
    },
    full: {
      colors: ["rgba(8,95,112,0.35)", "rgba(5,5,5,0.55)", "rgba(5,5,5,0.94)"],
      locations: [0, 0.45, 1],
    },
  }[gradient];

  const content = (
    <>
      {video ? <LoopingVideo source={video} /> : null}
      {image ? (
        <Image
          source={image}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          contentPosition={imagePosition}
          transition={250}
        />
      ) : null}
      <LinearGradient pointerEvents="none" style={StyleSheet.absoluteFill} {...gradients} />
      <View style={[styles.content, { padding, gap }]}>{children}</View>
    </>
  );

  if (!onPress) {
    return (
      <View style={box} accessibilityLabel={accessibilityLabel}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => {
        haptics.tap();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [box, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

function LoopingVideo({ source }) {
  const player = useVideoPlayer(source, (instance) => {
    instance.loop = true;
    instance.muted = true;
    instance.play();
  });
  return (
    <VideoView
      player={player}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      nativeControls={false}
      allowsPictureInPicture={false}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderCurve: "continuous",
    overflow: "hidden",
    backgroundColor: palette.black,
    justifyContent: "flex-end",
  },
  content: {},
  pressed: { opacity: 0.94, transform: [{ scale: 0.985 }] },
});
