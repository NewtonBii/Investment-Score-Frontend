import React from 'react';
import { CountUpNumber } from './CountUpNumber';
interface MetricRowProps {
  label: string;
  value: number;
  color?: string;
}
export function MetricRow({ label, value, color = '#9CA3AF' }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
      <span className="text-sm text-gray-400 font-light tracking-wide">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <CountUpNumber
          value={value}
          className="text-sm font-bold"
          style={{
            color
          }} />

        <span className="text-xs text-gray-600 font-mono">/100</span>
      </div>
    </div>);

}