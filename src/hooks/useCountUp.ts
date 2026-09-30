import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 → target on mount and whenever `replayKey` changes.
 * If only `target` changes (e.g. you edit a value) it eases from the current value instead.
 */
export function useCountUp(target: number, opts: { duration?: number; replayKey?: number | string } = {}) {
  const { duration = 1100, replayKey = 0 } = opts;
  const [val, setVal] = useState(0);
  const valRef = useRef(0);
  const lastKey = useRef(replayKey);
  const animated = useRef(false);

  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      valRef.current = target;
      setVal(target);
      return;
    }
    let from = valRef.current;
    let dur = duration;
    if (lastKey.current !== replayKey) {
      from = 0;
      lastKey.current = replayKey;
    } else if (animated.current) {
      dur = 600;
    }
    animated.current = true;

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (target - from) * eased;
      valRef.current = v;
      setVal(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, replayKey, duration]);

  return val;
}
