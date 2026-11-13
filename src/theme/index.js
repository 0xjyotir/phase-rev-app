/**
 * Theme barrel — import theme building blocks from "@/theme".
 *
 *   import { spacing, radius } from "@/theme";
 *   const { colors } = useTheme(); // colors live in the ThemeProvider
 */
export { palette } from "./palette";
export { lightTheme, darkTheme } from "./themes";
export { fonts, fontAssets, textVariants } from "./typography";
export { spacing, radius, GUTTER, HIT_SIZE, makeShadow } from "./layout";
