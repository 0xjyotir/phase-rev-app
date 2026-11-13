/**
 * Screen — standard page container.
 *
 * Handles: safe-area insets, background color, page gutter, optional scroll,
 * optional fixed header (rendered above the scroll area) and footer.
 *
 *   <Screen scroll header={<ScreenHeader title="Coaches" />}>
 *     …cards…
 *   </Screen>
 *
 * Props:
 *   scroll       wrap children in a ScrollView (default true)
 *   padded       apply horizontal gutter (default true)
 *   edges        safe-area edges to respect (tabs use ["top"]; the tab bar handles bottom)
 *   header       node rendered above the content, outside the scroll
 *   footer       node pinned to the bottom (e.g. a primary action)
 *   gap          vertical spacing between direct children
 *   contentStyle extra style for the content container
 *   background   override the page color (brand screens use pure black)
 *   keyboardAware lift content above the keyboard (forms)
 */
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, useThemedStyles } from "@/providers/ThemeProvider";
import { GUTTER, spacing } from "@/theme";

export function Screen({
  children,
  scroll = true,
  padded = true,
  edges = ["top", "bottom"],
  header,
  footer,
  gap = spacing.lg,
  contentStyle,
  scrollRef,
  keyboardAware = false,
  background,
  ...scrollProps
}) {
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);

  const content = scroll ? (
    <ScrollView
      ref={scrollRef}
      style={styles.flex}
      contentContainerStyle={[styles.content, padded && styles.padded, { gap }, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...scrollProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, padded && styles.padded, { gap }, contentStyle]}>{children}</View>
  );

  const body = keyboardAware ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: background ?? theme.colors.background }]}
      edges={edges}
    >
      {header}
      {body}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    root: { flex: 1 },
    flex: { flex: 1 },
    content: { paddingTop: spacing.sm, paddingBottom: spacing.huge },
    padded: { paddingHorizontal: GUTTER },
    footer: {
      paddingHorizontal: GUTTER,
      paddingTop: spacing.md,
      paddingBottom: spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
  });
