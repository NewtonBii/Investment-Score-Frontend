import { motion } from "framer-motion";
import { CountUpNumber } from "./CountUpNumber";
import { Activity, TrendingUp } from "lucide-react";

interface OverallScoreProps {
  score: number;
  segments?: number;
  confidence?: number; // AI model confidence %
}

export function OverallScore({
  score,
  segments = 10,
  confidence = 92
}: OverallScoreProps) {
  const filledSegments = Math.round((score / 100) * segments);

  function getScoreLabel(score: number) {
    if (score >= 80) return "Investment Ready";
    if (score >= 60) return "Strong Potential";
    if (score >= 40) return "Moderate Readiness";
    return "Needs Improvement";
  }

  function getColor(score: number) {
    if (score >= 80) return "#22c55e"; // green
    if (score >= 60) return "#00D4AA"; // teal
    if (score >= 40) return "#f59e0b"; // amber
    return "#ef4444"; // red
  }

  const activeColor = getColor(score);

  return (
    <section className="w-full mb-12">
      <div className="glass-panel rounded-2xl p-8 md:p-10 relative overflow-hidden">

        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 relative z-10">

          {/* LEFT */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-mono uppercase tracking-widest text-primary">
                AI Powered Investment Readiness Score
              </h2>
            </div>

            <h1 className="text-3xl md:text-4xl font-light text-white mb-4">
              {getScoreLabel(score)}
            </h1>

            {/* Segmented Bar */}
            <div className="flex gap-1.5 h-12 md:h-16 w-full max-w-3xl">
              {Array.from({ length: segments }).map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 h-full rounded-sm first:rounded-l-lg last:rounded-r-lg bg-gray-800/50"
                  initial={{ opacity: 0.3, scaleY: 0.8 }}
                  whileInView={{
                    opacity: i < filledSegments ? 1 : 0.25,
                    scaleY: 1,
                    backgroundColor:
                      i < filledSegments
                        ? activeColor
                        : "rgba(31,41,55,0.5)",
                    boxShadow:
                      i < filledSegments
                        ? `0 0 18px ${activeColor}66`
                        : "none"
                  }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.06,
                    ease: "backOut"
                  }}
                  viewport={{ once: true }}
                />
              ))}
            </div>

            {/* Axis */}
            <div className="flex justify-between mt-2 text-xs font-mono text-gray-500 max-w-3xl px-1">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>

            {/* AI Explanation */}
            <p className="text-sm text-gray-400 mt-4 max-w-xl leading-relaxed">
              Score generated using behavioural transaction analytics,
              savings consistency, income stability, and financial activity
              patterns derived from mobile money usage.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-end">

            {/* Score */}
            <div className="flex items-baseline">
              <CountUpNumber
                value={score}
                className="text-7xl md:text-8xl font-bold text-white tracking-tighter"
              />
              <span className="text-2xl text-gray-500 font-light ml-2 mb-2">
                /100
              </span>
            </div>

            {/* Confidence */}
            <div className="flex items-center gap-2 mt-3 text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              {/* <TrendingUp className="w-4 h-4" /> */}
              <span className="text-xs font-mono font-medium">
                AI Confidence: {confidence}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
