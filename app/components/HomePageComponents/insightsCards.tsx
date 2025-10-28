'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaCheckCircle } from 'react-icons/fa';
import { useTheme } from "../../../Context/ThemeContext";

export interface AnalyticsCardProps {

  icon: React.ReactNode;
  title: string;
  metrics?: {
    label: string;
    value: number;
    color: string;
  }[];
  insights?: string[];
  recommendation?: {
    matchPercentage: number;
    text: string;
  };
  delay?: number;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  icon,
  title,
  metrics,
  insights,
  recommendation,
  delay = 0
}) => {
  const { isDark } = useTheme();
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.3 }}
      className={`relative rounded-2xl p-6 md:p-8 backdrop-blur-lg overflow-hidden ${isDark
        ? 'bg-[#1b2a30] border border-gray-700/30'
        : 'bg-[#1b2a30] border border-gray-600/20'
        } shadow-2xl`}
    >

      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-cyan-500/5 pointer-events-none" />


      <div className="flex items-center gap-4 mb-6">
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          whileInView={{ rotate: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className={`p-3 rounded-xl ${isDark ? 'bg-[#00a896]/20 text-[#56e39f]' : 'bg-[#00a896]/20 text-[#56e39f]'
            }`}
        >
          {icon}
        </motion.div>
        <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-100'}`}>
          {title}
        </h3>
      </div>


      {metrics && (
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: delay + 0.4 + index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-300'}`}>
                  {metric.label}
                </span>
                <span className={`text-sm font-bold ${isDark ? 'text-[#56e39f]' : 'text-[#56e39f]'}`}>
                  {metric.value}%
                </span>
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
                <motion.div
                  custom={metric.value}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="h-full rounded-full relative overflow-hidden"
                  style={{ background: `linear-gradient(90deg, ${metric.color}88, ${metric.color})` }}
                >
                  <motion.div
                    animate={{ x: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      )}


      {insights && (
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: delay + 0.4 + index * 0.15 }}
              className="flex items-start gap-3"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <FaStar className="text-[#00a896] mt-1 text-sm" />
              </motion.div>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-300'}`}>
                {insight}
              </p>
            </motion.div>
          ))}
        </div>
      )}


      {recommendation && (
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: delay + 0.4 }}
            className="flex items-center gap-2 mb-4"
          >
            <FaCheckCircle className="text-[#56e39f]" />
            <span className="text-[#56e39f] font-semibold">Strong Match</span>
            <span className="text-[#00a896] text-sm">
              • {recommendation.matchPercentage}% compatibility
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: delay + 0.5 }}
            className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-300'}`}
          >
            {recommendation.text}
          </motion.p>
        </div>
      )}
    </motion.div>
  );
};

export default AnalyticsCard;
