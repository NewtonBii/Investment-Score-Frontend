import React from 'react';
import { motion } from 'framer-motion';
import { ProgressBar } from './ProgressBar';
import { CountUpNumber } from './CountUpNumber';
import { MetricRow } from './MetricRow';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
export interface SubMetric {
  label: string;
  value: number;
}
export interface ScoreCardProps {
  title: string;
  score: number;
  subMetrics: SubMetric[];
  index: number;
}
export function ScoreCard({ title, score, subMetrics, index }: ScoreCardProps) {
  // Determine color based on score
  let color = '#EF4444'; // Coral (Low)
  let status = 'Needs Attention';
  let TrendIcon = ArrowDownRight;
  if (score >= 75) {
    color = '#00D4AA'; // Teal (Good)
    status = 'Strong';
    TrendIcon = ArrowUpRight;
  } else if (score >= 50) {
    color = '#F59E0B'; // Amber (Medium)
    status = 'Average';
    TrendIcon = Minus;
  }
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.1
      }}
      viewport={{
        once: true
      }}
      className="glass-panel rounded-xl p-6 flex flex-col h-full hover:border-white/10 transition-colors duration-300">

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-200 font-medium text-lg tracking-tight">
            {title}
          </h3>
          <span
            className="text-xs font-mono uppercase tracking-wider opacity-60"
            style={{
              color
            }}>

            {status}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <CountUpNumber
            value={score}
            className="text-3xl font-bold"
            style={{
              color,
              textShadow: `0 0 15px ${color}40`
            }} />

        </div>
      </div>

      <div className="mb-6">
        <ProgressBar value={score} color={color} height="h-1" />
      </div>

      <div className="flex-1 flex flex-col gap-1 mt-auto">
        {subMetrics.map((metric, i) =>
        <MetricRow
          key={i}
          label={metric.label}
          value={metric.value}
          color={
          score >= 75 ? '#E5E7EB' : score >= 50 ? '#D1D5DB' : '#9CA3AF'
          } />

        )}
      </div>
    </motion.div>);

}