import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface MoodChartProps {
  data: Array<{
    date: string;
    mood: number;
    intensity: number;
    energy: number;
    stress: number;
  }>;
}

const MoodChart: React.FC<MoodChartProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Weekly Mood Trends
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track your emotional patterns over time (1=Poor, 5=Excellent)
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              domain={[0, 5]}
              tickCount={6}
              tickFormatter={(value) => {
                const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];
                return labels[value] || value;
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'mood') {
                  const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];
                  return [labels[Math.round(value)] || value, 'Mood'];
                }
                return [value, name];
              }}
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              name="mood"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Mood Level</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MoodChart;