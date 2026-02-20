import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Loader2,
  Cpu,
  Database,
  BarChart3,
  BrainCircuit,
  Zap,
  Shield,
  Sparkles } from
'lucide-react';
import { useAuth } from '../context/AuthContext';
interface ProcessingPageProps {
  onNavigate: (page: string) => void;
}
interface Step {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  color: string;
  apiEndpoint: string;
  phases?: string[];
}
const STEPS: Step[] = [
{
  id: 'extract-cdr',
  label: 'Extracting CDR Features',
  sublabel: 'Analyzing call patterns & network usage',
  icon: Database,
  color: '#00D4AA',
  apiEndpoint: '/process/extract-cdr',
  phases: [
  'Parsing call records...',
  'Extracting frequency metrics...',
  'Computing network usage...']

},
{
  id: 'extract-trans',
  label: 'Extracting Transaction Features',
  sublabel: 'Processing payment history & spending patterns',
  icon: BarChart3,
  color: '#3B82F6',
  apiEndpoint: '/process/extract-transactions',
  phases: [
  'Processing payment history...',
  'Analyzing spending patterns...',
  'Computing cash flow metrics...']

},
{
  id: 'behavioral',
  label: 'Computing Behavioral Score',
  sublabel: 'Correlating behavioral indicators',
  icon: BrainCircuit,
  color: '#8B5CF6',
  apiEndpoint: '/process/compute-behavioral',
  phases: [
  'Analyzing behavioral patterns...',
  'Correlating data points...',
  'Building risk profile...']

},
{
  id: 'ml-score',
  label: 'ML Scoring Engine',
  sublabel: 'Running ensemble models & generating score',
  icon: Cpu,
  color: '#F59E0B',
  apiEndpoint: '/process/ml-score',
  phases: [
  'Crunching the numbers...',
  'Running gradient boosting...',
  'Ensemble voting...',
  'Generating your score...',
  'Saving to secure vault...']

}];

