import React from 'react';
import { motion } from 'framer-motion';
interface ProgressBarProps {
  value: number;
  color: string;
  glowColor?: string;
  height?: string;
  className?: string;
}
export function ProgressBar({
  value,
  color,
  glowColor,
  height = 'h-1.5',
  className = ''
}: ProgressBarProps) {
  // Determine shadow style based on color if glowColor isn't explicitly provided
  const boxShadow = glowColor ? `0 0 8px ${glowColor}` : `0 0 8px ${color}66`; // 66 is approx 40% opacity hex
  return (
    <div
      className={`w-full bg-gray-800/50 rounded-full overflow-hidden ${height} ${className}`}>

      <motion.div
        className="h-full rounded-full"
        style={{
          backgroundColor: color,
          boxShadow: boxShadow
        }}
        initial={{
          width: 0
        }}
        whileInView={{
          width: `${Math.min(100, Math.max(0, value))}%`
        }}
        transition={{
          duration: 1.2,
          ease: 'easeOut',
          delay: 0.2
        }}
        viewport={{
          once: true
        }} />

    </div>);

}