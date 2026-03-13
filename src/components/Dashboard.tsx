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
    ChevronRight, BrainCircuit, CreditCard, Smartphone, BarChart3, Shield, TrendingUp, ArrowRight
} from 'lucide-react';
import {useAuth} from '../context/AuthContext';

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

    const [overallScore, setOverallScore] = useState(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [scoreHistory, setScoreHistory] = useState<ScoreHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedScoreCard, setSelectedScoreCard] = useState<{
        type: 'cdr' | 'transaction' | 'behavioral';
        title: string;
        score: number;
    } | null>(null);

    const [selectedHistoryId, setSelectedHistoryId] = useState<string>("");

    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                const API_BASE = "http://localhost:8000/api";
                const userId = user?.id;

                const [scoreRes, historyRes] = await Promise.all([
                    fetch(`${API_BASE}/dashboard/score?user_id=${userId}`),
                    fetch(`${API_BASE}/dashboard/history?user_id=${userId}`)
                ]);

                if (!scoreRes.ok) throw new Error("Failed to load score");
                if (!historyRes.ok) throw new Error("Failed to load history");

                const scoreData = await scoreRes.json();
                const historyData = await historyRes.json();

                setOverallScore(scoreData.overallScore);
                setCategories(scoreData.categories || []);
                setScoreHistory(historyData || []);

                if (historyData.length > 0) {
                    setSelectedHistoryId(historyData[0].id);
                }

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }

        };

        fetchDashboardData();

    }, [user]);

    const handleExport = () => {

        let csvContent = "data:text/csv;charset=utf-8,Category,Score,Metric,Value\n";

        csvContent += `Overall,${overallScore},,\n`;

        categories.forEach((cat) => {
            cat.subMetrics.forEach((metric) => {
                csvContent += `${cat.title},${cat.score},${metric.label},${metric.value}\n`;
            });
        });

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "investment_score.csv");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="text-white text-center py-20">
                Loading dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-danger text-center py-20">
                {error}
            </div>
        );
    }

    const hasData = categories.length > 0;

    if (!hasData) {
        return (
            <EmptyDashboard
                userName={user?.name}
                onNavigate={onNavigate}
            />
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 py-8">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {user ? `Welcome back, ${user.name}` : "Dashboard"}
                    </h1>

                    <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                        <Clock className="w-4 h-4"/>
                        <span>
              Last scored: {scoreHistory.find(s => s.id === selectedHistoryId)?.date}
            </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">

                    <Button
                        variant="secondary"
                        onClick={handleExport}
                        icon={<Download className="w-4 h-4"/>}
                    >
                        Export CSV
                    </Button>

                    <Button
                        variant="primary"
                        onClick={() => onNavigate("upload")}
                        icon={<Upload className="w-4 h-4"/>}
                    >
                        Upload New Data
                    </Button>

                </div>
            </div>

            {/* Overall Score */}

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

                        <motion.button
                            initial={{opacity: 0, y: 4}}
                            whileInView={{opacity: 1, y: 0}}
                            transition={{delay: index * 0.1 + 0.4}}
                            onClick={() =>
                                setSelectedScoreCard({
                                    type: category.type,
                                    title: category.title,
                                    score: category.score
                                })
                            }
                            className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-white/5 bg-white/2 hover:bg-white/5 hover:border-primary/30 text-xs text-gray-400 hover:text-primary"
                        >

                            <Sparkles className="w-3.5 h-3.5"/>
                            AI Recommendations
                            <ChevronRight className="w-3.5 h-3.5 ml-auto"/>

                        </motion.button>

                    </div>

                ))}

            </div>

            {/* Score History */}

            <section>

                <div className="flex items-center gap-3 mb-6">
                    <History className="w-5 h-5 text-primary"/>
                    <h2 className="text-lg font-semibold text-white">
                        Previous Assessments
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    {scoreHistory.map((item) => (

                        <button
                            key={item.id}
                            onClick={() => setSelectedHistoryId(item.id)}
                            className={`glass-panel rounded-xl p-5 text-left transition-all
              ${selectedHistoryId === item.id
                                ? "border-primary/40"
                                : "hover:border-white/10"
                            }`}
                        >

                            <div className="flex justify-between mb-3">
                <span className="text-xs text-gray-500">
                  {item.date}
                </span>

                                <span className={`text-xs font-mono font-bold ${item.change >= 0
                                    ? "text-primary"
                                    : "text-danger"
                                }`}>
                  {item.change >= 0 ? "+" : ""}
                                    {item.change}
                </span>
                            </div>

                            <div className="text-3xl font-bold text-white font-mono mb-4">
                                {item.overall}
                            </div>

                        </button>

                    ))}

                </div>

            </section>

            {/* AI Modal */}

            <AIRecommendationModal
                isOpen={!!selectedScoreCard}
                onClose={() => setSelectedScoreCard(null)}
                scoreType={selectedScoreCard?.type || "cdr"}
                scoreTitle={selectedScoreCard?.title || ""}
                score={selectedScoreCard?.score || 0}
            />

        </main>
    );

    // ─── Empty Dashboard ──────────────────────────────────────────────────────────
    function EmptyDashboard({
                                userName,
                                onNavigate


                            }: { userName?: string; onNavigate: (page: string) => void; }) {
        const scoreTypes = [
            {
                icon: Smartphone,
                title: 'CDR Analysis',
                description:
                    'Call patterns, SMS frequency, network usage & communication behavior',
                color: '#00D4AA',
                metrics: ['Call Frequency', 'SMS Patterns', 'Network Usage']
            },
            {
                icon: CreditCard,
                title: 'Transaction Score',
                description:
                    'Payment history, spending patterns, cash flow analysis & financial health',
                color: '#3B82F6',
                metrics: ['Inflow/Outflow', 'Spending Diversity', 'Payment History']
            },
            {
                icon: BrainCircuit,
                title: 'Behavioral Score',
                description:
                    'Digital footprint consistency, bill payments & savings activity patterns',
                color: '#8B5CF6',
                metrics: ['Bill Payments', 'Savings Activity', 'Risk Profile']
            }];

        return (
            <main className="max-w-5xl mx-auto px-4 py-8">
                {/* Hero Section */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 16
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        duration: 0.5
                    }}
                    className="text-center mb-12">

                    <div className="mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            {userName ? `Welcome, ${userName}` : 'Welcome to InvestorLens'}
                        </h1>
                        <p className="text-gray-400 max-w-lg mx-auto text-base leading-relaxed">
                            Upload your CDR and transaction data to generate a comprehensive
                            investment readiness score powered by AI.
                        </p>
                    </div>

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1
                        }}
                        transition={{
                            delay: 0.2,
                            duration: 0.4
                        }}>

                        <Button
                            onClick={() => onNavigate('upload')}
                            icon={<Upload className="w-4 h-4"/>}
                            className="px-8 py-3.5 text-base">

                            Upload Your First Data
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Score Preview Graphic */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 24
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        delay: 0.15,
                        duration: 0.5
                    }}
                    className="glass-panel rounded-2xl p-8 md:p-10 mb-8 relative overflow-hidden">

                    {/* Background glow */}
                    <div
                        className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4 pointer-events-none"/>
                    <div
                        className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none"/>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        {/* Score Preview */}
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <svg
                                    width="160"
                                    height="160"
                                    viewBox="0 0 160 160"
                                    className="transform -rotate-90">

                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="68"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.05)"
                                        strokeWidth="12"/>

                                    <motion.circle
                                        cx="80"
                                        cy="80"
                                        r="68"
                                        fill="none"
                                        stroke="url(#scoreGradient)"
                                        strokeWidth="12"
                                        strokeLinecap="round"
                                        strokeDasharray={2 * Math.PI * 68}
                                        initial={{
                                            strokeDashoffset: 2 * Math.PI * 68
                                        }}
                                        animate={{
                                            strokeDashoffset: 2 * Math.PI * 68 * 0.65
                                        }}
                                        transition={{
                                            delay: 0.5,
                                            duration: 1.5,
                                            ease: 'easeOut'
                                        }}/>

                                    <defs>
                                        <linearGradient
                                            id="scoreGradient"
                                            x1="0%"
                                            y1="0%"
                                            x2="100%"
                                            y2="100%">

                                            <stop offset="0%" stopColor="#00D4AA"/>
                                            <stop offset="100%" stopColor="#3B82F6"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white/20 font-mono">
                  —
                </span>
                                    <span className="text-xs text-gray-600 font-mono uppercase tracking-wider mt-1">
                  No Score
                </span>
                                </div>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Your Investment Readiness Score
                            </h2>
                            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-md">
                                Our AI analyzes your communication patterns, financial
                                transactions, and behavioral signals to generate a comprehensive
                                score that reflects your investment readiness.
                            </p>

                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                {[
                                    {
                                        icon: BarChart3,
                                        label: 'ML-Powered Analysis',
                                        color: 'text-primary'
                                    },
                                    {
                                        icon: Shield,
                                        label: 'Secure Processing',
                                        color: 'text-blue-400'
                                    },
                                    {
                                        icon: TrendingUp,
                                        label: 'AI Recommendations',
                                        color: 'text-purple-400'
                                    }].map((badge, i) =>
                                    <motion.div
                                        key={badge.label}
                                        initial={{
                                            opacity: 0,
                                            y: 8
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        transition={{
                                            delay: 0.4 + i * 0.1
                                        }}
                                        className="flex items-center gap-1.5 bg-white/[0.03] border border-white/5 rounded-full px-3 py-1.5">

                                        <badge.icon className={`w-3.5 h-3.5 ${badge.color}`}/>
                                        <span className="text-xs text-gray-400">{badge.label}</span>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Score Type Cards */}
                <div className="mb-8">
                    <h3 className="text-sm font-mono uppercase tracking-widest text-gray-600 mb-5 text-center">
                        What you'll get
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {scoreTypes.map((type, i) =>
                            <motion.div
                                key={type.title}
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                transition={{
                                    delay: 0.3 + i * 0.1,
                                    duration: 0.4
                                }}
                                className="glass-panel rounded-xl p-5 relative overflow-hidden group">

                                {/* Subtle top accent */}
                                <div
                                    className="absolute top-0 left-0 right-0 h-px"
                                    style={{
                                        background: `linear-gradient(90deg, transparent, ${type.color}40, transparent)`
                                    }}/>


                                <div className="flex items-start gap-3 mb-4">
                                    <div
                                        className="p-2 rounded-lg shrink-0"
                                        style={{
                                            backgroundColor: `${type.color}15`
                                        }}>

                                        <type.icon
                                            className="w-5 h-5"
                                            style={{
                                                color: type.color
                                            }}/>

                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white text-sm">
                                            {type.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                            {type.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Placeholder metrics */}
                                <div className="space-y-2">
                                    {type.metrics.map((metric, j) =>
                                        <div
                                            key={metric}
                                            className="flex items-center justify-between">

                                            <span className="text-xs text-gray-500">{metric}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            backgroundColor: `${type.color}30`
                                                        }}
                                                        initial={{
                                                            width: 0
                                                        }}
                                                        animate={{
                                                            width: `${40 + j * 20}%`
                                                        }}
                                                        transition={{
                                                            delay: 0.6 + i * 0.1 + j * 0.05,
                                                            duration: 0.8
                                                        }}/>

                                                </div>
                                                <span className="text-xs font-mono text-gray-700">—</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* How it works */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 16
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        delay: 0.6,
                        duration: 0.4
                    }}
                    className="glass-panel rounded-xl p-6">

                    <h3 className="text-sm font-mono uppercase tracking-widest text-gray-600 mb-5 text-center">
                        How it works
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        {[
                            {
                                step: '01',
                                title: 'Upload',
                                desc: 'Upload your CDR and transaction CSV files'
                            },
                            {
                                step: '02',
                                title: 'Validate',
                                desc: 'We check data integrity and format'
                            },
                            {
                                step: '03',
                                title: 'Analyze',
                                desc: 'AI models extract features and score'
                            },
                            {
                                step: '04',
                                title: 'Insights',
                                desc: 'Get your score with AI recommendations'
                            }].map((item, i) =>
                                <motion.div
                                    key={item.step}
                                    initial={{
                                        opacity: 0,
                                        y: 12
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    transition={{
                                        delay: 0.7 + i * 0.08
                                    }}
                                    className="flex flex-col items-center text-center p-3">

              <span className="text-2xl font-bold font-mono text-primary/30 mb-2">
                {item.step}
              </span>
                                    <h4 className="text-sm font-semibold text-white mb-1">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </motion.div>
                        )}
                    </div>

                    <div className="flex justify-center mt-6">
                        <Button
                            variant="outline"
                            onClick={() => onNavigate('upload')}
                            icon={<ArrowRight className="w-4 h-4"/>}>

                            Get Started
                        </Button>
                    </div>
                </motion.div>
            </main>);

    }
}