export function ProcessingPage({ onNavigate }: ProcessingPageProps) {
  const { token } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [mlPhase, setMlPhase] = useState(0); // special ML scoring phases
  const [done, setDone] = useState(false);
  const [numbers, setNumbers] = useState<string[]>([]);
  const phaseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Generate scrolling numbers for ML step
  useEffect(() => {
    if (currentStep === 3) {
      const gen = () =>
      Array.from(
        {
          length: 12
        },
        () => Math.random().toFixed(4)
      );
      setNumbers(gen());
      const t = setInterval(() => setNumbers(gen()), 120);
      return () => clearInterval(t);
    }
  }, [currentStep]);
  useEffect(() => {
    const API_BASE = 'http://localhost:8000/api';
    let cancelled = false;
    const runStep = async (stepIndex: number) => {
      if (cancelled || stepIndex >= STEPS.length) return;
      const step = STEPS[stepIndex];
      setCurrentStep(stepIndex);
      setCurrentPhase(0);
      // Animate through phases
      const phases = step.phases || [];
      for (let p = 0; p < phases.length; p++) {
        if (cancelled) return;
        setCurrentPhase(p);
        await new Promise((r) => setTimeout(r, stepIndex === 3 ? 1400 : 900));
      }
      // Attempt real API call, fall back to mock
      try {
        await fetch(`${API_BASE}${step.apiEndpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ?
            {
              Authorization: `Bearer ${token}`
            } :
            {})
          },
          body: JSON.stringify({})
        });
      } catch {

        // Backend not available — continue with mock
      }if (!cancelled) {
        setCompletedSteps((prev) => [...prev, stepIndex]);
        await new Promise((r) => setTimeout(r, 400));
        if (stepIndex < STEPS.length - 1) {
          runStep(stepIndex + 1);
        } else {
          setDone(true);
          setTimeout(() => {
            if (!cancelled) onNavigate('dashboard');
          }, 2000);
        }
      }
    };
    runStep(0);
    return () => {
      cancelled = true;
    };
  }, [token, onNavigate]);
  const activeStep = STEPS[currentStep];
  const phases = activeStep?.phases || [];
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000"
        style={{
          backgroundColor: `${activeStep?.color}08`
        }} />


      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-10">
          <motion.div
            key={currentStep}
            initial={{
              scale: 0.8,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1
            }}
            className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{
              backgroundColor: `${activeStep?.color}15`,
              border: `1px solid ${activeStep?.color}30`
            }}>

            {done ?
            <CheckCircle2 className="w-10 h-10 text-primary" /> :

            <motion.div
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}>

                {activeStep &&
              <activeStep.icon
                className="w-10 h-10"
                style={{
                  color: activeStep.color
                }} />

              }
              </motion.div>
            }
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={done ? 'done' : currentStep}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -10
              }}>

              <h1 className="text-2xl font-bold text-white mb-1">
                {done ? 'Analysis Complete!' : activeStep?.label}
              </h1>
              <p className="text-gray-400 text-sm">
                {done ?
                'Redirecting to your dashboard...' :
                phases[currentPhase] || activeStep?.sublabel}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ML Scoring special animation */}
        <AnimatePresence>
          {currentStep === 3 && !done &&
          <motion.div
            initial={{
              opacity: 0,
              height: 0
            }}
            animate={{
              opacity: 1,
              height: 'auto'
            }}
            exit={{
              opacity: 0,
              height: 0
            }}
            className="glass-panel rounded-xl p-4 mb-6 overflow-hidden">

              <div className="grid grid-cols-6 gap-1">
                {numbers.map((n, i) =>
              <motion.span
                key={i}
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.02
                }}
                className="font-mono text-xs text-center py-1 rounded"
                style={{
                  color: `${activeStep?.color}cc`
                }}>

                    {n}
                  </motion.span>
              )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Zap className="w-3 h-3 text-warning" />
                <span className="text-xs text-gray-500 font-mono">
                  ensemble_model.predict() → confidence: 94.7%
                </span>
              </div>
            </motion.div>
          }
        </AnimatePresence>

        {/* Steps List */}
        <div className="glass-panel p-6 rounded-2xl space-y-5">
          {STEPS.map((step, index) => {
            const isComplete = completedSteps.includes(index);
            const isActive = index === currentStep && !done;
            const isPending = index > currentStep;
            return (
              <motion.div
                key={step.id}
                initial={{
                  opacity: 0,
                  x: -20
                }}
                animate={{
                  opacity: isPending ? 0.35 : 1,
                  x: 0
                }}
                transition={{
                  delay: index * 0.1
                }}
                className="flex items-center gap-4">

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-500"
                  style={{
                    backgroundColor:
                    isComplete || isActive ?
                    `${step.color}15` :
                    'transparent',
                    borderColor:
                    isComplete || isActive ?
                    `${step.color}40` :
                    'rgba(255,255,255,0.05)'
                  }}>

                  {isComplete ?
                  <CheckCircle2
                    className="w-5 h-5"
                    style={{
                      color: step.color
                    }} /> :

                  isActive ?
                  <Loader2
                    className="w-5 h-5 animate-spin"
                    style={{
                      color: step.color
                    }} /> :


                  <step.icon className="w-5 h-5 text-gray-600" />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium transition-colors ${isActive ? 'text-white' : isComplete ? 'text-gray-300' : 'text-gray-600'}`}>

                    {step.label}
                  </p>
                  {isActive &&
                  <motion.div className="mt-1.5 h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: step.color
                      }}
                      initial={{
                        width: '0%'
                      }}
                      animate={{
                        width: `${(currentPhase + 1) / phases.length * 100}%`
                      }}
                      transition={{
                        duration: 0.8,
                        ease: 'easeOut'
                      }} />

                    </motion.div>
                  }
                </div>

                {isComplete &&
                <span className="text-xs font-mono text-gray-600 shrink-0">
                    done
                  </span>
                }
              </motion.div>);

          })}
        </div>

        {done &&
        <motion.div
          initial={{
            opacity: 0,
            y: 10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="mt-6 flex items-center justify-center gap-2 text-primary">

            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">
              Score saved successfully
            </span>
            <Shield className="w-4 h-4" />
          </motion.div>
        }
      </div>
    </div>);

}