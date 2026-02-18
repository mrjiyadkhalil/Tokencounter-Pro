
import React from 'react';
import { MAX_TOKENS } from '../constants';

interface ProgressBarProps {
  current: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current }) => {
  const percentage = Math.min((current / MAX_TOKENS) * 100, 100);
  
  let bgColor = 'bg-blue-500';
  if (percentage > 90) bgColor = 'bg-red-500';
  else if (percentage > 70) bgColor = 'bg-orange-500';
  else if (percentage > 50) bgColor = 'bg-yellow-500';

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Context Utilization
        </span>
        <span className="text-sm font-bold text-slate-700">
          {percentage.toFixed(2)}%
        </span>
      </div>
      <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full ${bgColor} transition-all duration-500 ease-out relative`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-slate-400">0</span>
        <span className="text-[10px] text-slate-400">500K</span>
        <span className="text-[10px] text-slate-400">1M Tokens</span>
      </div>
    </div>
  );
};
