import { useState } from 'react';
import { motion } from 'framer-motion';

export function PaymentOrchestrator() {
  const [selectedStrategy, setSelectedStrategy] = useState('cascade');

  const strategies = [
    { id: 'cascade', name: 'Cascade Routing', desc: 'Try primary PSP, fallback to secondary on failure', icon: '🔄' },
    { id: 'cost', name: 'Cost Optimization', desc: 'Route to lowest-cost PSP that meets requirements', icon: '💰' },
    { id: 'latency', name: 'Latency Priority', desc: 'Route to fastest PSP based on historical performance', icon: '⚡' },
    { id: 'success', name: 'Success Rate', desc: 'Route to PSP with highest approval rate for this transaction type', icon: '✅' },
  ];

  const psps = [
    { name: 'Stripe', status: 'active', success: '98.5%', cost: '2.9% + $0.30', latency: '120ms' },
    { name: 'Adyen', status: 'active', success: '97.8%', cost: '2.6% + $0.20', latency: '95ms' },
    { name: 'Braintree', status: 'standby', success: '96.2%', cost: '2.9% + $0.30', latency: '150ms' },
    { name: 'Worldpay', status: 'standby', success: '95.5%', cost: '2.75% + $0.25', latency: '180ms' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full mb-6"
        >
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
          <span className="text-indigo-400 text-sm font-medium">Multi-PSP Orchestration</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">Payment Orchestrator</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Intelligent payment routing across multiple PSPs. Maximize success rates, minimize costs.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-gray-100 mb-4">Routing Strategy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map((strategy) => (
            <button
              key={strategy.id}
              onClick={() => setSelectedStrategy(strategy.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedStrategy === strategy.id
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{strategy.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-100 mb-1">{strategy.name}</h3>
                  <p className="text-sm text-gray-400">{strategy.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-gray-100 mb-4">Payment Service Providers</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">PSP</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Success Rate</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Cost</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Latency</th>
              </tr>
            </thead>
            <tbody>
              {psps.map((psp, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4 text-gray-200 font-medium">{psp.name}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      psp.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {psp.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">{psp.success}</td>
                  <td className="py-3 px-4 text-center text-gray-300">{psp.cost}</td>
                  <td className="py-3 px-4 text-center text-cyan-400">{psp.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-emerald-400 mb-1">98.5%</div>
          <div className="text-xs text-gray-400">Overall Success Rate</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-cyan-400 mb-1">$0.45</div>
          <div className="text-xs text-gray-400">Avg Cost per Transaction</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-1">125ms</div>
          <div className="text-xs text-gray-400">Avg Latency</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-orange-400 mb-1">4</div>
          <div className="text-xs text-gray-400">Active PSPs</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-gray-100 mb-4">⚔️ VS Competitors</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Feature</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Spreedly</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">PrimeTrust</th>
                <th className="text-center py-3 px-4 text-emerald-400 font-medium">Factory Orchestrator</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Multi-PSP Routing</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓</td>
                <td className="py-3 px-4 text-center text-red-400">✗</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ AI-powered</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Ledger Integration</td>
                <td className="py-3 px-4 text-center text-red-400">✗</td>
                <td className="py-3 px-4 text-center text-red-400">✗</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Native</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Compliance Automation</td>
                <td className="py-3 px-4 text-center text-red-400">✗</td>
                <td className="py-3 px-4 text-center text-yellow-400">⚠ Basic</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Full PCI/SOC2</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-300">Cost Optimization</td>
                <td className="py-3 px-4 text-center text-red-400">✗</td>
                <td className="py-3 px-4 text-center text-red-400">✗</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-bold">✓ Auto-routing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-6 text-center"
      >
        <h3 className="text-2xl font-bold text-gray-100 mb-2">Payment Orchestrator Module</h3>
        <div className="text-4xl font-bold text-indigo-400 mb-2">$40,000</div>
        <div className="text-gray-400 mb-4">One-time setup + $5,000/month (includes PSP integrations + routing optimization)</div>
        <button className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all">
          Add to Your Factory
        </button>
      </motion.div>
    </div>
  );
}
