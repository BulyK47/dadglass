import { useCallback, useState } from "react";

/**
 * Small localStorage-backed state helpers, shared across the app so that
 * feature screens (Hospital Bag, Reminders, Ask Together, ...) keep their
 * progress between visits instead of resetting on close.
 *
 * Keys follow the existing `dg_` convention used by AppContext.
 */

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — fail silently */
  }
}

/** Persisted version of useState. */
export function usePersistedState<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => load(key, initial));
  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        save(key, next);
        return next;
      });
    },
    [key],
  );
  return [state, set];
}

/**
 * Persisted Set<string>, stored as an array. Returns the set plus helpers
 * for the common checklist interactions.
 */
export function usePersistedSet(key: string): {
  set: Set<string>;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  addAll: (ids: string[]) => void;
  clear: () => void;
} {
  const [arr, setArr] = usePersistedState<string[]>(key, []);
  const set = new Set(arr);
  const toggle = useCallback(
    (id: string) =>
      setArr((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return [...next];
      }),
    [setArr],
  );
  const addAll = useCallback((ids: string[]) => setArr((prev) => [...new Set([...prev, ...ids])]), [setArr]);
  const clear = useCallback(() => setArr([]), [setArr]);
  return { set, has: (id: string) => set.has(id), toggle, addAll, clear };
}
