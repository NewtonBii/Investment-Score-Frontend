import React, { createElement } from 'react';
import { OverallScore } from './OverallScore';
import { ScoreCard, ScoreCardProps } from './ScoreCard';
import { Button } from './ui/Button';
import { Download, Upload, Clock } from 'lucide-react';
interface DashboardProps {
  onNavigate: (page: string) => void;
}
const MOCK_DATA = {
  overallScore: 50,
  categories: [
  {
    title: 'CDR Score Card',
    score: 65,
    subMetrics: [
    {
      label: 'Call Frequency',
      value: 60
    },
    {
      label: 'SMS Frequency',
      value: 40
    },
    {
      label: 'Avg Call Duration',
      value: 83
    } // 50/60 -> 83%
    ]
  },
  {
    title: 'Transaction Score Card',
    score: 70,
    subMetrics: [
    {
      label: 'Inflow Frequency',
      value: 80
    },
    {
      label: 'Outflow Frequency',
      value: 60
    },
    {
      label: 'Transaction Diversity',
      value: 87
    } // 35/40 -> 87%
    ]
  },
  {
    title: 'Behavioral Score Card',
    score: 55,
    subMetrics: [
    {
      label: 'Bill Payment',
      value: 66
    },
    {
      label: 'Savings Activity',
      value: 50
    },
    {
      label: 'Other Behavior',
      value: 60
    } // 15/25 -> 60%
    ]
  }]

};
export function Dashboard({ onNavigate }: DashboardProps) {
  const handleExport = () => {
    const csvContent =
    'data:text/csv;charset=utf-8,' +
    'Category,Score,Metric,Value\n' +
    'Overall,75,,\n' +
    'CDR,65,Call Frequency,60/80\n' +
    'CDR,65,SMS Frequency,20/50\n' +
    'Transaction,70,Inflow Frequency,40/50\n' +
    'Behavioral,55,Bill Payment,20/30';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'investment_score.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Score Card</h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
            <Clock className="w-4 h-4" />
            <span>Last scored: Jan 15, 2026 at 2:34 PM</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleExport}
            icon={<Download className="w-4 h-4" />}>

            Export CSV
          </Button>
          <Button
            variant="primary"
            onClick={() => onNavigate('upload')}
            icon={<Upload className="w-4 h-4" />}>

            Upload New Data
          </Button>
        </div>
      </div>

      <OverallScore score={MOCK_DATA.overallScore} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_DATA.categories.map((category, index) =>
        <ScoreCard
          key={category.title}
          index={index}
          title={category.title}
          score={category.score}
          subMetrics={category.subMetrics} />

        )}
      </div>
    </main>);

}