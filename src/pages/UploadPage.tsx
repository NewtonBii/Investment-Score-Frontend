import React, {useState, useRef} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {
    Upload,
    FileText,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Smartphone,
    CreditCard,
    X,
    ChevronRight,
    RefreshCw,
    Loader2
} from
        'lucide-react';
import {Button} from '../components/ui/Button';
import {parseCSV} from '../utils/csvParser';
import {
    validateCDR,
    validateTransactions,
    ValidationResult
} from
        '../utils/validators';
import {useAuth} from "../context/AuthContext.tsx";

interface UploadPageProps {
    onNavigate: (page: string, data?: any) => void;
}

type FileStatus = 'idle' | 'parsing' | 'validating' | 'valid' | 'invalid';

interface FileState {
    file: File | null;
    status: FileStatus;
    validation: ValidationResult | null;
    checkPhase: number; // 0=none, 1=format, 2=missing, 3=types, 4=done
}

const INITIAL_STATE: FileState = {
    file: null,
    status: 'idle',
    validation: null,
    checkPhase: 0
};
const CHECK_LABELS = [
    'Checking CSV format & headers…',
    'Detecting missing records…',
    'Validating data types & values…'];

export function UploadPage({onNavigate}: UploadPageProps) {
    const [cdr, setCdr] = useState<FileState>(INITIAL_STATE);
    const [trans, setTrans] = useState<FileState>(INITIAL_STATE);
    const [cdrDragOver, setCdrDragOver] = useState(false);
    const [transDragOver, setTransDragOver] = useState(false);
    const [showCdrErrors, setShowCdrErrors] = useState(false);
    const [showTransErrors, setShowTransErrors] = useState(false);
    const [cdrErrorPage, setCdrErrorPage] = useState(0);
    const [transErrorPage, setTransErrorPage] = useState(0);
    const cdrRef = useRef<HTMLInputElement>(null);
    const transRef = useRef<HTMLInputElement>(null);
    const bothValid = cdr.status === 'valid' && trans.status === 'valid';
    const processFile = async (
        file: File,
        type: 'cdr' | 'transaction',
        setter: React.Dispatch<React.SetStateAction<FileState>>) => {
        if (!file.name.toLowerCase().endsWith('.csv')) return;
        setter({
            file,
            status: 'parsing',
            validation: null,
            checkPhase: 0
        });
        // Phase 1: format
        setter((s) => ({
            ...s,
            status: 'validating',
            checkPhase: 1
        }));
        await sleep(600);
        // Phase 2: missing
        setter((s) => ({
            ...s,
            checkPhase: 2
        }));
        await sleep(600);
        // Phase 3: types — actually parse & validate
        setter((s) => ({
            ...s,
            checkPhase: 3
        }));
        const {data} = await parseCSV(file);
        const result =
            type === 'cdr' ? validateCDR(data) : validateTransactions(data);
        await sleep(500);
        setter({
            file,
            status: result.isValid ? 'valid' : 'invalid',
            validation: result,
            checkPhase: 4
        });
    };
    const handleCdrFile = (file: File) => {
        setShowCdrErrors(false);
        setCdrErrorPage(0);
        processFile(file, 'cdr', setCdr);
    };
    const handleTransFile = (file: File) => {
        setShowTransErrors(false);
        setTransErrorPage(0);
        processFile(file, 'transaction', setTrans);
    };
    const resetCdr = () => {
        setCdr(INITIAL_STATE);
        setShowCdrErrors(false);
        setCdrErrorPage(0);
    };
    const resetTrans = () => {
        setTrans(INITIAL_STATE);
        setShowTransErrors(false);
        setTransErrorPage(0);
    };
    const { user } = useAuth();
    return (
        <div className="min-h-screen w-full">
            <main className="max-w-5xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-white mb-3">
                        Upload Your Data
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        Upload both your CDR and Transaction files below
                    </p>
                </div>

                {/* Two-column upload */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <UploadCard
                        title="CDR Data"
                        description="Call logs, SMS frequency, duration"
                        icon={<Smartphone className="w-5 h-5"/>}
                        requiredColumns={[
                            'caller_id',
                            'caller_company',
                            'receiver_id',
                            'receiver_company',
                            'timestamp',
                            'duration',]
                        }
                        state={cdr}
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
                        onReset={resetCdr}
                        inputRef={cdrRef}
                        showErrors={showCdrErrors}
                        onToggleErrors={() => setShowCdrErrors((v) => !v)}
                        errorPage={cdrErrorPage}
                        onErrorPageChange={setCdrErrorPage}/>


                    <UploadCard
                        title="Transaction Data"
                        description="Inflows, outflows, bill payments"
                        icon={<CreditCard className="w-5 h-5"/>}
                        requiredColumns={[
                            'type',
                            'amount',
                            'origin',
                            'old_orig_balance',
                            'new_orig_balance',
                            'name_destination',
                            'old_dest_balance',
                            'new_dest_balance',]
                        }
                        state={trans}
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
                        onReset={resetTrans}
                        inputRef={transRef}
                        showErrors={showTransErrors}
                        onToggleErrors={() => setShowTransErrors((v) => !v)}
                        errorPage={transErrorPage}
                        onErrorPageChange={setTransErrorPage}/>

                </div>

                {/* Action Bar */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        delay: 0.2
                    }}
                    className="glass-panel rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">

                    <div className="flex items-center gap-6 text-sm">
                        <StatusPill label="CDR" status={cdr.status}/>
                        <StatusPill label="Transaction" status={trans.status}/>
                    </div>

                    <Button
                        onClick={() =>
                            onNavigate('processing', {
                                cdrFile: cdr.file, transactionFile: trans.file, customerId: user?.id
                            })
                        }
                        disabled={!bothValid}
                        icon={<ArrowRight className="w-4 h-4"/>}>

                        Process & Score Data
                    </Button>
                </motion.div>
            </main>
        </div>);

}

