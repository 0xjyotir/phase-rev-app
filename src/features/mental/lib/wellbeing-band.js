/**
 * Maps a 0–100 wellbeing score to its band (label, tone, message).
 */
import { wellbeingCheck } from "@/constants/mental";

export function scoreBand(score) {
  return wellbeingCheck.bands.find((band) => score >= band.min) ?? wellbeingCheck.bands.at(-1);
}
