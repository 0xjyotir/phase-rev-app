/**
 * Header actions → native navigation-bar items.
 *
 * Screens describe their bar buttons once, platform-agnostic:
 *
 *   const actions = [
 *     { label: "New routine", icon: "plus", onPress: create },
 *     { label: "Finish", prominent: true, onPress: finish },
 *     { label: "More", icon: "more-horizontal", menu: { items: [
 *         { label: "Discard workout", icon: "trash-2", destructive: true, onPress: discard },
 *     ] } },
 *     { element: <AvatarButton />, hidesSharedBackground: true },
 *   ];
 *
 * On iOS they become real UIBarButtonItems (SF Symbols, native UIMenus, and
 * Liquid Glass capsules on iOS 26 — "prominent" renders as the tinted glass
 * button). On Android/web <HeaderActions> renders them as icon/text buttons,
 * and menus open a native alert.
 */
import { Alert, Platform } from "react-native";
import ICON_MAP from "@/components/ui/icon-map.json";
import { fonts } from "@/theme/typography";
import { LIQUID_GLASS } from "./platform";

const sfIcon = (name) => {
  const sf = ICON_MAP[name]?.sf;
  return sf ? { type: "sfSymbol", name: sf } : undefined;
};

function toMenuItem(item) {
  if (item.items) {
    return {
      type: "submenu",
      label: item.label,
      icon: item.icon ? sfIcon(item.icon) : undefined,
      inline: item.inline ?? true,
      items: item.items.map(toMenuItem),
    };
  }
  return {
    type: "action",
    label: item.label,
    description: item.description,
    icon: item.icon ? sfIcon(item.icon) : undefined,
    onPress: item.onPress,
    destructive: item.destructive,
    disabled: item.disabled,
    state: item.selected ? "on" : undefined,
  };
}

/**
 * Converts our action descriptors into react-native-screens header items (iOS).
 * `tintColor` tints prominent items; `onTintColor` is their label colour
 * (dark ink on cyan reads better than UIKit's default white).
 */
export function toIosHeaderItems(actions = [], tintColor, onTintColor) {
  return actions.filter(Boolean).map((action) => {
    if (action.element) {
      return {
        type: "custom",
        element: action.element,
        hidesSharedBackground: action.hidesSharedBackground,
      };
    }
    const shared = {
      label: action.label,
      icon: action.icon ? sfIcon(action.icon) : undefined,
      disabled: action.disabled,
      tintColor: action.tintColor ?? (action.prominent ? tintColor : undefined),
      variant: action.prominent ? (LIQUID_GLASS ? "prominent" : "done") : "plain",
      labelStyle: {
        fontFamily: fonts.semibold,
        ...(action.prominent && LIQUID_GLASS && onTintColor ? { color: onTintColor } : null),
      },
      accessibilityLabel: action.accessibilityLabel ?? action.label,
    };
    if (action.menu) {
      return {
        ...shared,
        type: "menu",
        menu: { title: action.menu.title, items: action.menu.items.map(toMenuItem) },
      };
    }
    return { ...shared, type: "button", onPress: action.onPress };
  });
}

/** Android/web fallback for menus: a native alert with one button per item. */
export function openMenuFallback(menu) {
  const items = menu.items.flatMap((item) => item.items ?? [item]);
  if (Platform.OS === "web") {
    // react-native-web has no Alert — confirm each option in turn.
    const chosen = items.find((item) => globalThis.confirm?.(`${item.label}?`));
    chosen?.onPress?.();
    return;
  }
  Alert.alert(
    menu.title ?? "",
    menu.message,
    [
      ...items.map((item) => ({
        text: item.label,
        style: item.destructive ? "destructive" : "default",
        onPress: item.onPress,
      })),
      { text: "Cancel", style: "cancel" },
    ],
    { cancelable: true },
  );
}
