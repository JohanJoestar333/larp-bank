import { RefObject, useEffect, useRef, useState } from 'react';

export const PTR_HOLD = 56;
const THRESHOLD = 70;
const MAX_PULL = 110;
const HOLD_MS = 1300;

const scrollTopOf = (el: HTMLElement | null) => {
  let top = window.scrollY || document.documentElement.scrollTop || 0;
  let node = el?.parentElement ?? null;
  while (node) {
    const oy = getComputedStyle(node).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && node.scrollHeight > node.clientHeight) {
      top = Math.max(top, node.scrollTop);
    }
    node = node.parentElement;
  }
  return top;
};

/** Pull down from the top of the page (touch or mouse) → spinner → onRefresh(). */
export function usePullToRefresh(rootRef: RefObject<HTMLElement | null>, onRefresh: () => void, enabled = true) {
  const [offset, setOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const cb = useRef(onRefresh);
  const st = useRef({ startY: 0, active: false, pull: 0, busy: false });

  useEffect(() => {
    cb.current = onRefresh;
  });

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !enabled) return;
    const s = st.current;
    const atTop = () => scrollTopOf(el) <= 0;

    const begin = (y: number) => {
      if (s.busy || !atTop()) return;
      s.startY = y;
      s.active = true;
      s.pull = 0;
    };
    const move = (y: number, prevent: () => void) => {
      if (!s.active) return;
      const dy = y - s.startY;
      if (dy <= 0) {
        if (s.pull > 0) {
          s.pull = 0;
          setOffset(0);
        }
        return;
      }
      if (!atTop()) {
        s.active = false;
        s.pull = 0;
        setOffset(0);
        setDragging(false);
        return;
      }
      prevent();
      s.pull = Math.min(dy * 0.5, MAX_PULL);
      setDragging(true);
      setOffset(s.pull);
    };
    const end = () => {
      if (!s.active) return;
      s.active = false;
      setDragging(false);
      if (s.pull >= THRESHOLD) {
        s.busy = true;
        setRefreshing(true);
        setOffset(PTR_HOLD);
        window.setTimeout(() => {
          cb.current();
          s.busy = false;
          s.pull = 0;
          setRefreshing(false);
          setOffset(0);
        }, HOLD_MS);
      } else {
        s.pull = 0;
        setOffset(0);
      }
    };

    const onTouchStart = (e: TouchEvent) => begin(e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) =>
      move(e.touches[0].clientY, () => {
        if (e.cancelable) e.preventDefault();
      });
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) begin(e.clientY);
    };
    const onMouseMove = (e: MouseEvent) => move(e.clientY, () => {});

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', end);
    el.addEventListener('touchcancel', end);
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', end);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', end);
      el.removeEventListener('touchcancel', end);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', end);
    };
  }, [rootRef, enabled]);

  return { offset, refreshing, dragging };
}
