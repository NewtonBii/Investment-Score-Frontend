import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Loader2,
  CheckCircle2,
  Cpu,
  Database,
  BarChart3,
  BrainCircuit } from
'lucide-react';
interface ProcessingPageProps {
  onNavigate: (page: string) => void;
}
export function ProcessingPage({ onNavigate }: ProcessingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
  {
    label: 'Extracting CDR features...',
    icon: SmartphoneIcon
  },
  {
    label: 'Extracting transaction features...',
    icon: Database
  },
  {
    label: 'Computing behavioral indicators...',
    icon: BarChart3
  },
  {
    label: 'Running ML scoring model...',
    icon: BrainCircuit
  },
  {
    label: 'Generating investment readiness score...',
    icon: Cpu
  }];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => onNavigate('dashboard'), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [onNavigate, steps.length]);
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary mx-auto mb-6 flex items-center justify-center">

            <Cpu className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2">Analyzing Data</h1>
          <p className="text-gray-400">
            Please wait while our AI processes your records
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-6">
          {steps.map((step, index) =>
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              x: -20
            }}
            animate={{
              opacity: index <= currentStep ? 1 : 0.3,
              x: 0
            }}
            className="flex items-center gap-4">

              <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center border transition-colors duration-300
                ${index < currentStep ? 'bg-primary/10 border-primary text-primary' : index === currentStep ? 'bg-white/5 border-white/20 text-white' : 'bg-transparent border-white/5 text-gray-600'}
              `}>

                {index < currentStep ?
              <CheckCircle2 className="w-5 h-5" /> :
              index === currentStep ?
              <Loader2 className="w-5 h-5 animate-spin" /> :

              <step.icon className="w-5 h-5" />
              }
              </div>

              <div className="flex-1">
                <p
                className={`text-sm font-medium transition-colors duration-300 ${index <= currentStep ? 'text-white' : 'text-gray-600'}`}>

                  {step.label}
                </p>
                {index === currentStep &&
              <motion.div
                layoutId="progressBar"
                className="h-1 bg-primary/20 rounded-full mt-2 overflow-hidden">

                    <motion.div
                  className="h-full bg-primary"
                  initial={{
                    width: '0%'
                  }}
                  animate={{
                    width: '100%'
                  }}
                  transition={{
                    duration: 1.2
                  }} />

                  </motion.div>
              }
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>);

}
function SmartphoneIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">

      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>);

}