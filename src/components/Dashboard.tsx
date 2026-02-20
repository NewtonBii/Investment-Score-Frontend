import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {OverallScore} from './OverallScore';
import {ScoreCard} from './ScoreCard';
import {Button} from './ui/Button';
import {AIRecommendationModal} from './AIRecommendationModal';
import {
    Download,
    Upload,
    Clock,
    History,
    Sparkles,
    ChevronRight
} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import {CountUpNumber} from './CountUpNumber';
import {Warning} from "postcss";

interface DashboardProps {
    onNavigate: (page: string) => void;
}

interface Category {
    title: string;
    score: number;
    type: 'cdr' | 'transaction' | 'behavioral';
    subMetrics: { label: string; value: number }[];
}

interface ScoreHistoryItem {
    id: string;
    date: string;
    overall: number;
    cdr: number;
    transaction: number;
    behavioral: number;
    change: number;
}

export function Dashboard({onNavigate}: DashboardProps) {
    const {user} = useAuth();
    const [overallScore, setOverallScore] = useState<number>(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [scoreHistory, setScoreHistory] = useState<ScoreHistoryItem[]>([]);
    const [selectedScoreCard, setSelectedScoreCard] = useState<{
        type: 'cdr' | 'transaction' | 'behavioral';
        title: string;
        score: number;
    } | null>(null);
    const [selectedHistoryId, setSelectedHistoryId] = useState<string>('1');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 5000) => {
            return Promise.race([
                fetch(url, options),
                new Promise<Response>((_, reject) =>
                    setTimeout(() => reject(new Error('Request timed out')), timeout)
                )
            ]) as Promise<Response>;
        };

        const fetchDashboardData = async () => {
            setLoading(true);
            setError('');
            try {
                const userId = user?.id;
                const API_BASE = 'http://localhost:8000/api'; // replace with your API
                const [scoreRes, historyRes] = await Promise.all([
                    fetchWithTimeout(`${API_BASE}/dashboard/score?user_id=${userId}`, {}, 1000),
                    fetchWithTimeout(`${API_BASE}/dashboard/history?user_id=${userId}`, {}, 1000)
                ]);

                if (!scoreRes.ok) throw new Error('Failed to fetch score data');
                if (!historyRes.ok) throw new Error('Failed to fetch history data');

                const scoreData = await scoreRes.json();
                const historyData = await historyRes.json();

                setOverallScore(scoreData.overallScore);
                setCategories(scoreData.categories);
                setScoreHistory(historyData);

                if (historyData.length > 0) setSelectedHistoryId(historyData[0].id);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    const handleExport = () => {
        let csvContent = 'data:text/csv;charset=utf-8,Category,Score,Metric,Value\n';
        csvContent += `Overall,${overallScore},,\n`;
        categories.forEach((cat) => {
            cat.subMetrics.forEach((metric) => {
                csvContent += `${cat.title},${cat.score},${metric.label},${metric.value}\n`;
            });
        });
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', 'investment_score.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="text-white text-center py-20">Loading dashboard...</div>;
    if (error) return <div className="text-danger text-center py-20">{error}</div>;

    return (
        <main className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {user ? `Welcome back, ${user.name}` : 'Dashboard'}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                        <Clock className="w-4 h-4"/>
                        <span>Last scored: {scoreHistory.find((s) => s.id === selectedHistoryId)?.date}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        onClick={handleExport}
                        icon={<Download className="w-4 h-4"/>}>
                        Export CSV
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => onNavigate('upload')}
                        icon={<Upload className="w-4 h-4"/>}>
                        Upload New Data
                    </Button>
                </div>
            </div>

            <OverallScore score={overallScore}/>

            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {categories.map((category, index) => (
                    <div key={category.title} className="relative group">
                        <ScoreCard
                            index={index}
                            title={category.title}
                            score={category.score}
                            subMetrics={category.subMetrics}
                        />

                        {/* AI Recommendations button */}
                        <motion.button
                            initial={{opacity: 0, y: 4}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true}}
                            transition={{delay: index * 0.1 + 0.4}}
                            onClick={() =>
                                setSelectedScoreCard({
                                    type: category.type,
                                    title: category.title,
                                    score: category.score
                                })
                            }
                            className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-white/5 bg-white/2 hover:bg-white/5 hover:border-primary/30 transition-all text-xs text-gray-400 hover:text-primary group/btn"
                        >
                            <Sparkles className="w-3.5 h-3.5 group-hover/btn:text-primary"/>
                            AI Recommendations
                            <ChevronRight className="w-3.5 h-3.5 ml-auto"/>
                        </motion.button>
                    </div>
                ))}
            </div>

            {/*/!* Score History *!/*/}
            {/*<section>*/}
            {/*    <div className="flex items-center gap-3 mb-6">*/}
            {/*        <History className="w-5 h-5 text-primary"/>*/}
            {/*        <h2 className="text-lg font-semibold text-white">Previous Assessments</h2>*/}
            {/*    </div>*/}

            {/*    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">*/}
            {/*        {scoreHistory.map((item, i) => (*/}
            {/*            <motion.button*/}
            {/*                key={item.id}*/}
            {/*                initial={{opacity: 0, y: 16}}*/}
            {/*                whileInView={{opacity: 1, y: 0}}*/}
            {/*                viewport={{once: true}}*/}
            {/*                transition={{delay: i * 0.08}}*/}
            {/*                onClick={() => setSelectedHistoryId(item.id)}*/}
            {/*                className={`*/}
            {/*    glass-panel rounded-xl p-5 text-left transition-all duration-200*/}
            {/*    ${selectedHistoryId === item.id ? 'border-primary/40 shadow-[0_0_20px_rgba(0,212,170,0.1)]' : 'hover:border-white/10'}*/}
            {/*  `}*/}
            {/*            >*/}
            {/*                <div className="flex items-center justify-between mb-3">*/}
            {/*                    <span className="text-xs text-gray-500">{item.date}</span>*/}
            {/*                    <span*/}
            {/*                        className={`text-xs font-mono font-bold ${item.change >= 0 ? 'text-primary' : 'text-danger'}`}*/}
            {/*                    >*/}
            {/*      {item.change >= 0 ? '+' : ''}*/}
            {/*                        {item.change}*/}
            {/*    </span>*/}
            {/*                </div>*/}
            {/*                <div className="text-3xl font-bold text-white font-mono mb-4">{item.overall}</div>*/}
            {/*                <div className="space-y-1.5">*/}
            {/*                    {[*/}
            {/*                        {label: 'CDR', value: item.cdr, color: '#00D4AA'},*/}
            {/*                        {label: 'Trans', value: item.transaction, color: '#3B82F6'},*/}
            {/*                        {label: 'Behav', value: item.behavioral, color: '#8B5CF6'}*/}
            {/*                    ].map((bar) => (*/}
            {/*                        <div key={bar.label} className="flex items-center gap-2">*/}
            {/*                            <span className="text-xs text-gray-600 w-10 shrink-0">{bar.label}</span>*/}
            {/*                            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">*/}
            {/*                                <div*/}
            {/*                                    className="h-full rounded-full transition-all duration-700"*/}
            {/*                                    style={{width: `${bar.value}%`, backgroundColor: bar.color}}*/}
            {/*                                />*/}
            {/*                            </div>*/}
            {/*                            <span*/}
            {/*                                className="text-xs font-mono text-gray-500 w-6 text-right">{bar.value}</span>*/}
            {/*                        </div>*/}
            {/*                    ))}*/}
            {/*                </div>*/}
            {/*            </motion.button>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/* AI Recommendations Modal */}
            <AIRecommendationModal
                isOpen={!!selectedScoreCard}
                onClose={() => setSelectedScoreCard(null)}
                scoreType={selectedScoreCard?.type || 'cdr'}
                scoreTitle={selectedScoreCard?.title || ''}
                score={selectedScoreCard?.score || 0}
            />
        </main>
    );
}