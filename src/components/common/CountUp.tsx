import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';

export const decimalsOf = (n: number) => {
  const s = String(n);
  const i = s.indexOf('.');
  return i === -1 ? 0 : Math.min(s.length - i - 1, 4);
};

export const CountUp: React.FC<{
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  replayKey?: number | string;
}> = ({ value, decimals = 0, prefix = '', suffix = '', duration, replayKey }) => {
  const v = useCountUp(value, { duration, replayKey });
  const text = v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <>
      {prefix}
      {text}
      {suffix}
    </>
  );
};
