
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ComparisonProps {
  currentTokens: number;
}

export const TokenComparison: React.FC<ComparisonProps> = ({ currentTokens }) => {
  const data = [
    { name: 'Your Input', value: currentTokens, color: '#3b82f6' },
    { name: '"The Hobbit"', value: 130000, color: '#10b981' },
    { name: '"War & Peace"', value: 750000, color: '#8b5cf6' },
    { name: '1M Goal', value: 1000000, color: '#f43f5e' },
  ].sort((a, b) => a.value - b.value);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Scale Comparison</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-sm text-slate-500 leading-relaxed italic">
        Did you know? 1 million tokens is roughly equivalent to 750,000 words, or enough text to fill about 2,500 pages of a standard book.
      </p>
    </div>
  );
};
