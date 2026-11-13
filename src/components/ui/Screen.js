/**
 * Screen — every page in the app, with the platform's own navigation chrome.
 *
 *   iOS      native navigation bar: Liquid Glass on iOS 26 (blurred material on
 *            older iOS), optional large title that collapses on scroll, SF Symbol
 *            bar buttons and native menus (see lib/header-items.js).
 *   Android  native Material top app bar for pushed screens; tab roots draw a
 *            large in-content title instead (Material "large top app bar").
 *
 * Variants:
 *   tab     a tab's root screen (Today, Train, Fuel, Mind, Explore) — large title,
 *           transparent page so the ambient light field shows through
 *   detail  a pushed screen (default) — small title (or `largeTitle`), soft top glow
 *   modal   a sheet — like detail, plus a Close button on the left
 *   bare    no navigation bar at all (full-bleed brand screens, focus modes)
 *
 *   <Screen variant="tab" title="Train" headerActions={[{ icon: "plus", label: "New routine", onPress }]}>
 *     …cards…
 *   </Screen>
 *
 * The ScrollView is the screen's first native child so iOS can collapse the
 * large title, apply the scroll-edge glass effect and minimise the tab bar.
 */
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFirstFocus } from "@/hooks/useFirstFocus";
import { toIosHeaderItems } from "@/lib/header-items";
import { IS_IOS, LIQUID_GLASS } from "@/lib/platform";
import { useTheme } from "@/providers/ThemeProvider";
import { fonts, GUTTER, spacing } from "@/theme";
import { AmbientBackground } from "./AmbientBackground";
import { AppText } from "./AppText";
import { GlassGroup } from "./GlassGroup";
import { HeaderActions } from "./HeaderActions";

const FOOTER_SPACE = 112;

export function Screen({
  children,
  variant = "detail",
  title,
  largeTitle,
  subtitle,
  headerActions,
  headerLeftActions,
  onClose,
  closeLabel = "Close",
  headerTransparent,
  headerTint,
  options,
  scroll = true,
  padded = true,
  gap = spacing.xl,
  contentStyle,
  footer,
  keyboardAware = false,
  scrollRef,
  glow,
  background,
  edges = ["top", "bottom"],
  lazy = false,
  ...scrollProps
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors, isDark } = theme;
  const focusedOnce = useFirstFocus();
  const showContent = !lazy || focusedOnce;

  const isTab = variant === "tab";
  const isBare = variant === "bare";
  const isModal = variant === "modal";
  const showGlow = glow ?? (!isTab && !isBare);
  const pageColor = background ?? (isTab ? "transparent" : colors.background);
  const inlineTitle = isTab && !IS_IOS; // Android/web tab roots draw their own title
  const close = onClose ?? (() => (router.canGoBack() ? router.back() : router.replace("/")));

  const leftActions = isModal
    ? [{ label: closeLabel, icon: "x", onPress: close }, ...(headerLeftActions ?? [])]
    : headerLeftActions;

  const stackOptions = buildOptions({
    variant,
    title,
    largeTitle: largeTitle ?? isTab,
    headerActions: inlineTitle ? undefined : headerActions,
    leftActions,
    headerTransparent,
    headerTint,
    theme,
    isDark,
    options,
  });

  const bottomPad =
    spacing.huge + (footer ? FOOTER_SPACE : 0) + (!IS_IOS && !isTab && !isBare ? insets.bottom : 0);
  const topPad = inlineTitle ? insets.top + spacing.lg : IS_IOS ? spacing.sm : spacing.lg;

  const inlineHeader = inlineTitle ? (
    <View style={styles.inlineHeader}>
      <View style={styles.inlineTitles}>
        <AppText variant="largeTitle" accessibilityRole="header">
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="small" color="textMuted">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <HeaderActions actions={headerActions} />
    </View>
  ) : null;

  const content = (
    <ScrollView
      ref={scrollRef}
      style={styles.flex}
      contentInsetAdjustmentBehavior={isBare ? "never" : "automatic"}
      automaticallyAdjustKeyboardInsets={keyboardAware}
      keyboardDismissMode={keyboardAware ? "interactive" : "on-drag"}
      keyboardShouldPersistTaps="handled"
      alwaysBounceVertical={scroll}
      scrollEnabled={scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad, paddingBottom: scroll ? bottomPad : spacing.lg, gap },
        padded && styles.padded,
        !scroll && styles.fill,
        contentStyle,
      ]}
      {...scrollProps}
    >
      {showGlow ? <AmbientBackground variant="top" /> : null}
      {inlineHeader}
      {showContent ? children : null}
    </ScrollView>
  );

  const footerNode = footer ? (
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
      <LinearGradient
        pointerEvents="none"
        colors={[hexAlpha(colors.background, 0), hexAlpha(colors.background, 0.92)]}
        locations={[0, 0.45]}
        style={StyleSheet.absoluteFill}
      />
      <GlassGroup>{footer}</GlassGroup>
    </View>
  ) : null;

  const body =
    keyboardAware && footer && IS_IOS ? (
      <KeyboardAvoidingView behavior="padding" style={styles.flex} collapsable={false}>
        {content}
        {footerNode}
      </KeyboardAvoidingView>
    ) : (
      <>
        {content}
        {footerNode}
      </>
    );

  if (isBare) {
    return (
      <SafeAreaView style={[styles.flex, { backgroundColor: pageColor }]} edges={edges}>
        {body}
        <Stack.Screen options={stackOptions} />
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: pageColor }]} collapsable={false}>
      {body}
      {inlineTitle ? (
        // Android/web: content scrolls under a translucent status-bar scrim, not bare pixels.
        <View
          pointerEvents="none"
          style={[
            styles.scrim,
            { height: insets.top, backgroundColor: hexAlpha(colors.background, 0.94) },
          ]}
        />
      ) : null}
      <Stack.Screen options={stackOptions} />
    </View>
  );
}

