"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Calendar, Download, CreditCard, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const earningsData = [
  { month: 'Jan', earnings: 2400, sessions: 18 },
  { month: 'Feb', earnings: 2800, sessions: 21 },
  { month: 'Mar', earnings: 3200, sessions: 24 },
  { month: 'Apr', earnings: 2900, sessions: 22 },
  { month: 'May', earnings: 3600, sessions: 27 },
  { month: 'Jun', earnings: 4200, sessions: 32 }
];

const recentTransactions = [
  { id: 1, mentee: 'Sarah Mitchell', type: 'Technical Interview', amount: 120, date: 'Oct 13, 2025', status: 'completed' },
  { id: 2, mentee: 'James Rodriguez', type: 'System Design', amount: 150, date: 'Oct 12, 2025', status: 'completed' },
  { id: 3, mentee: 'Emily Chen', type: 'Behavioral Mock', amount: 100, date: 'Oct 11, 2025', status: 'completed' },
  { id: 4, mentee: 'Michael Brown', type: 'CV Review', amount: 80, date: 'Oct 10, 2025', status: 'completed' },
  { id: 5, mentee: 'Lisa Wang', type: 'Career Guidance', amount: 90, date: 'Oct 9, 2025', status: 'pending' }
];

const sessionPricing = [
  { type: 'Technical Interview (1hr)', price: 120, sessions: 48 },
  { type: 'System Design (1.5hr)', price: 150, sessions: 32 },
  { type: 'Behavioral Mock (1hr)', price: 100, sessions: 38 },
  { type: 'CV Review (30min)', price: 80, sessions: 24 },
  { type: 'Career Guidance (1hr)', price: 90, sessions: 18 }
];

export const EarningsPage = () => {
  const [timePeriod, setTimePeriod] = useState('6months');

  const totalEarnings = earningsData.reduce((sum, item) => sum + item.earnings, 0);
  const totalSessions = earningsData.reduce((sum, item) => sum + item.sessions, 0);
  const avgPerSession = Math.round(totalEarnings / totalSessions);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[var(--foreground)] mb-2">Earnings & Revenue</h1>
        <p className="text-[var(--foreground-muted)] mb-6">Track your income and session statistics</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 backdrop-blur-xl border border-green-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +12%
              </Badge>
            </div>
            <p className="text-[var(--foreground-muted)] text-sm mb-1">Total Earnings</p>
            <p className="text-[var(--foreground)] text-2xl">${totalEarnings.toLocaleString()}</p>
            <p className="text-[var(--foreground-subtle)] text-xs mt-1">Last 6 months</p>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <p className="text-[var(--foreground-muted)] text-sm mb-1">Total Sessions</p>
            <p className="text-[var(--foreground)] text-2xl">{totalSessions}</p>
            <p className="text-[var(--foreground-subtle)] text-xs mt-1">Completed</p>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 backdrop-blur-xl border border-indigo-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <p className="text-[var(--foreground-muted)] text-sm mb-1">Avg per Session</p>
            <p className="text-[var(--foreground)] text-2xl">${avgPerSession}</p>
            <p className="text-[var(--foreground-subtle)] text-xs mt-1">Average rate</p>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <p className="text-[var(--foreground-muted)] text-sm mb-1">Pending</p>
            <p className="text-[var(--foreground)] text-2xl">$240</p>
            <p className="text-[var(--foreground-subtle)] text-xs mt-1">To be paid</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Earnings Chart */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative overflow-hidden rounded-xl backdrop-blur-xl border border-purple-500/30 p-6"
            style={{ background: 'var(--card)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[var(--foreground)] mb-1">Revenue Trend</h3>
                <p className="text-[var(--foreground-muted)] text-sm">Monthly earnings overview</p>
              </div>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">Last 3 months</SelectItem>
                  <SelectItem value="6months">Last 6 months</SelectItem>
                  <SelectItem value="12months">Last 12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5 }}
                    fill="url(#colorEarnings)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Session Pricing */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative overflow-hidden rounded-xl backdrop-blur-xl border border-purple-500/30 p-6"
          style={{ background: 'var(--card)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-[var(--foreground)]">Session Pricing</h3>
              <p className="text-[var(--foreground-muted)] text-sm">Your rates</p>
            </div>
          </div>

          <div className="space-y-3">
            {sessionPricing.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg p-4"
                style={{ background: 'var(--background-muted)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[var(--foreground)] text-sm">{item.type}</p>
                  <p className="text-green-400">${item.price}</p>
                </div>
                <p className="text-[var(--foreground-subtle)] text-xs">{item.sessions} sessions completed</p>
              </motion.div>
            ))}
          </div>

          <Button className="w-full mt-4 bg-purple-500/20 border border-purple-500/50 text-purple-300 hover:bg-purple-500/30">
            Update Pricing
          </Button>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[var(--foreground)] mb-1">Recent Transactions</h3>
            <p className="text-[var(--foreground-muted)] text-sm">Latest payment history</p>
          </div>
          <Button variant="outline" className="border-purple-500/50 bg-purple-500/10 text-purple-300">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="text-left text-[var(--foreground-muted)] text-sm py-3 px-4">Mentee</th>
                <th className="text-left text-[var(--foreground-muted)] text-sm py-3 px-4">Session Type</th>
                <th className="text-left text-[var(--foreground-muted)] text-sm py-3 px-4">Amount</th>
                <th className="text-left text-[var(--foreground-muted)] text-sm py-3 px-4">Date</th>
                <th className="text-left text-[var(--foreground-muted)] text-sm py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="hover:bg-white/5 transition-colors"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-white text-xs">{transaction.mentee.charAt(0)}</span>
                      </div>
                      <span className="text-[var(--foreground)]">{transaction.mentee}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[var(--foreground)]">{transaction.type}</td>
                  <td className="py-4 px-4 text-green-400">${transaction.amount}</td>
                  <td className="py-4 px-4 text-[var(--foreground-muted)]">{transaction.date}</td>
                  <td className="py-4 px-4">
                    <Badge className={
                      transaction.status === 'completed'
                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                        : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                    }>
                      {transaction.status}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
