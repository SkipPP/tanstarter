import { useDebugValue, useMemo, useRef, useSyncExternalStore } from "react";

type Subscribe = (onStoreChange: () => void) => () => void;

export function useSyncExternalStoreWithSelector<Snapshot, Selection>(
  subscribe: Subscribe,
  getSnapshot: () => Snapshot,
  // We intentionally ignore the original getServerSnapshot to avoid
  // hydration warnings in React 18/19 about uncached server snapshots.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getServerSnapshot: (() => Snapshot) | null,
  selector: (snapshot: Snapshot) => Selection,
  isEqual: (a: Selection, b: Selection) => boolean = Object.is,
): Selection {
  const lastSelectionRef = useRef<Selection | null>(null);

  const getSelectedSnapshot = useMemo(() => {
    return () => {
      const snapshot = getSnapshot();
      const selection = selector(snapshot);

      if (lastSelectionRef.current !== null && isEqual(lastSelectionRef.current, selection)) {
        return lastSelectionRef.current;
      }

      lastSelectionRef.current = selection;
      return selection;
    };
  }, [getSnapshot, selector, isEqual]);

  const selected = useSyncExternalStore(
    subscribe,
    getSelectedSnapshot,
    getSelectedSnapshot,
  );

  useDebugValue(selected);

  return selected;
}

