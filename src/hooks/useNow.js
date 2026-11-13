/**
 * useNow — re-renders on an interval and returns the current timestamp (ms).
 *
 * Timers in this app (workout stopwatch, rest countdown) store *timestamps*,
 * not counters, so they stay correct when the app is backgrounded. This hook
 * just makes the screen redraw.
 *
 *   const now = useNow(1000);          // tick every second
 *   const now = useNow(1000, isActive) // only tick while active
 */
import { useEffect, useState } from "react";

export function useNow(intervalMs = 1000, enabled = true) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!enabled) return undefined;
    const tick = () => setNow(Date.now());
    const immediate = setTimeout(tick, 0); // refresh right away when (re)enabled
    const id = setInterval(tick, intervalMs);
    return () => {
      clearTimeout(immediate);
      clearInterval(id);
    };
  }, [intervalMs, enabled]);

  return now;
}
