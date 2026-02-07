import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
interface CountUpNumberProps {
  value: number;
  duration?: number;
  className?: string;
}
export function CountUpNumber({
  value,
  duration = 1.5,
  className = ''
}: CountUpNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 50,
    duration: duration * 1000
  });
  const isInView = useInView(ref, {
    once: true,
    margin: '-10px'
  });
  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);
  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toString();
      }
    });
  }, [springValue]);
  return (
    <span ref={ref} className={`font-mono ${className}`}>
      0
    </span>);

}