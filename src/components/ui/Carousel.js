/**
 * Carousel — a horizontal, snapping row of cards that bleeds past the page
 * gutter (App Store / Fitness style), with optional page dots.
 *
 *   <Carousel itemWidth={260} data={coaches} keyExtractor={(c) => c.id}
 *     renderItem={(coach) => <CoachCard coach={coach} />} />
 *
 *   <Carousel paging dots data={stories} renderItem={…} />   // one item per page
 */
import { useState } from "react";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { GUTTER, spacing } from "@/theme";

export function Carousel({
  data,
  renderItem,
  keyExtractor = (item, index) => item.id ?? String(index),
  itemWidth,
  gap = spacing.md,
  paging = false,
  dots = false,
  style,
}) {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const [page, setPage] = useState(0);
  const cardWidth = paging ? width - GUTTER * 2 : (itemWidth ?? Math.min(280, width * 0.72));
  const interval = cardWidth + gap;

  return (
    <View style={style}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={interval}
        snapToAlignment="start"
        disableIntervalMomentum={paging}
        contentContainerStyle={[styles.row, { gap, paddingHorizontal: GUTTER }]}
        style={styles.bleed}
        scrollEventThrottle={32}
        onScroll={
          dots
            ? (event) => {
                const next = Math.round(event.nativeEvent.contentOffset.x / interval);
                if (next !== page) setPage(Math.max(0, Math.min(data.length - 1, next)));
              }
            : undefined
        }
      >
        {data.map((item, index) => (
          <View key={keyExtractor(item, index)} style={{ width: cardWidth }}>
            {renderItem(item, index)}
          </View>
        ))}
      </ScrollView>
      {dots && data.length > 1 ? (
        <View style={styles.dots} accessibilityLabel={`Page ${page + 1} of ${data.length}`}>
          {data.map((item, index) => (
            <View
              key={keyExtractor(item, index)}
              style={[
                styles.dot,
                {
                  backgroundColor: index === page ? colors.text : colors.borderStrong,
                  width: index === page ? 18 : 6,
                },
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bleed: { marginHorizontal: -GUTTER },
  row: { alignItems: "stretch" },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: spacing.md,
  },
  dot: { height: 6, borderRadius: 3 },
});
