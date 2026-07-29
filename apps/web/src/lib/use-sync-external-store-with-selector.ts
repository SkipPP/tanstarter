import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";

type SelectionState<TSelection> = { hasValue: false } | { hasValue: true; value: TSelection };

type MemoizedSelection<TSnapshot, TSelection> =
  | { hasValue: false }
  | { hasValue: true; snapshot: TSnapshot; selection: TSelection };

export function useSyncExternalStoreWithSelector<TSnapshot, TSelection>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => TSnapshot,
  getServerSnapshot: (() => TSnapshot) | undefined,
  selector: (snapshot: TSnapshot) => TSelection,
  isEqual: (previous: TSelection, next: TSelection) => boolean = Object.is,
): TSelection {
  const selectionRef = useRef<SelectionState<TSelection>>({ hasValue: false });

  const [getSelection, getServerSelection] = useMemo(() => {
    let memoized: MemoizedSelection<TSnapshot, TSelection> = { hasValue: false };

    const memoizedSelector = (snapshot: TSnapshot) => {
      if (!memoized.hasValue) {
        let selection = selector(snapshot);
        const current = selectionRef.current;

        if (current.hasValue && isEqual(current.value, selection)) {
          selection = current.value;
        }

        memoized = { hasValue: true, snapshot, selection };
        return selection;
      }

      if (Object.is(memoized.snapshot, snapshot)) {
        return memoized.selection;
      }

      const selection = selector(snapshot);
      if (isEqual(memoized.selection, selection)) {
        memoized = { ...memoized, snapshot };
        return memoized.selection;
      }

      memoized = { hasValue: true, snapshot, selection };
      return selection;
    };

    return [
      () => memoizedSelector(getSnapshot()),
      getServerSnapshot ? () => memoizedSelector(getServerSnapshot()) : undefined,
    ] as const;
  }, [getSnapshot, getServerSnapshot, isEqual, selector]);

  const selection = useSyncExternalStore(subscribe, getSelection, getServerSelection);

  useEffect(() => {
    selectionRef.current = { hasValue: true, value: selection };
  }, [selection]);

  return selection;
}
