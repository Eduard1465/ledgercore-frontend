import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function RealTimeCompliance() {
  const [metrics, setMetrics] = useState({
    requests: 0,
    violations: 0,
    hitRate: 0,
    latency: 0,
  });

  const [events, setEvents] = useState([
    { time: '2 min ago', event: 'Blocked: S3 bucket without encryption', severity: 'high' },
    { time: '15 min ago', event: 'Allowed: Pod with security context', severity: 'low' },
    { time: '1 hour ago', event: 'Blocked: IAM policy with wildcard', severity: 'high' },
    { time: '3 hours ago', event: 'Allowed: VPC with flow logs', severity: 'low' },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        requests: Math.floor(Math.random() * 1000000) + 500000,
        violations: Math.floor(Math.random() * 100) + 20,
        hitRate: 99.5 + Math.random() * 0.5,
        latency: 2 + Math.random() * 2,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const complianceFrameworks = [
    { name: 'PCI DSS v4.0', score: 98, controls: 12, status: 'compliant' },
    { name: 'SOC2 Type II', score: 95, controls: 8, status: 'compliant' },
    { name: 'GDPR', score: 100, controls: 6, status: 'compliant' },
    { name: 'DORA', score: 97, controls: 10, status: 'compliant' },
    { name: 'MiCA', score: 92, controls: 11, status: 'compliant' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-6"
        >
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span className="text-red-400 text-sm font-medium">Live Monitoring</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">Real-Time Compliance Dashboard</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Continuous policy enforcement. Every request evaluated. Every violation blocked instantly.
        </p>
      </div>

      {/* Live Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <motion.div
          key="requests"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
        >
          <div className="text-3xl font-bold text-emerald-400 mb-1">
            {(metrics.requests / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-gray-400">Requests Evaluated</div>
          <div className="text-xs text-cyan-400 mt-1">+12%</div>
        </motion.div>
        <motion.div
          key="violations"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
        >
          <div className="text-3xl font-bold text-red-400 mb-1">{metrics.violations}</div>
          <div className="text-xs text-gray-400">Violations Blocked</div>
          <div className="text-xs text-emerald-400 mt-1">-8%</div>
        </motion.div>
        <motion.div
          key="hitrate"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
        >
          <div className="text-3xl font-bold text-cyan-400 mb-1">{metrics.hitRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-400">Policy Hit Rate</div>
          <div className="text-xs text-emerald-400 mt-1">+0.1%</div>
        </motion.div>
        <motion.div
          key="latency"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
        >
          <div className="text-3xl font-bold text-purple-400 mb-1">{metrics.latency.toFixed(1)}ms</div>
          <div className="text-xs text-gray-400">Avg Latency</div>
          <div className="text-xs text-emerald-400 mt-1">-0.2ms</div>
        </motion.div>
      </motion.div>

      {/* Compliance Frameworks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-gray-100 mb-4">Compliance Frameworks Status</h2>
        <div className="space-y-4">
          {complianceFrameworks.map((fw, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="bg-gray-800/50 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-100">{fw.name}</span>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                    {fw.controls} controls
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-emerald-400">{fw.score}%</span>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                    {fw.status}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fw.score}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Live Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-gray-100 mb-4">Live Policy Events</h2>
        <div className="space-y-2">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="bg-gray-800/50 rounded-lg p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  event.severity === 'high' ? 'bg-red-400' : 'bg-emerald-400'
                }`} />
                <span className="text-sm text-gray-300">{event.event}</span>
              </div>
              <span className="text-xs text-gray-500">{event.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-3">🛡️</div>
          <h3 className="text-lg font-bold text-gray-100 mb-2">Real-Time Enforcement</h3>
          <p className="text-sm text-gray-400">Every request evaluated against OPA policies. Violations blocked instantly.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="text-lg font-bold text-gray-100 mb-2">Live Metrics</h3>
          <p className="text-sm text-gray-400">Real-time dashboard showing compliance posture across all frameworks.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-3">🔔</div>
          <h3 className="text-lg font-bold text-gray-100 mb-2">Instant Alerts</h3>
          <p className="text-sm text-gray-400">Slack, email, and webhook notifications for compliance violations.</p>
        </div>
      </motion.div>

      {/* VS Competitors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-gray-100 mb-4">⚔️ VS Competitors</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Feature</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Vanta</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Drata</th>
                <th className="text-center py-3 px-4 text-emerald-400 font-medium">Factory Dashboard</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Real-Time Monitoring</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Periodic</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Periodic</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Continuous</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Policy Enforcement</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Manual</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Manual</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Automatic</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Evidence Collection</td>
                <td className="py-3 px-4 text-center text-yellow-400">⚠ Semi-auto</td>
                <td className="py-3 px-4 text-center text-yellow-400">⚠ Semi-auto</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Fully automated</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-300">Cost</td>
                <td className="py-3 px-4 text-center text-red-400">$50K+/year</td>
                <td className="py-3 px-4 text-center text-red-400">$40K+/year</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-bold">Included</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pricing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-6 text-center"
      >
        <h3 className="text-2xl font-bold text-gray-100 mb-2">Real-Time Compliance Dashboard</h3>
        <div className="text-4xl font-bold text-red-400 mb-2">Included</div>
        <div className="text-gray-400 mb-4">Part of Factory Platform - No additional cost</div>
        <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all">
          Enable Live Monitoring
        </button>
      </motion.div>
    </div>
  );
}
