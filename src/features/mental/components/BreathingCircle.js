/**
 * BreathingCircle — the animated breathing ring (web: `animate-breathe-ring`).
 *
 * Runs through a pattern's phases (inhale → hold → exhale …), animating the
 * circle's scale to each phase's `scale` over that phase's duration.
 *
 *   <BreathingCircle pattern={pattern} running={running} onCycle={() => setCycles(c => c + 1)} />
 *
 * When `running` is false it gently "breathes" on its own as a preview.
 */
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Platform, StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { useTheme } from "@/providers/ThemeProvider";

const MIN_SCALE = 0.6;
/** The native animation driver doesn't exist on web; fall back to JS there. */
const USE_NATIVE_DRIVER = Platform.OS !== "web";

export function BreathingCircle({ pattern, running, size = 220, onCycle, onPhase }) {
  const { colors } = useTheme();
  // useState initializer creates the Animated.Value exactly once per mount.
  const [scale] = useState(() => new Animated.Value(MIN_SCALE));
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(pattern.phases[0].seconds);
  const onCycleRef = useRef(onCycle);
  const onPhaseRef = useRef(onPhase);

  useEffect(() => {
    onCycleRef.current = onCycle;
    onPhaseRef.current = onPhase;
  }, [onCycle, onPhase]);

  // Idle preview: slow 4s in / 4s out loop.
  useEffect(() => {
    if (running) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(scale, {
          toValue: MIN_SCALE,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [running, scale]);

  // Guided mode: step through the phases.
  useEffect(() => {
    if (!running) return undefined;
    let cancelled = false;
    let timer;
    let index = 0;

    const runPhase = () => {
      if (cancelled) return;
      const phase = pattern.phases[index];
      setPhaseIndex(index);
      setSecondsLeft(phase.seconds);
      onPhaseRef.current?.(phase);

      Animated.timing(scale, {
        toValue: phase.scale,
        duration: phase.seconds * 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();

      let remaining = phase.seconds;
      const tick = () => {
        remaining -= 1;
        if (cancelled) return;
        if (remaining > 0) {
          setSecondsLeft(remaining);
          timer = setTimeout(tick, 1000);
        } else {
          index = (index + 1) % pattern.phases.length;
          if (index === 0) onCycleRef.current?.();
          runPhase();
        }
      };
      timer = setTimeout(tick, 1000);
    };

    runPhase();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      scale.stopAnimation();
    };
  }, [running, pattern, scale]);

  const phase = pattern.phases[phaseIndex];

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.accentSoft,
            borderColor: colors.accent,
            shadowColor: colors.accent,
            shadowOpacity: 0.5,
            shadowRadius: size / 8,
            shadowOffset: { width: 0, height: 0 },
            transform: [{ scale }],
          },
        ]}
      />
      <View
        style={[
          styles.inner,
          {
            width: size * 0.42,
            height: size * 0.42,
            borderRadius: size,
            borderColor: colors.border,
          },
        ]}
      />
      <View style={styles.label}>
        <AppText variant="h3" align="center">
          {running ? phase.label : "Breathe"}
        </AppText>
        {running ? (
          <AppText variant="timer" color="accentStrong" align="center" tabular>
            {secondsLeft}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", justifyContent: "center", alignSelf: "center" },
  ring: { position: "absolute", borderWidth: 2 },
  inner: { position: "absolute", borderWidth: 1 },
  label: { alignItems: "center" },
});
