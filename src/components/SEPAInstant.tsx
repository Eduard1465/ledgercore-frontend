import { useState } from 'react';
import { motion } from 'framer-motion';

export function SEPAInstant() {
  const [selectedScheme, setSelectedScheme] = useState('sepa-credit');

  const schemes = [
    { id: 'sepa-credit', name: 'SEPA Credit Transfer', desc: 'Push payments to any SEPA account', icon: '💸', time: '10 seconds' },
    { id: 'sepa-direct', name: 'SEPA Direct Debit', desc: 'Pull payments with customer mandate', icon: '🔄', time: 'D+1' },
    { id: 'sepa-instant', name: 'SEPA Instant', desc: '24/7/365 instant payments up to €100k', icon: '⚡', time: '10 seconds' },
    { id: 'sepa-request', name: 'SEPA Request to Pay', desc: 'Request payment from payer', icon: '📨', time: 'Variable' },
  ];

  const transactions = [
    { id: 'SCT-001', from: 'DE89370400440532013000', to: 'FR7630006000011234567890189', amount: 5000, status: 'completed', time: '10:23:45' },
    { id: 'SCT-002', from: 'ES9121000418450200051332', to: 'IT60X0542811101000000123456', amount: 12500, status: 'completed', time: '10:24:12' },
    { id: 'SCT-003', from: 'NL91ABNA0417164300', to: 'BE68539007547034', amount: 750, status: 'pending', time: '10:25:01' },
    { id: 'SCT-004', from: 'AT611904300234573201', to: 'CH9300762011623852957', amount: 25000, status: 'completed', time: '10:25:34' },
  ];

  const metrics = [
    { label: 'Transactions Today', value: '12,458', change: '+15.3%', icon: '📊' },
    { label: 'Total Volume', value: '€45.2M', change: '+23.7%', icon: '💰' },
    { label: 'Avg Latency', value: '8.5s', change: '-12%', icon: '⚡' },
    { label: 'Success Rate', value: '99.8%', change: '+0.2%', icon: '✅' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6"
        >
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-blue-400 text-sm font-medium">European Payments</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">SEPA Instant Payments</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Real-time euro transfers across 36 countries. 24/7/365 availability. 10-second settlement.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-gray-100 mb-4">SEPA Schemes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {schemes.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => setSelectedScheme(scheme.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedScheme === scheme.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="text-3xl mb-2">{scheme.icon}</div>
              <div className="font-bold text-gray-100 mb-1">{scheme.name}</div>
              <div className="text-xs text-gray-400 mb-2">{scheme.desc}</div>
              <div className="text-xs text-blue-400 font-bold">Settlement: {scheme.time}</div>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {metrics.map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
          >
            <div className="text-2xl mb-2">{metric.icon}</div>
            <div className="text-2xl font-bold text-blue-400 mb-1">{metric.value}</div>
            <div className="text-xs text-gray-400 mb-1">{metric.label}</div>
            <div className={`text-xs ${metric.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
              {metric.change}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-gray-100 mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Transaction ID</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">From IBAN</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">To IBAN</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Amount</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4 text-gray-200 font-mono">{tx.id}</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-xs">{tx.from}</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-xs">{tx.to}</td>
                  <td className="py-3 px-4 text-center text-blue-400 font-bold">€{tx.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      tx.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-400 font-mono">{tx.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="text-lg font-bold text-gray-100 mb-2">10-Second Settlement</h3>
          <p className="text-sm text-gray-400">Funds available to beneficiary in under 10 seconds, 24/7/365</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-3">🌍</div>
          <h3 className="text-lg font-bold text-gray-100 mb-2">36 Countries</h3>
          <p className="text-sm text-gray-400">Full SEPA coverage across EU, EEA, and associated countries</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-3">🔒</div>
          <h3 className="text-lg font-bold text-gray-100 mb-2">Bank-Grade Security</h3>
          <p className="text-sm text-gray-400">End-to-end encryption, PSD2 SCA compliance, fraud detection</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-gray-100 mb-4">⚔️ VS Competitors</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Feature</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Banking APIs</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Wise</th>
                <th className="text-center py-3 px-4 text-emerald-400 font-medium">Factory SEPA</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Settlement Time</td>
                <td className="py-3 px-4 text-center text-red-400">1-3 days</td>
                <td className="py-3 px-4 text-center text-yellow-400">Minutes</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-bold">10 seconds</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">24/7 Availability</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Business hours</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Ledger Integration</td>
                <td className="py-3 px-4 text-center text-red-400">✗</td>
                <td className="py-3 px-4 text-center text-red-400">✗</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Native</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-300">Custom Logic</td>
                <td className="py-3 px-4 text-center text-red-400">✗</td>
                <td className="py-3 px-4 text-center text-red-400">✗</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Full control</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-6 text-center"
      >
        <h3 className="text-2xl font-bold text-gray-100 mb-2">SEPA Instant Module</h3>
        <div className="text-4xl font-bold text-blue-400 mb-2">€30,000</div>
        <div className="text-gray-400 mb-4">One-time setup + €3,000/month (includes all SEPA schemes + real-time processing)</div>
        <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all">
          Add to Your Factory
        </button>
      </motion.div>
    </div>
  );
}
