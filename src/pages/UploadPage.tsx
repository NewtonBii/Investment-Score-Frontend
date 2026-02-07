import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Smartphone,
  CreditCard } from
'lucide-react';
import { Button } from '../components/ui/Button';
interface UploadPageProps {
  onNavigate: (page: string) => void;
}
type FileType = 'cdr' | 'transaction';
export function UploadPage({ onNavigate }: UploadPageProps) {
  const [selectedType, setSelectedType] = useState<FileType | null>(null);
  const [files, setFiles] = useState<{
    cdr?: File;
    transaction?: File;
  }>({});
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'validating' | 'ready'>(
    'idle');
  const [validationSteps, setValidationSteps] = useState([
  {
    label: 'Checking CSV format',
    status: 'pending'
  },
  {
    label: 'Detecting missing entries',
    status: 'pending'
  },
  {
    label: 'Validating data types',
    status: 'pending'
  }]
  );
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFiles((prev) => ({
        ...prev,
        [selectedType]: droppedFile
      }));
      simulateValidation();
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedType || !e.target.files?.[0]) return;
    setFiles((prev) => ({
      ...prev,
      [selectedType]: e.target.files![0]
    }));
    simulateValidation();
  };
  const simulateValidation = () => {
    setUploadStatus('validating');
    // Reset steps
    setValidationSteps((steps) =>
    steps.map((s) => ({
      ...s,
      status: 'pending'
    }))
    );
    // Animate steps
    setTimeout(() => {
      setValidationSteps((steps) => [
      {
        ...steps[0],
        status: 'complete'
      },
      {
        ...steps[1],
        status: 'loading'
      },
      steps[2]]
      );
    }, 800);
    setTimeout(() => {
      setValidationSteps((steps) => [
      steps[0],
      {
        ...steps[1],
        status: 'complete'
      },
      {
        ...steps[2],
        status: 'loading'
      }]
      );
    }, 1600);
    setTimeout(() => {
      setValidationSteps((steps) =>
      steps.map((s) => ({
        ...s,
        status: 'complete'
      }))
      );
      setUploadStatus('ready');
    }, 2400);
  };
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">
            Upload Your Data
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Upload your Call Detail Records (CDR) and Transaction history to
            generate your investment readiness score.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: File Type Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-white mb-4">
              1. Select Data Type
            </h2>

            <div
              onClick={() => setSelectedType('cdr')}
              className={`
                p-6 rounded-xl border cursor-pointer transition-all duration-200 flex items-center gap-4
                ${selectedType === 'cdr' ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(0,212,170,0.2)]' : 'bg-surface border-white/10 hover:border-white/20'}
              `}>

              <div
                className={`p-3 rounded-lg ${selectedType === 'cdr' ? 'bg-primary text-background' : 'bg-white/5 text-gray-400'}`}>

                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className={`font-medium ${selectedType === 'cdr' ? 'text-primary' : 'text-white'}`}>

                  CDR Data
                </h3>
                <p className="text-sm text-gray-400">
                  Call logs, SMS frequency, duration
                </p>
              </div>
              {files.cdr &&
              <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
              }
            </div>

            <div
              onClick={() => setSelectedType('transaction')}
              className={`
                p-6 rounded-xl border cursor-pointer transition-all duration-200 flex items-center gap-4
                ${selectedType === 'transaction' ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(0,212,170,0.2)]' : 'bg-surface border-white/10 hover:border-white/20'}
              `}>

              <div
                className={`p-3 rounded-lg ${selectedType === 'transaction' ? 'bg-primary text-background' : 'bg-white/5 text-gray-400'}`}>

                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className={`font-medium ${selectedType === 'transaction' ? 'text-primary' : 'text-white'}`}>

                  Transaction Data
                </h3>
                <p className="text-sm text-gray-400">
                  Inflows, outflows, bill payments
                </p>
              </div>
              {files.transaction &&
              <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
              }
            </div>
          </div>

          {/* Right Column: Upload Zone */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-white mb-4">
              2. Upload CSV File
            </h2>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className={`
                h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center transition-all duration-200
                ${selectedType ? 'border-white/20 bg-surface/50 hover:bg-surface/80 hover:border-primary/50' : 'border-white/5 bg-surface/20 opacity-50 cursor-not-allowed'}
              `}>

              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-white font-medium mb-2">
                {selectedType ?
                `Drop ${selectedType === 'cdr' ? 'CDR' : 'Transaction'} CSV here` :
                'Select a data type first'}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                or click to browse files
              </p>

              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                disabled={!selectedType}
                className="hidden"
                id="file-upload" />

              <label
                htmlFor="file-upload"
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${selectedType ? 'bg-white/10 text-white hover:bg-white/20 cursor-pointer' : 'bg-white/5 text-gray-500 cursor-not-allowed'}
                `}>

                Browse Files
              </label>
            </div>

            {/* Validation Feedback */}
            <AnimatePresence>
              {(uploadStatus === 'validating' || uploadStatus === 'ready') &&
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0
                }}
                animate={{
                  opacity: 1,
                  height: 'auto'
                }}
                className="bg-surface border border-white/10 rounded-xl p-4 space-y-3">

                  {validationSteps.map((step, i) =>
                <div key={i} className="flex items-center gap-3">
                      {step.status === 'pending' &&
                  <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                  }
                      {step.status === 'loading' &&
                  <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  }
                      {step.status === 'complete' &&
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  }
                      <span
                    className={`text-sm ${step.status === 'complete' ? 'text-white' : 'text-gray-500'}`}>

                        {step.label}
                      </span>
                    </div>
                )}
                </motion.div>
              }
            </AnimatePresence>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-12 flex justify-end">
          <Button
            onClick={() => onNavigate('processing')}
            disabled={
            Object.keys(files).length === 0 || uploadStatus !== 'ready'
            }
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full md:w-auto">

            Process & Score Data
          </Button>
        </div>
      </div>
    </div>);

}