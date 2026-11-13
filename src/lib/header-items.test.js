jest.mock("./platform", () => ({ LIQUID_GLASS: true }));

const { toIosHeaderItems } = require("./header-items");
const { fonts } = require("@/theme/typography");

describe("toIosHeaderItems (iOS 26)", () => {
  const onPress = () => {};

  it("maps icons to SF Symbols and leaves plain items monochrome", () => {
    const [item] = toIosHeaderItems([{ label: "New routine", icon: "plus", onPress }], "#00BCD4");
    expect(item).toMatchObject({
      type: "button",
      variant: "plain",
      icon: { type: "sfSymbol", name: "plus" },
      labelStyle: { fontFamily: fonts.semibold },
    });
    expect(item.tintColor).toBeUndefined();
  });

  it("renders prominent actions as tinted Liquid Glass with readable ink", () => {
    const [item] = toIosHeaderItems(
      [{ label: "Save", prominent: true, onPress }],
      "#00BCD4",
      "#00242B",
    );
    expect(item).toMatchObject({
      variant: "prominent",
      tintColor: "#00BCD4",
      labelStyle: { fontFamily: fonts.semibold, color: "#00242B" },
    });
  });

  it("builds native menus and custom elements", () => {
    const element = "avatar";
    const [menu, custom] = toIosHeaderItems([
      { label: "More", icon: "more-horizontal", menu: { items: [{ label: "Discard", onPress }] } },
      { element, hidesSharedBackground: true },
    ]);
    expect(menu.type).toBe("menu");
    expect(menu.menu.items[0]).toMatchObject({ type: "action", label: "Discard" });
    expect(custom).toEqual({ type: "custom", element, hidesSharedBackground: true });
  });
});