/** Native-stack options for the current platform. */
function buildOptions({
  variant,
  title,
  largeTitle,
  headerActions,
  leftActions,
  headerTransparent,
  headerTint,
  theme,
  isDark,
  options,
}) {
  const { colors } = theme;
  const inlineTitle = variant === "tab" && !IS_IOS;
  const hidden = variant === "bare" || inlineTitle;

  if (hidden) return { headerShown: false, title: title ?? "", ...options };

  if (IS_IOS) {
    const legacyBlur = !LIQUID_GLASS && !headerTransparent;
    // iOS 26: leave the bar's background alone so UIKit draws the Liquid Glass
    // navigation bar (transparent, scroll-edge effect, glass capsules around
    // bar buttons). Bar buttons are monochrome like Apple's apps; only
    // "prominent" actions are tinted. Earlier iOS: blurred bar, cyan tint.
    const tint = headerTint ?? (LIQUID_GLASS ? colors.text : colors.accent);
    return {
      headerShown: true,
      title: title ?? "",
      headerLargeTitleEnabled: Boolean(largeTitle),
      headerBackButtonDisplayMode: "minimal",
      headerShadowVisible: false,
      headerLargeTitleShadowVisible: false,
      headerTintColor: tint,
      headerTitleStyle: {
        fontFamily: fonts.semibold,
        fontSize: 17,
        color: headerTint ?? colors.text,
      },
      headerLargeTitleStyle: { fontFamily: fonts.bold, color: headerTint ?? colors.text },
      ...(legacyBlur
        ? {
            headerTransparent: true,
            headerBlurEffect: isDark ? "systemChromeMaterialDark" : "systemChromeMaterialLight",
            headerLargeStyle: { backgroundColor: "transparent" },
          }
        : null),
      ...(headerTransparent
        ? { headerTransparent: true, headerBlurEffect: undefined, headerStyle: undefined }
        : null),
      unstable_headerRightItems: headerActions?.length
        ? () => toIosHeaderItems(headerActions, colors.accent, colors.onAccent)
        : undefined,
      unstable_headerLeftItems: leftActions?.length
        ? () => toIosHeaderItems(leftActions, colors.accent, colors.onAccent)
        : undefined,
      ...options,
    };
  }

  return {
    headerShown: true,
    title: title ?? "",
    headerShadowVisible: false,
    headerTransparent: Boolean(headerTransparent),
    headerStyle: { backgroundColor: headerTransparent ? "transparent" : colors.background },
    headerTintColor: headerTint ?? colors.text,
    headerTitleStyle: { fontFamily: fonts.semibold, fontSize: 20 },
    headerRight: headerActions?.length
      ? () => <HeaderActions actions={headerActions} />
      : undefined,
    headerLeft: leftActions?.length ? () => <HeaderActions actions={leftActions} /> : undefined,
    ...options,
  };
}

/** "#050607" + alpha → "rgba(5,6,7,a)" (falls back to the input for rgba strings). */
function hexAlpha(color, alpha) {
  if (typeof color !== "string" || !color.startsWith("#") || color.length !== 7) return color;
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {},
  fill: { flexGrow: 1 },
  padded: { paddingHorizontal: GUTTER },
  inlineHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  inlineTitles: { flex: 1, gap: spacing.xxs },
  scrim: { position: "absolute", top: 0, left: 0, right: 0 },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: GUTTER,
    paddingTop: spacing.xxl,
  },
});
