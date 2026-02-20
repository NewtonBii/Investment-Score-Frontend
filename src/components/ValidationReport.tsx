import React from 'react';
import { AlertCircle, CheckCircle, XCircle, FileText } from 'lucide-react';
import { ValidationResult } from '../utils/validators';
import { Button } from './ui/Button';
interface ValidationReportProps {
  title: string;
  result: ValidationResult | null;
  fileName: string;
  onProceed: () => void;
  onReupload: () => void;
}
export function ValidationReport({
  title,
  result,
  fileName,
  onProceed,
  onReupload
}: ValidationReportProps) {
  if (!result) return null;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${result.isValid ? 'bg-green-100' : 'bg-red-100'}`}>

              {result.isValid ?
              <CheckCircle className="h-6 w-6 text-green-600" /> :

              <XCircle className="h-6 w-6 text-red-600" />
              }
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {title} Validation
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FileText className="h-4 w-4" />
                <span>{fileName}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-500">Status</div>
            <div
              className={`text-lg font-bold ${result.isValid ? 'text-green-600' : 'text-red-600'}`}>

              {result.isValid ? 'Passed' : 'Failed'}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-2 gap-4 bg-gray-50">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Valid Records</div>
          <div className="text-2xl font-bold text-green-600">
            {result.validCount}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Invalid Records</div>
          <div className="text-2xl font-bold text-red-600">
            {result.invalidCount}
          </div>
        </div>
      </div>

      {!result.isValid && result.errors.length > 0 &&
      <div className="p-6 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            Error Details
          </h4>
          <div className="bg-red-50 rounded-lg border border-red-100 max-h-60 overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-red-700 uppercase bg-red-100 sticky top-0">
                <tr>
                  <th className="px-4 py-2">Row</th>
                  <th className="px-4 py-2">Field</th>
                  <th className="px-4 py-2">Issue</th>
                  <th className="px-4 py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {result.errors.map((error, idx) =>
              <tr
                key={idx}
                className="border-b border-red-100 last:border-0 hover:bg-red-100/50">

                    <td className="px-4 py-2 font-mono text-red-800">
                      {error.row}
                    </td>
                    <td className="px-4 py-2 font-medium text-red-800">
                      {error.field}
                    </td>
                    <td className="px-4 py-2 text-red-700">{error.message}</td>
                    <td className="px-4 py-2 font-mono text-red-600 truncate max-w-xs">
                      {String(error.value)}
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Please correct these errors in your CSV file and upload again.
          </p>
        </div>
      }

      <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
        <Button variant="secondary" onClick={onReupload}>
          Upload Different File
        </Button>
        <Button
          variant="primary"
          onClick={onProceed}
          disabled={!result.isValid}
          className={!result.isValid ? 'opacity-50 cursor-not-allowed' : ''}>

          Proceed to Next Step
        </Button>
      </div>
    </div>);

}