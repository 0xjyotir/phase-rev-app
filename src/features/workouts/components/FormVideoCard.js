/**
 * FormVideoCard — "Watch form" player for an exercise.
 *
 * Until per-exercise videos are recorded, every exercise plays the brand
 * training clip (the web build does the same: url "/herophaserev.mp4").
 * Swap `FORM_VIDEO_PLACEHOLDER` for `exercise.videoUrl` when they exist.
 */
import { useVideoPlayer, VideoView } from "expo-video";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppText, Card, Icon } from "@/components/ui";
import { FORM_VIDEO_PLACEHOLDER } from "@/constants/exercises";
import { palette, radius, spacing } from "@/theme";

export function FormVideoCard({ exerciseName }) {
  const [playing, setPlaying] = useState(false);
  const player = useVideoPlayer(FORM_VIDEO_PLACEHOLDER, (instance) => {
    instance.loop = true;
    instance.muted = true;
  });

  const start = () => {
    setPlaying(true);
    player.play();
  };

  return (
    <Card padding="none">
      <View style={styles.frame}>
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          nativeControls={playing}
        />
        {!playing ? (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={start}
            accessibilityRole="button"
            accessibilityLabel={`Watch ${exerciseName} form`}
          >
            <LinearGradient
              colors={["rgba(5,5,5,0.1)", "rgba(5,5,5,0.75)"]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.overlay}>
              <View style={styles.playButton}>
                <Icon name="play" size={24} color={palette.cyanInk} />
              </View>
              <AppText variant="smallStrong" color={palette.navText}>
                Watch form
              </AppText>
            </View>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.caption}>
        <Icon name="info" size={14} color="textMuted" />
        <AppText variant="caption" color="textMuted" style={styles.flex}>
          Preview clip — coach-recorded technique videos are coming soon.
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  frame: { aspectRatio: 16 / 10, backgroundColor: palette.black },
  overlay: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.sm },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: palette.cyan,
    alignItems: "center",
    justifyContent: "center",
  },
  caption: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md },
  flex: { flex: 1 },
});
