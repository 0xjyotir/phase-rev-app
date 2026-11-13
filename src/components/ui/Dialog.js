/**
 * Dialog — confirm / info prompt.
 *
 *   iOS / Android → the system alert (UIAlertController / Material dialog), so
 *                   confirmations look and behave exactly like the OS (Liquid
 *                   Glass alerts on iOS 26).
 *   web           → our own modal, because react-native-web has no Alert.
 *
 * Declarative API (unchanged for call sites):
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
 * `destructive` styles the confirm action red ("Discard workout").
 * Passing `children` (custom content) always uses the drawn modal.
 */
import { useEffect, useRef } from "react";
import { Alert, Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { useThemedStyles } from "@/providers/ThemeProvider";
import { GUTTER, radius, spacing } from "@/theme";
import { AppText } from "./AppText";
import { Button } from "./Button";
import { Surface } from "./Surface";

const ALERT_GAP_MS = 450;
let lastAlertAt = 0;

export function Dialog(props) {
  const useSystemAlert = Platform.OS !== "web" && !props.children;
  return useSystemAlert ? <SystemAlert {...props} /> : <DrawnDialog {...props} />;
}

function SystemAlert({
  visible,
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  destructive = false,
  hideCancel = false,
}) {
  const shownRef = useRef(false);
  // Keep the latest handlers without re-opening the alert on every render.
  const handlers = useRef({ onConfirm, onCancel });
  useEffect(() => {
    handlers.current = { onConfirm, onCancel };
  });

  useEffect(() => {
    if (!visible) {
      shownRef.current = false;
      return;
    }
    if (shownRef.current) return;
    shownRef.current = true;

    const buttons = [];
    if (!hideCancel) {
      buttons.push({ text: cancelLabel, style: "cancel", onPress: () => handlers.current.onCancel?.() });
    }
    buttons.push({
      text: confirmLabel,
      style: destructive ? "destructive" : "default",
      onPress: () => handlers.current.onConfirm?.(),
    });

    const show = () => {
      lastAlertAt = Date.now();
      Alert.alert(title ?? "", message, buttons, {
        cancelable: !hideCancel,
        onDismiss: () => handlers.current.onCancel?.(),
      });
    };
    // A dialog opened from another dialog's button waits for the first to finish
    // its dismiss animation, so the system never drops the second alert.
    const sinceLast = Date.now() - lastAlertAt;
    if (sinceLast < ALERT_GAP_MS) {
      let fired = false;
      const timer = setTimeout(() => {
        fired = true;
        show();
      }, ALERT_GAP_MS - sinceLast);
      return () => {
        clearTimeout(timer);
        if (!fired) shownRef.current = false; // never shown — let the next run schedule it
      };
    }
    show();
    return undefined;
  }, [visible, title, message, confirmLabel, cancelLabel, destructive, hideCancel]);

  return null;
}

function DrawnDialog({
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
      visible={Boolean(visible)}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onCancel} accessibilityLabel="Close dialog">
        {/* Inner Pressable swallows taps so tapping the card doesn't close it. */}
        <Pressable onPress={() => {}} style={styles.wrap}>
          <Surface style={styles.card} solid>
            <AppText variant="h3" align="center">
              {title}
            </AppText>
            {message ? (
              <AppText variant="small" color="textMuted" align="center">
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
          </Surface>
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
    wrap: { width: "100%", maxWidth: 400, alignSelf: "center" },
    card: {
      padding: spacing.xxl,
      gap: spacing.md,
      borderRadius: radius.xl,
      backgroundColor: theme.colors.backgroundElevated,
    },
    actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
    action: { flex: 1, alignSelf: "stretch" },
  });
