/**
 * RegionGlobe — interactive SVG globe for regional meals.
 * Web: components/globe/svg-globe.tsx (same projection, colors and behavior).
 *
 *   - Drag to rotate (View responder props — no gesture library needed)
 *   - When the selected region changes, the globe glides to face it
 *   - Countries in the region glow cyan
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, G, Path, RadialGradient, Stop } from "react-native-svg";
import { getHighlightedCountries, projectGlobe } from "@/features/nutrition/lib/world-map";
import { useTheme } from "@/providers/ThemeProvider";

const GLIDE_MS = 650;
const DRAG_SENSITIVITY = 0.35; // degrees per pixel

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** Shortest way round the globe (e.g. 170° → -170° is 20°, not 340°). */
function shortestLngDelta(from, to) {
  return ((((to - from) % 360) + 540) % 360) - 180;
}

export function RegionGlobe({ region, size = 260 }) {
  const { colors } = useTheme();
  const radius = size / 2;
  const [center, setCenter] = useState({ lat: region.lat, lng: region.lng });
  const centerRef = useRef(center); // latest center, readable inside gesture/animation callbacks
  const frameRef = useRef(null); // running glide animation, so a drag can cancel it

  useEffect(() => {
    centerRef.current = center;
  }, [center]);

  // Glide to the newly selected region.
  useEffect(() => {
    const from = centerRef.current;
    const deltaLng = shortestLngDelta(from.lng, region.lng);
    const deltaLat = region.lat - from.lat;
    const startedAt = Date.now();

    const step = () => {
      const t = Math.min(1, (Date.now() - startedAt) / GLIDE_MS);
      const k = easeInOut(t);
      setCenter({ lat: from.lat + deltaLat * k, lng: from.lng + deltaLng * k });
      frameRef.current = t < 1 ? requestAnimationFrame(step) : null;
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [region.id, region.lat, region.lng]);

  // Drag to rotate. Handlers only touch refs when a gesture happens (never during render).
  const dragStart = useRef(null); // { x, y, center } captured when the finger goes down
  const dragHandlers = {
    onStartShouldSetResponder: () => true,
    onMoveShouldSetResponder: () => true,
    // Keep the gesture even if the surrounding ScrollView wants it.
    onResponderTerminationRequest: () => false,
    onResponderGrant: (event) => {
      cancelAnimationFrame(frameRef.current);
      const { pageX, pageY } = event.nativeEvent;
      dragStart.current = { x: pageX, y: pageY, center: centerRef.current };
    },
    onResponderMove: (event) => {
      const start = dragStart.current;
      if (!start) return;
      const dx = event.nativeEvent.pageX - start.x;
      const dy = event.nativeEvent.pageY - start.y;
      setCenter({
        lng: start.center.lng - dx * DRAG_SENSITIVITY,
        lat: Math.max(-70, Math.min(70, start.center.lat + dy * DRAG_SENSITIVITY)),
      });
    },
    onResponderRelease: () => {
      dragStart.current = null;
    },
  };

  const geometry = useMemo(() => projectGlobe(center, radius), [center, radius]);
  const highlighted = getHighlightedCountries(region.id, region.coverage);

  return (
    <View
      style={[styles.wrapper, { width: size, height: size }]}
      {...dragHandlers}
      accessibilityLabel={`Globe focused on ${region.name}. Drag to rotate.`}
    >
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="ocean" cx="40%" cy="35%" r="70%">
            <Stop offset="0" stopColor={colors.globeOcean} stopOpacity={1} />
            <Stop offset="1" stopColor={colors.background} stopOpacity={1} />
          </RadialGradient>
        </Defs>
        <Circle cx={radius} cy={radius} r={radius - 1} fill="url(#ocean)" />
        <Path d={geometry.graticule} stroke={colors.border} strokeWidth={0.5} fill="none" />
        <G>
          {geometry.countries.map((country) => {
            const isHighlighted = highlighted.has(country.index);
            return (
              <Path
                key={country.index}
                d={country.d}
                fill={isHighlighted ? colors.globeHighlight : colors.globeLand}
                stroke={isHighlighted ? colors.accent : colors.background}
                strokeWidth={isHighlighted ? 0.8 : 0.4}
              />
            );
          })}
        </G>
        <Circle
          cx={radius}
          cy={radius}
          r={radius - 1}
          fill="none"
          stroke={colors.borderStrong}
          strokeWidth={1}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignSelf: "center" },
});
