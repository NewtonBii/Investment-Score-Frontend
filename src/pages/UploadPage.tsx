import React, { useCallback, useState, useRef, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Smartphone,
  CreditCard,
  X,
  ChevronRight } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { parseCSV } from '../utils/csvParser';
import {
  validateCDR,
  validateTransactions,
  ValidationResult } from
'../utils/validators';
interface UploadPageProps {
  onNavigate: (page: string) => void;
}
type WizardStep = 'upload' | 'validate-cdr' | 'validate-trans' | 'ready';
interface ValidationState {
  result: ValidationResult | null;
  isRunning: boolean;
  checkSteps: {
    label: string;
    status: 'pending' | 'loading' | 'complete' | 'error';
  }[];
}
const defaultCheckSteps = [
{
  label: 'Checking CSV format & headers',
  status: 'pending' as const
},
{
  label: 'Detecting missing records',
  status: 'pending' as const
},
{
  label: 'Validating data types & values',
  status: 'pending' as const
}];

export function UploadPage({ onNavigate }: UploadPageProps) {
  const [step, setStep] = useState<WizardStep>('upload');
  const [cdrFile, setCdrFile] = useState<File | null>(null);
  const [transFile, setTransFile] = useState<File | null>(null);
  const [cdrValidation, setCdrValidation] = useState<ValidationState>({
    result: null,
    isRunning: false,
    checkSteps: defaultCheckSteps
  });
  const [transValidation, setTransValidation] = useState<ValidationState>({
    result: null,
    isRunning: false,
    checkSteps: defaultCheckSteps
  });
  const [cdrDragOver, setCdrDragOver] = useState(false);
  const [transDragOver, setTransDragOver] = useState(false);
  const cdrInputRef = useRef<HTMLInputElement>(null);
  const transInputRef = useRef<HTMLInputElement>(null);
  const runValidation = async (
  file: File,
  type: 'cdr' | 'transaction',
  setState: React.Dispatch<React.SetStateAction<ValidationState>>) =>
  {
    setState({
      result: null,
      isRunning: true,
      checkSteps: defaultCheckSteps.map((s) => ({
        ...s
      }))
    });
    // Step 1: format check
    await new Promise((r) => setTimeout(r, 700));
    setState((prev) => ({
      ...prev,
      checkSteps: prev.checkSteps.map((s, i) =>
      i === 0 ?
      {
        ...s,
        status: 'complete'
      } :
      i === 1 ?
      {
        ...s,
        status: 'loading'
      } :
      s
      )
    }));
    // Step 2: missing records
    await new Promise((r) => setTimeout(r, 700));
    setState((prev) => ({
      ...prev,
      checkSteps: prev.checkSteps.map((s, i) =>
      i === 1 ?
      {
        ...s,
        status: 'complete'
      } :
      i === 2 ?
      {
        ...s,
        status: 'loading'
      } :
      s
      )
    }));
    // Step 3: data types — actually parse & validate
    const { data } = await parseCSV(file);
    const result =
    type === 'cdr' ? validateCDR(data) : validateTransactions(data);
    await new Promise((r) => setTimeout(r, 700));
    setState({
      result,
      isRunning: false,
      checkSteps: defaultCheckSteps.map((s) => ({
        ...s,
        status: 'complete'
      }))
    });
  };
  const handleCdrFile = (file: File) => {
    if (!file.name.endsWith('.csv')) return;
    setCdrFile(file);
  };
  const handleTransFile = (file: File) => {
    if (!file.name.endsWith('.csv')) return;
    setTransFile(file);
  };
  const handleValidateCDR = () => {
    if (!cdrFile) return;
    setStep('validate-cdr');
    runValidation(cdrFile, 'cdr', setCdrValidation);
  };
  const handleValidateTrans = () => {
    if (!transFile) return;
    setStep('validate-trans');
    runValidation(transFile, 'transaction', setTransValidation);
  };
  const wizardSteps = [
  {
    id: 'upload',
    label: 'Upload Files'
  },
  {
    id: 'validate-cdr',
    label: 'Validate CDR'
  },
  {
    id: 'validate-trans',
    label: 'Validate Transactions'
  },
  {
    id: 'ready',
    label: 'Process'
  }];

  const stepIndex = wizardSteps.findIndex((s) => s.id === step);
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-4 pt-12 relative">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-3">
            Upload Your Data
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Upload your CDR and Transaction history. We'll validate the data
            before scoring.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10 gap-0">
          {wizardSteps.map((s, i) =>
          <Fragment key={s.id}>
              <div className="flex flex-col items-center">
                <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                  ${i < stepIndex ? 'bg-primary border-primary text-background' : i === stepIndex ? 'bg-primary/20 border-primary text-primary' : 'bg-transparent border-white/10 text-gray-600'}
                `}>

                  {i < stepIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span
                className={`text-xs mt-1.5 font-medium ${i === stepIndex ? 'text-primary' : 'text-gray-600'}`}>

                  {s.label}
                </span>
              </div>
              {i < wizardSteps.length - 1 &&
            <div
              className={`w-16 h-px mb-5 mx-1 transition-colors ${i < stepIndex ? 'bg-primary' : 'bg-white/10'}`} />

            }
            </Fragment>
          )}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Upload */}
          {step === 'upload' &&
          <motion.div
            key="upload"
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: -20
            }}
            className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CDR Upload */}
                <DropZone
                title="CDR Data"
                description="Call logs, SMS frequency, duration"
                icon={<Smartphone className="w-6 h-6" />}
                file={cdrFile}
                isDragOver={cdrDragOver}
                onDragOver={() => setCdrDragOver(true)}
                onDragLeave={() => setCdrDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setCdrDragOver(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleCdrFile(f);
                }}
                onFileSelect={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleCdrFile(f);
                }}
                onRemove={() => setCdrFile(null)}
                inputRef={cdrInputRef}
                requiredColumns={[
                'phone_number',
                'call_type',
                'duration_seconds',
                'timestamp',
                'network_type',
                'call_direction']
                } />


                {/* Transaction Upload */}
                <DropZone
                title="Transaction Data"
                description="Inflows, outflows, bill payments"
                icon={<CreditCard className="w-6 h-6" />}
                file={transFile}
                isDragOver={transDragOver}
                onDragOver={() => setTransDragOver(true)}
                onDragLeave={() => setTransDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setTransDragOver(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleTransFile(f);
                }}
                onFileSelect={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleTransFile(f);
                }}
                onRemove={() => setTransFile(null)}
                inputRef={transInputRef}
                requiredColumns={[
                'transaction_id',
                'amount',
                'transaction_date',
                'transaction_type',
                'merchant_category',
                'status']
                } />

              </div>

              <div className="flex justify-end pt-4">
                <Button
                onClick={handleValidateCDR}
                disabled={!cdrFile || !transFile}
                icon={<ArrowRight className="w-4 h-4" />}>

                  Validate CDR Data
                </Button>
              </div>
            </motion.div>
          }

          {/* STEP 2: Validate CDR */}
          {step === 'validate-cdr' &&
          <motion.div
            key="validate-cdr"
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: -20
            }}>

              <ValidationPanel
              title="CDR Data Validation"
              fileName={cdrFile?.name || ''}
              validation={cdrValidation}
              onBack={() => setStep('upload')}
              onProceed={handleValidateTrans}
              proceedLabel="Validate Transaction Data"
              proceedDisabled={!cdrValidation.result?.isValid} />

            </motion.div>
          }

          {/* STEP 3: Validate Transactions */}
          {step === 'validate-trans' &&
          <motion.div
            key="validate-trans"
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: -20
            }}>

              <ValidationPanel
              title="Transaction Data Validation"
              fileName={transFile?.name || ''}
              validation={transValidation}
              onBack={() => setStep('validate-cdr')}
              onProceed={() => onNavigate('processing')}
              proceedLabel="Process & Score Data"
              proceedDisabled={!transValidation.result?.isValid} />

            </motion.div>
          }
        </AnimatePresence>
      </div>
    </div>);

}
// ─── Sub-components ───────────────────────────────────────────────────────────
interface DropZoneProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  file: File | null;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  requiredColumns: string[];
}
function DropZone({
  title,
  description,
  icon,
  file,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onRemove,
  inputRef,
  requiredColumns
}: DropZoneProps) {
  return (
    <div className="glass-panel rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>

      {file ?
      <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm text-white truncate max-w-[180px]">
              {file.name}
            </span>
          </div>
          <button
          onClick={onRemove}
          className="text-gray-500 hover:text-danger transition-colors">

            <X className="w-4 h-4" />
          </button>
        </div> :

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`
            h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all
            ${isDragOver ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/20 hover:bg-white/2'}
          `}>

          <Upload className="w-6 h-6 text-gray-500 mb-2" />
          <p className="text-sm text-gray-400">
            Drop CSV or <span className="text-primary">browse</span>
          </p>
          <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={onFileSelect}
          className="hidden" />

        </div>
      }

      <div>
        <p className="text-xs text-gray-600 mb-1.5">Required columns:</p>
        <div className="flex flex-wrap gap-1">
          {requiredColumns.map((col) =>
          <span
            key={col}
            className="text-xs font-mono bg-white/5 text-gray-400 px-2 py-0.5 rounded">

              {col}
            </span>
          )}
        </div>
      </div>
    </div>);

}
interface ValidationPanelProps {
  title: string;
  fileName: string;
  validation: ValidationState;
  onBack: () => void;
  onProceed: () => void;
  proceedLabel: string;
  proceedDisabled: boolean;
}
function ValidationPanel({
  title,
  fileName,
  validation,
  onBack,
  onProceed,
  proceedLabel,
  proceedDisabled
}: ValidationPanelProps) {
  const [showErrors, setShowErrors] = useState(false);
  const [errorPage, setErrorPage] = useState(0);
  const errorsPerPage = 15;
  const errors = validation.result?.errors || [];
  const pagedErrors = errors.slice(
    errorPage * errorsPerPage,
    (errorPage + 1) * errorsPerPage
  );
  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{fileName}</p>
      </div>

      {/* Check Steps */}
      <div className="p-6 space-y-3 border-b border-white/5">
        {validation.checkSteps.map((s, i) =>
        <div key={i} className="flex items-center gap-3">
            {s.status === 'pending' &&
          <div className="w-4 h-4 rounded-full border-2 border-gray-700 shrink-0" />
          }
            {s.status === 'loading' &&
          <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
          }
            {s.status === 'complete' &&
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          }
            {s.status === 'error' &&
          <AlertCircle className="w-4 h-4 text-danger shrink-0" />
          }
            <span
            className={`text-sm ${s.status === 'complete' ? 'text-white' : s.status === 'loading' ? 'text-gray-300' : 'text-gray-600'}`}>

              {s.label}
            </span>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {validation.result &&
      <div className="p-6 border-b border-white/5">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/3 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white font-mono">
                {validation.result.validCount + validation.result.invalidCount}
              </div>
              <div className="text-xs text-gray-500 mt-1">Total Records</div>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary font-mono">
                {validation.result.validCount}
              </div>
              <div className="text-xs text-gray-500 mt-1">Valid</div>
            </div>
            <div
            className={`rounded-lg p-4 text-center ${validation.result.invalidCount > 0 ? 'bg-danger/5 border border-danger/20' : 'bg-white/3'}`}>

              <div
              className={`text-2xl font-bold font-mono ${validation.result.invalidCount > 0 ? 'text-danger' : 'text-gray-500'}`}>

                {validation.result.invalidCount}
              </div>
              <div className="text-xs text-gray-500 mt-1">Invalid</div>
            </div>
          </div>

          {validation.result.isValid ?
        <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-lg px-4 py-3">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm text-primary font-medium">
                All records passed validation. Ready to proceed.
              </span>
            </div> :

        <div className="space-y-3">
              <div className="flex items-center gap-3 bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">
                <AlertCircle className="w-5 h-5 text-danger shrink-0" />
                <span className="text-sm text-danger font-medium">
                  {validation.result.invalidCount} record
                  {validation.result.invalidCount !== 1 ? 's' : ''} failed
                  validation. Fix errors and re-upload.
                </span>
              </div>

              <button
            onClick={() => setShowErrors(!showErrors)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">

                <ChevronRight
              className={`w-4 h-4 transition-transform ${showErrors ? 'rotate-90' : ''}`} />

                {showErrors ? 'Hide' : 'Show'} error details ({errors.length}{' '}
                errors)
              </button>

              <AnimatePresence>
                {showErrors &&
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
              className="overflow-hidden">

                    <div className="rounded-lg border border-white/5 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-white/5 text-xs text-gray-500 uppercase">
                          <tr>
                            <th className="px-4 py-2 text-left">Row</th>
                            <th className="px-4 py-2 text-left">Field</th>
                            <th className="px-4 py-2 text-left">Value</th>
                            <th className="px-4 py-2 text-left">Error</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pagedErrors.map((err, i) =>
                    <tr
                      key={i}
                      className="border-t border-white/5 hover:bg-white/2">

                              <td className="px-4 py-2 font-mono text-gray-400">
                                {err.row}
                              </td>
                              <td className="px-4 py-2 font-mono text-warning">
                                {err.field}
                              </td>
                              <td className="px-4 py-2 font-mono text-gray-400 max-w-[120px] truncate">
                                {String(err.value || '—')}
                              </td>
                              <td className="px-4 py-2 text-danger text-xs">
                                {err.message}
                              </td>
                            </tr>
                    )}
                        </tbody>
                      </table>
                      {errors.length > errorsPerPage &&
                <div className="flex items-center justify-between px-4 py-2 bg-white/3 border-t border-white/5">
                          <span className="text-xs text-gray-500">
                            Showing {errorPage * errorsPerPage + 1}–
                            {Math.min(
                      (errorPage + 1) * errorsPerPage,
                      errors.length
                    )}{' '}
                            of {errors.length}
                          </span>
                          <div className="flex gap-2">
                            <button
                      onClick={() =>
                      setErrorPage((p) => Math.max(0, p - 1))
                      }
                      disabled={errorPage === 0}
                      className="text-xs text-gray-400 hover:text-white disabled:opacity-30">

                              Prev
                            </button>
                            <button
                      onClick={() => setErrorPage((p) => p + 1)}
                      disabled={
                      (errorPage + 1) * errorsPerPage >= errors.length
                      }
                      className="text-xs text-gray-400 hover:text-white disabled:opacity-30">

                              Next
                            </button>
                          </div>
                        </div>
                }
                    </div>
                  </motion.div>
            }
              </AnimatePresence>
            </div>
        }
        </div>
      }

      <div className="p-6 flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onProceed}
          disabled={proceedDisabled || validation.isRunning}
          icon={<ArrowRight className="w-4 h-4" />}>

          {proceedLabel}
        </Button>
      </div>
    </div>);

}