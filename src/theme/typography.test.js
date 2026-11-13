import { fontAssets, fonts, postScriptFonts, textVariants } from "./typography";

const loaded = new Set(Object.keys(fontAssets));

describe("typography", () => {
  it("only references fonts that the root layout loads", () => {
    for (const [name, family] of Object.entries(fonts)) {
      expect({ name, loaded: loaded.has(family) }).toEqual({ name, loaded: true });
    }
    for (const [name, variant] of Object.entries(textVariants)) {
      expect({ name, loaded: loaded.has(variant.fontFamily) }).toEqual({ name, loaded: true });
    }
  });

  it("never pairs a single-weight font file with fontWeight", () => {
    for (const [name, variant] of Object.entries(textVariants)) {
      expect({ name, fontWeight: variant.fontWeight }).toEqual({ name, fontWeight: undefined });
    }
  });

  it("keeps numbers and timers tabular so they don't jitter", () => {
    for (const name of ["metricLarge", "metric", "metricSmall", "timer"]) {
      expect(textVariants[name].fontVariant).toContain("tabular-nums");
    }
  });

  it("has a PostScript name for every UI weight", () => {
    expect(Object.keys(postScriptFonts).sort()).toEqual(["bold", "medium", "regular", "semibold"]);
  });
});
