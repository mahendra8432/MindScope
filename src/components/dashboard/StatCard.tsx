import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, color, bg, trend }) => {
  return (
    <div className={`${bg} rounded-xl p-6 border border-gray-100 hover:shadow-sm transition-all duration-200`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${bg} border border-gray-200`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↗' : '↘'} {trend.value}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

export default StatCard;