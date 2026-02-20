import React from 'react';
import {motion} from 'framer-motion';
import {CountUpNumber} from './CountUpNumber';
import {TrendingUp, ShieldCheck, Activity, ArrowDownRight, ArrowUpRight, Minus} from 'lucide-react';

interface OverallScoreProps {
    score: number;
}

export function OverallScore({score}: OverallScoreProps) {
    const segments = 10;
    const filledSegments = Math.round(score / 100 * segments);
    // Determine color based on score
    let color = '#EF4444'; // Coral (Low)
    let status = 'Needs Attention';
    if (score >= 75) {
        color = '#00D4AA'; // Teal (Good)
        status = 'Strong';
    } else if (score >= 50) {
        color = '#F59E0B'; // Amber (Medium)
        status = 'Average';
    }
    return (
        <section className="w-full mb-12">
            <div className="glass-panel rounded-2xl p-8 md:p-10 relative overflow-hidden">
                {/* Background decorative glow */}
                <div
                    className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"/>

                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 relative z-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <Activity className="w-5 h-5 text-primary"/>
                            <h2 className="text-sm font-mono uppercase tracking-widest text-primary">
                                Investment Readiness Score
                            </h2>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-light text-white mb-6">
                            {status}
                            {/*<span className="text-gray-500 font-thin mx-2">|</span>{' '}*/}
                            {/*<span className="text-gray-400 text-lg">Ready for Series A</span>*/}
                        </h1>

                        <div className="flex gap-1.5 h-12 md:h-16 w-full max-w-3xl">
                            {Array.from({
                                length: segments
                            }).map((_, i) =>
                                <motion.div
                                    key={i}
                                    className="flex-1 h-full rounded-sm first:rounded-l-lg last:rounded-r-lg bg-gray-800/50"
                                    initial={{
                                        opacity: 0.3,
                                        scaleY: 0.8
                                    }}
                                    whileInView={{
                                        opacity: i < filledSegments ? 1 : 0.3,
                                        scaleY: 1,
                                        backgroundColor:
                                        color,
                                        boxShadow:
                                            i < filledSegments ?
                                                '0 0 15px rgba(0, 212, 170, 0.4)' :
                                                'none'
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        delay: i * 0.05,
                                        ease: 'backOut'
                                    }}
                                    viewport={{
                                        once: true
                                    }}/>
                            )}
                        </div>

                        <div className="flex justify-between mt-2 text-xs font-mono text-gray-500 max-w-3xl px-1">
                            <span>0</span>
                            <span>25</span>
                            <span>50</span>
                            <span>75</span>
                            <span>100</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="flex items-baseline">
                            <CountUpNumber
                                value={score}
                                className="text-7xl md:text-8xl font-bold text-white tracking-tighter"/>

                            <span className="text-2xl text-gray-500 font-light ml-2 mb-2">
                /100
              </span>
                        </div>
                        <div
                            className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                            <TrendingUp className="w-4 h-4"/>
                            <span className="text-xs font-mono font-medium">
                +4.2% vs last month
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>);

}