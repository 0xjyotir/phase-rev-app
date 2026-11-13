/**
 * ListSection — an inset-grouped list section (iOS Settings style):
 * optional header above, rounded glass/solid group, hairline separators
 * inset past the icon, optional footer note below.
 *
 *   <ListSection header="Account" footer="Settings are stored on this device.">
 *     <ListRow icon="users" title="Coaches" onPress={…} />
 *     <ListRow icon="award" title="Membership" onPress={…} />
 *   </ListSection>
 */
import { Children, Fragment, isValidElement } from "react";
import { StyleSheet, View } from "react-native";
import { spacing } from "@/theme";
import { AppText } from "./AppText";
import { Divider } from "./Divider";
import { Surface } from "./Surface";

export function ListSection({ header, footer, children, inset = 58, style }) {
  const rows = Children.toArray(children).filter(isValidElement);

  return (
    <View style={[styles.wrapper, style]}>
      {header ? (
        <AppText variant="captionStrong" color="textMuted" style={styles.header}>
          {header.toUpperCase()}
        </AppText>
      ) : null}
      <Surface solid style={styles.group}>
        {rows.map((row, index) => (
          <Fragment key={row.key ?? index}>
            {index > 0 ? <Divider inset={inset} /> : null}
            {row}
          </Fragment>
        ))}
      </Surface>
      {footer ? (
        <AppText variant="caption" color="textMuted" style={styles.footer}>
          {footer}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
  header: { paddingHorizontal: spacing.lg, letterSpacing: 0.4 },
  group: { overflow: "hidden" },
  footer: { paddingHorizontal: spacing.lg },
});
