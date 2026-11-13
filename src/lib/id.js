/**
 * Small ID + deterministic-random helpers.
 */

/** Unique-enough client ID: "h-lq8k2m3x-4f9a". Replace with server IDs when the API exists. */
export function createId(prefix = "id") {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 6);
  return `${prefix}-${time}-${random}`;
}

/**
 * Deterministic pseudo-random number in [0, 1) for a given integer seed.
 * Used to generate believable demo history that looks the same on every device.
 */
export function seededRandom(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}