// ─── Upload Card ──────────────────────────────────────────────────────────────
interface UploadCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    requiredColumns: string[];
    state: FileState;
    isDragOver: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onReset: () => void;
    inputRef: React.RefObject<HTMLInputElement>;
    showErrors: boolean;
    onToggleErrors: () => void;
    errorPage: number;
    onErrorPageChange: (p: number) => void;
}

function UploadCard({
                        title,
                        description,
                        icon,
                        requiredColumns,
                        state,
                        isDragOver,
                        onDragOver,
                        onDragLeave,
                        onDrop,
                        onFileSelect,
                        onReset,
                        inputRef,
                        showErrors,
                        onToggleErrors,
                        errorPage,
                        onErrorPageChange
                    }: UploadCardProps) {
    const isProcessing =
        state.status === 'parsing' || state.status === 'validating';
    const errorsPerPage = 10;
    const errors = state.validation?.errors || [];
    const pagedErrors = errors.slice(
        errorPage * errorsPerPage,
        (errorPage + 1) * errorsPerPage
    );
    return (
        <div className="glass-panel rounded-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-medium text-white text-sm">{title}</h3>
                        <p className="text-xs text-gray-500">{description}</p>
                    </div>
                </div>
                {state.file &&
                    <button
                        onClick={onReset}
                        className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">

                        <RefreshCw className="w-3 h-3"/>
                        Re-upload
                    </button>
                }
            </div>

            {/* Drop Zone / File Info */}
            <div className="p-5 flex-1">
                {!state.file ?
                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            onDragOver(e);
                        }}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => inputRef.current?.click()}
                        className={`
              h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all
              ${isDragOver ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'}
            `}>

                        <Upload className="w-6 h-6 text-gray-500 mb-2"/>
                        <p className="text-sm text-gray-400">
                            Drop CSV or{' '}
                            <span className="text-primary font-medium">browse</span>
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Max 50MB</p>
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".csv"
                            onChange={onFileSelect}
                            className="hidden"/>

                    </div> :

                    <div className="space-y-4">
                        {/* File name */}
                        <div
                            className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-lg px-4 py-3">
                            <FileText className="w-4 h-4 text-primary shrink-0"/>
                            <span className="text-sm text-white truncate flex-1">
                {state.file.name}
              </span>
                            <span className="text-xs text-gray-600 font-mono shrink-0">
                {(state.file.size / 1024).toFixed(1)}KB
              </span>
                        </div>

                        {/* Validation checks */}
                        {(isProcessing || state.checkPhase > 0) &&
                            <div className="space-y-2">
                                {CHECK_LABELS.map((label, i) => {
                                    const phase = i + 1;
                                    const isDone =
                                        state.checkPhase > phase || state.checkPhase === 4;
                                    const isActive = state.checkPhase === phase;
                                    const isPending = state.checkPhase < phase;
                                    return (
                                        <div key={i} className="flex items-center gap-2.5">
                                            {isDone &&
                                                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0"/>
                                            }
                                            {isActive &&
                                                <Loader2 className="w-3.5 h-3.5 text-primary animate-spin shrink-0"/>
                                            }
                                            {isPending &&
                                                <div
                                                    className="w-3.5 h-3.5 rounded-full border border-gray-700 shrink-0"/>
                                            }
                                            <span
                                                className={`text-xs ${isDone ? 'text-gray-300' : isActive ? 'text-white' : 'text-gray-600'}`}>

                        {label}
                      </span>
                                        </div>);

                                })}
                            </div>
                        }

                        {/* Result */}
                        {state.status === 'valid' && state.validation &&
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.95
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1
                                }}
                                className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-lg px-4 py-3">

                                <CheckCircle2 className="w-5 h-5 text-primary shrink-0"/>
                                <div>
                  <span className="text-sm text-primary font-medium">
                    Validation passed
                  </span>
                                    <span className="text-xs text-gray-400 ml-2">
                    {state.validation.validCount} records valid
                  </span>
                                </div>
                            </motion.div>
                        }

                        {state.status === 'invalid' && state.validation &&
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.95
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1
                                }}
                                className="space-y-3">

                                <div
                                    className="flex items-center gap-3 bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">
                                    <AlertCircle className="w-5 h-5 text-danger shrink-0"/>
                                    <div className="flex-1">
                    <span className="text-sm text-danger font-medium">
                      {state.validation.invalidCount} invalid record
                        {state.validation.invalidCount !== 1 ? 's' : ''}
                    </span>
                                        <span className="text-xs text-gray-400 ml-2">
                      {state.validation.validCount} valid
                    </span>
                                    </div>
                                </div>

                                {/* Toggle errors */}
                                <button
                                    onClick={onToggleErrors}
                                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">

                                    <ChevronRight
                                        className={`w-3.5 h-3.5 transition-transform ${showErrors ? 'rotate-90' : ''}`}/>

                                    {showErrors ? 'Hide' : 'Show'} error details ({errors.length})
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
                                                <table className="w-full text-xs">
                                                    <thead className="bg-white/5 text-gray-500 uppercase">
                                                    <tr>
                                                        <th className="px-3 py-1.5 text-left">Row</th>
                                                        <th className="px-3 py-1.5 text-left">Field</th>
                                                        <th className="px-3 py-1.5 text-left">Value</th>
                                                        <th className="px-3 py-1.5 text-left">Error</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {pagedErrors.map((err, i) =>
                                                        <tr key={i} className="border-t border-white/5">
                                                            <td className="px-3 py-1.5 font-mono text-gray-400">
                                                                {err.row}
                                                            </td>
                                                            <td className="px-3 py-1.5 font-mono text-warning">
                                                                {err.field}
                                                            </td>
                                                            <td className="px-3 py-1.5 font-mono text-gray-500 max-w-[80px] truncate">
                                                                {String(err.value || '—')}
                                                            </td>
                                                            <td className="px-3 py-1.5 text-danger">
                                                                {err.message}
                                                            </td>
                                                        </tr>
                                                    )}
                                                    </tbody>
                                                </table>
                                                {errors.length > errorsPerPage &&
                                                    <div
                                                        className="flex items-center justify-between px-3 py-1.5 bg-white/[0.02] border-t border-white/5">
                            <span className="text-xs text-gray-600">
                              {errorPage * errorsPerPage + 1}–
                                {Math.min(
                                    (errorPage + 1) * errorsPerPage,
                                    errors.length
                                )}{' '}
                                of {errors.length}
                            </span>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    onErrorPageChange(Math.max(0, errorPage - 1))
                                                                }
                                                                disabled={errorPage === 0}
                                                                className="text-xs text-gray-400 hover:text-white disabled:opacity-30">

                                                                Prev
                                                            </button>
                                                            <button
                                                                onClick={() => onErrorPageChange(errorPage + 1)}
                                                                disabled={
                                                                    (errorPage + 1) * errorsPerPage >=
                                                                    errors.length
                                                                }
                                                                className="text-xs text-gray-400 hover:text-white disabled:opacity-30">

                                                                Next
                                                            </button>
                                                        </div>
                                                    </div>
                                                }
                                            </div>

                                            <p className="text-xs text-gray-600 mt-2">
                                                Fix errors in your CSV and click "Re-upload" above.
                                            </p>
                                        </motion.div>
                                    }
                                </AnimatePresence>
                            </motion.div>
                        }
                    </div>
                }
            </div>

            {/* Required columns footer */}
            <div className="px-5 pb-4">
                <p className="text-xs text-gray-600 mb-1.5">Required columns:</p>
                <div className="flex flex-wrap gap-1">
                    {requiredColumns.map((col) =>
                            <span
                                key={col}
                                className="text-[10px] font-mono bg-white/5 text-gray-500 px-1.5 py-0.5 rounded">

              {col}
            </span>
                    )}
                </div>
            </div>
        </div>);

}

// ─── Status Pill ──────────────────────────────────────────────────────────────
function StatusPill({label, status}: { label: string; status: FileStatus; }) {
    const config = {
        idle: {
            color: 'text-gray-500',
            bg: 'bg-white/5',
            dot: 'bg-gray-600',
            text: 'Not uploaded'
        },
        parsing: {
            color: 'text-gray-300',
            bg: 'bg-white/5',
            dot: 'bg-gray-400 animate-pulse',
            text: 'Parsing…'
        },
        validating: {
            color: 'text-primary',
            bg: 'bg-primary/5',
            dot: 'bg-primary animate-pulse',
            text: 'Validating…'
        },
        valid: {
            color: 'text-primary',
            bg: 'bg-primary/10',
            dot: 'bg-primary',
            text: 'Valid ✓'
        },
        invalid: {
            color: 'text-danger',
            bg: 'bg-danger/10',
            dot: 'bg-danger',
            text: 'Invalid'
        }
    }[status];
    return (
        <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg}`}>

            <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`}/>
            <span className={`text-xs font-medium ${config.color}`}>
        {label}: {config.text}
      </span>
        </div>);

}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}