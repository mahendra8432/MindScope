import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface MoodDistributionProps {
  data: Array<{
    mood: string;
    count: number;
    percentage: number;
  }>;
}

const COLORS = {
  Excellent: '#10b981',
  Good: '#3b82f6',
  Neutral: '#f59e0b',
  Poor: '#f97316',
  Terrible: '#ef4444',
};

const MoodDistribution: React.FC<MoodDistributionProps> = ({ data }) => {
  const filteredData = data.filter(item => item.count > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Mood Distribution
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          How your moods are distributed over the last 30 days
        </p>
      </div>

      {filteredData.length > 0 ? (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {filteredData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.mood as keyof typeof COLORS]} 
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value: number, name: string) => [
                    `${value} entries`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {filteredData.map((item, index) => (
              <motion.div
                key={item.mood}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[item.mood as keyof typeof COLORS] }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.mood}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.count} entries
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {item.percentage}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-500 dark:text-gray-400">
            No mood data available yet
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default MoodDistribution;