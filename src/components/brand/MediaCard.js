/**
 * MediaCard — a rounded card with a photo or the looping brand video behind
 * its content and the website's dark cinematic gradient on top.
 *
 *   <MediaCard image={coach.portrait} height={420}>…content (bottom aligned)…</MediaCard>
 *   <MediaCard video={brandMedia.heroVideo} aspectRatio={4 / 5}>…</MediaCard>
 *   <MediaCard image={hero} mediaHeight={300}>…</MediaCard>   // photo band on top,
 *     fading into solid black; content starts on the fade so text never sits on a face
 *
 * Content sits at the bottom; buttons inside should use variant="brand" or
 * "outlineLight" (glass over media on iOS 26).
 */
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect } from "react";
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
  mediaHeight,
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
    band: {
      colors: ["rgba(8,95,112,0.22)", "rgba(5,5,5,0.12)", "rgba(5,5,5,0.78)", palette.black],
      locations: [0, 0.4, 0.78, 1],
    },
  }[mediaHeight ? "band" : gradient];

  const mediaStyle = mediaHeight ? [styles.band, { height: mediaHeight }] : StyleSheet.absoluteFill;
  const contentInset = mediaHeight
    ? { paddingTop: Math.max(padding, mediaHeight - BAND_OVERLAP) }
    : null;

  const content = (
    <>
      {video ? <LoopingVideo source={video} style={mediaStyle} /> : null}
      {image ? (
        <Image
          source={image}
          style={mediaStyle}
          contentFit="cover"
          contentPosition={imagePosition}
          transition={250}
        />
      ) : null}
      <LinearGradient pointerEvents="none" style={mediaStyle} {...gradients} />
      <View style={[styles.content, { padding, gap }, contentInset]}>{children}</View>
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

/** Muted brand loop that only plays while its screen is visible (saves battery). */
function LoopingVideo({ source, style }) {
  const isFocused = useIsFocused();
  const player = useVideoPlayer(source, (instance) => {
    instance.loop = true;
    instance.muted = true;
  });

  useEffect(() => {
    if (isFocused) player.play();
    else player.pause();
  }, [isFocused, player]);

  return (
    <VideoView
      player={player}
      style={style}
      contentFit="cover"
      nativeControls={false}
      allowsPictureInPicture={false}
      pointerEvents="none"
    />
  );
}

/** How far content rises into the bottom of the photo band (onto the dark fade). */
const BAND_OVERLAP = 72;

const styles = StyleSheet.create({
  band: { position: "absolute", top: 0, left: 0, right: 0 },
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
