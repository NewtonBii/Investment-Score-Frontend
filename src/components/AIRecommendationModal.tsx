import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Sparkles,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    RefreshCw,
    ChevronRight
} from 'lucide-react';
import { Button } from './ui/Button';

interface Recommendation {
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;
    actions: string[];
}

interface AIRecommendationModalProps {
    isOpen: boolean;
    onClose: () => void;
    scoreType: 'cdr' | 'transaction' | 'behavioral';
    scoreTitle: string;
    score: number;
    userId: string; // added user ID
}

const priorityConfig = {
    high: { color: '#EF4444', bg: 'bg-danger/10', border: 'border-danger/20', label: 'High Impact', icon: AlertTriangle },
    medium: { color: '#F59E0B', bg: 'bg-warning/10', border: 'border-warning/20', label: 'Medium Impact', icon: TrendingUp },
    low: { color: '#00D4AA', bg: 'bg-primary/10', border: 'border-primary/20', label: 'Low Impact', icon: CheckCircle2 }
};

export function AIRecommendationModal({
                                          isOpen,
                                          onClose,
                                          scoreType,
                                          scoreTitle,
                                          score,
                                          userId
                                      }: AIRecommendationModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

    const fetchRecommendations = async () => {
        setIsLoading(true);
        setRecommendations(null);
        const texts = [
            'Analyzing your data...',
            'Running AI models...',
            'Generating insights...'
        ];

        let i = 0;
        const t = setInterval(() => {
            setLoadingText(texts[i % texts.length]);
            i++;
        }, 900);

        try {
            const API_BASE = 'http://localhost:8000/api';
            const res = await fetch(`${API_BASE}/recommendations/${scoreType}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score, user_id: userId })
            });

            if (res.ok) {
                const data = await res.json();
                setRecommendations(data.recommendations || []);
            } else {
                setRecommendations([]);
            }
        } catch {
            setRecommendations([]);
        } finally {
            clearInterval(t);
            setIsLoading(false);
        }
    };

    // Fetch when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchRecommendations();
        }
    }, [isOpen, scoreType, userId, score]);

    const scoreColor = score >= 75 ? '#00D4AA' : score >= 50 ? '#F59E0B' : '#EF4444';
    const scoreLabel = score >= 75 ? 'Strong' : score >= 50 ? 'Average' : 'Needs Attention';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="w-full sm:max-w-2xl bg-surface border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-start justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">{scoreTitle}</h2>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-2xl font-bold font-mono" style={{ color: scoreColor }}>{score}</span>
                                        <span className="text-xs font-mono uppercase tracking-wider" style={{ color: scoreColor }}>{scoreLabel}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            {isLoading || recommendations === null ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-4">
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                                        <Loader2 className="w-8 h-8 text-primary" />
                                    </motion.div>
                                    <p className="text-gray-400 text-sm">{loadingText || 'Loading recommendations...'}</p>
                                </div>
                            ) : recommendations.length === 0 ? (
                                <p className="text-gray-400 text-sm">No recommendations available.</p>
                            ) : (
                                recommendations.map((rec, i) => {
                                    const cfg = priorityConfig[rec.priority];
                                    const isExpanded = expandedIndex === i;
                                    return (
                                        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                                                    className={`rounded-xl border ${cfg.border} ${cfg.bg} overflow-hidden`}
                                        >
                                            <button
                                                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                                                className="w-full p-4 flex items-start gap-3 text-left"
                                            >
                                                <cfg.icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: cfg.color }} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="text-xs font-mono uppercase tracking-wider" style={{ color: cfg.color }}>
                                                            {cfg.label}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-semibold text-white text-sm">{rec.title}</h3>
                                                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{rec.description}</p>
                                                </div>
                                                <ChevronRight className={`w-4 h-4 text-gray-500 shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                            </button>

                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                        <div className="px-4 pb-4 pt-0 space-y-3 border-t border-white/5">
                                                            <div className="flex items-center gap-2 bg-white/3 rounded-lg px-3 py-2 mt-3">
                                                                <TrendingUp className="w-3.5 h-3.5 text-primary shrink-0" />
                                                                <span className="text-xs text-primary font-medium">{rec.impact}</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Action Steps</p>
                                                                <ol className="space-y-1.5">
                                                                    {rec.actions.map((action, j) => (
                                                                        <li key={j} className="flex items-start gap-2 text-xs text-gray-300">
                                                                            <span className="font-mono text-gray-600 shrink-0 mt-0.5">{j + 1}.</span>
                                                                            {action}
                                                                        </li>
                                                                    ))}
                                                                </ol>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/5 flex items-center justify-between shrink-0 bg-background/30">
                            <p className="text-xs text-gray-600">AI-generated based on your score data</p>
                            <Button
                                variant="secondary"
                                onClick={fetchRecommendations}
                                isLoading={isLoading}
                                icon={<RefreshCw className="w-3.5 h-3.5" />}
                            >
                                Regenerate
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}