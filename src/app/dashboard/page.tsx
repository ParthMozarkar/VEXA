"use client";

/**
 * VEXA Dashboard — Internal ops + client management.
 * Shows API key management, avatar stats, marketplace overview.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Users, Zap, ShieldCheck, Key, Copy, CheckCircle2,
  Plus, Trash2, Eye, EyeOff, TrendingUp, Activity, Globe, RefreshCw,
} from 'lucide-react';
import type { DashboardStats, ApiKeyRecord } from '@/types';

const MOCK_STATS: DashboardStats = {
  totalAvatars: 14_832,
  activeMarketplaces: 3,
  tryOnsToday: 2_419,
  avgFitScore: 92.4,
  apiCallsThisMonth: 187_503,
};

const MOCK_API_KEYS: ApiKeyRecord[] = [
  { id: '1', marketplaceName: 'Myntra', key: 'vx_live_myntra_demo_key_001', createdAt: '2025-01-01', lastUsed: '2026-03-30', callCount: 89240, status: 'active' },
  { id: '2', marketplaceName: 'AJIO', key: 'vx_live_ajio_demo_key_002', createdAt: '2025-01-15', lastUsed: '2026-03-29', callCount: 52810, status: 'active' },
  { id: '3', marketplaceName: 'Amazon Fashion', key: 'vx_live_amzn_key_003', createdAt: '2025-02-10', lastUsed: '2026-03-28', callCount: 45453, status: 'active' },
];

function maskKey(key: string): string {
  return key.slice(0, 12) + '•'.repeat(12) + key.slice(-4);
}

function StatCard({ icon: Icon, label, value, trend }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; trend?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#bef264]/20 transition-colors group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#bef264]/10 flex items-center justify-center group-hover:bg-[#bef264]/20 transition-colors">
          <Icon className="w-5 h-5 text-[#bef264]" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-[#bef264] bg-[#bef264]/10 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-white/50 text-sm">{label}</p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>(MOCK_API_KEYS);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'usage'>('overview');

  const toggleReveal = (id: string) => {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyKey = async (id: string, key: string) => {
    await navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const revokeKey = (id: string) => {
    setKeys((prev) => prev.map((k) => k.id === id ? { ...k, status: 'revoked' } : k));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">VEXA Dashboard</h1>
          <p className="text-white/50 mt-1">API platform management · Last synced just now</p>
        </div>
        <button
          id="dashboard-refresh"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
        {(['overview', 'keys', 'usage'] as const).map((tab) => (
          <button
            key={tab}
            id={`dashboard-tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
              activeTab === tab
                ? 'bg-[#bef264] text-black shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total Avatars" value={MOCK_STATS.totalAvatars.toLocaleString()} trend="+12%" />
              <StatCard icon={Globe} label="Active Marketplaces" value={MOCK_STATS.activeMarketplaces.toString()} />
              <StatCard icon={Zap} label="Try-Ons Today" value={MOCK_STATS.tryOnsToday.toLocaleString()} trend="+8%" />
              <StatCard icon={TrendingUp} label="Avg Fit Score" value={`${MOCK_STATS.avgFitScore}%`} trend="+1.2%" />
            </div>

            {/* Pipeline Status */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#bef264]" />
                Pipeline Health
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Python Microservice', status: 'Operational', color: '#bef264' },
                  { label: 'R2 Storage', status: 'Operational', color: '#bef264' },
                  { label: 'Webhook Relay', status: 'Operational', color: '#bef264' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: s.color }} />
                    <div>
                      <p className="text-white text-sm font-medium">{s.label}</p>
                      <p className="text-white/40 text-xs">{s.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Volume Bar Chart Stub */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#bef264]" />
                  API Calls — Last 30 Days
                </h2>
                <span className="text-white/40 text-sm">{MOCK_STATS.apiCallsThisMonth.toLocaleString()} total</span>
              </div>
              <div className="flex items-end gap-1 h-24">
                {Array.from({ length: 30 }, (_, i) => {
                  const h = Math.random() * 80 + 10;
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-[#bef264]/30 hover:bg-[#bef264]/60 transition-colors cursor-pointer"
                      style={{ height: `${h}%` }}
                      title={`Day ${i + 1}: ~${Math.floor(h * 62)} calls`}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'keys' && (
          <motion.div
            key="keys"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">API Keys</h2>
              <button
                id="dashboard-create-key"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#bef264] text-black font-semibold text-sm hover:bg-[#a3e635] transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Key
              </button>
            </div>

            <div className="space-y-3">
              {keys.map((record) => (
                <motion.div
                  key={record.id}
                  layout
                  className={`glass-panel p-5 rounded-2xl border transition-colors ${
                    record.status === 'revoked' ? 'border-red-500/20 opacity-60' : 'border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-semibold">{record.marketplaceName}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          record.status === 'active'
                            ? 'bg-[#bef264]/20 text-[#bef264]'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-white/50 text-xs font-mono truncate">
                          {revealedKeys.has(record.id) ? record.key : maskKey(record.key)}
                        </code>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-white/30 text-xs">
                        <span>Created {record.createdAt}</span>
                        <span>Last used {record.lastUsed ?? 'never'}</span>
                        <span>{record.callCount.toLocaleString()} calls</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleReveal(record.id)}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        title={revealedKeys.has(record.id) ? 'Hide key' : 'Reveal key'}
                      >
                        {revealedKeys.has(record.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => copyKey(record.id, record.key)}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        title="Copy key"
                      >
                        {copiedId === record.id ? (
                          <CheckCircle2 className="w-4 h-4 text-[#bef264]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      {record.status === 'active' && (
                        <button
                          onClick={() => revokeKey(record.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
                          title="Revoke key"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'usage' && (
          <motion.div
            key="usage"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-panel p-6 rounded-2xl border border-white/10"
          >
            <h2 className="text-white font-semibold mb-4">Usage by Marketplace</h2>
            <div className="space-y-4">
              {MOCK_API_KEYS.map((k) => {
                const pct = Math.round((k.callCount / MOCK_STATS.apiCallsThisMonth) * 100);
                return (
                  <div key={k.id}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-white font-medium">{k.marketplaceName}</span>
                      <span className="text-white/50">{k.callCount.toLocaleString()} calls ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-[#bef264] to-[#a3e635]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
