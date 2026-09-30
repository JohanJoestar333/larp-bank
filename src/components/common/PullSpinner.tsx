import React from 'react';
import { PTR_HOLD } from '../../hooks/usePullToRefresh';

/** Spinner that grows out of the top of the page while pulling (sits on a dark background). */
export const PullSpinner: React.FC<{ offset: number; refreshing: boolean; dragging: boolean }> = ({
  offset,
  refreshing,
  dragging,
}) => (
  <div
    style={{ height: offset, transition: dragging ? 'none' : 'height 0.28s cubic-bezier(.2,.8,.2,1)' }}
    className="overflow-hidden flex items-center justify-center shrink-0"
  >
    <div
      style={{
        opacity: Math.min(offset / (PTR_HOLD * 0.7), 1),
        transform: refreshing ? undefined : `rotate(${offset * 4}deg)`,
      }}
      className={`w-6 h-6 rounded-full border-[2.5px] border-white/25 border-t-white ${refreshing ? 'animate-spin' : ''}`}
    />
  </div>
);
