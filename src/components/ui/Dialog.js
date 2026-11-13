/**
 * Dialog — confirm / info modal that works on iOS, Android AND web.
 * (React Native's Alert.alert does nothing on web, so we draw our own.)
 *
 *   <Dialog
 *     visible={confirmOpen}
 *     title="Finish workout?"
 *     message="12 of 15 sets logged."
 *     confirmLabel="Finish"
 *     onConfirm={finish}
 *     onCancel={() => setConfirmOpen(false)}
 *   />
 *
 * `destructive` paints the confirm button red (e.g. "Discard workout").
 * Pass `children` for custom content (e.g. a form) between message and buttons.
 */
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useThemedStyles } from "@/providers/ThemeProvider";
import { GUTTER, radius, spacing } from "@/theme";
import { AppText } from "./AppText";
import { Button } from "./Button";

export function Dialog({
  visible,
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  destructive = false,
  hideCancel = false,
  children,
}) {
  const styles = useThemedStyles(createStyles);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onCancel} accessibilityLabel="Close dialog">
        {/* Inner Pressable swallows taps so tapping the card doesn't close it. */}
        <Pressable style={styles.card} onPress={() => {}}>
          <AppText variant="h3">{title}</AppText>
          {message ? (
            <AppText variant="body" color="textMuted">
              {message}
            </AppText>
          ) : null}
          {children}
          <View style={styles.actions}>
            {!hideCancel ? (
              <Button
                label={cancelLabel}
                variant="secondary"
                onPress={onCancel}
                style={styles.action}
              />
            ) : null}
            <Button
              label={confirmLabel}
              variant={destructive ? "danger" : "primary"}
              onPress={onConfirm}
              style={styles.action}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      justifyContent: "center",
      padding: GUTTER,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: spacing.xxl,
      gap: spacing.md,
      width: "100%",
      maxWidth: 440,
      alignSelf: "center",
    },
    actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
    action: { flex: 1, alignSelf: "stretch" },
  });
