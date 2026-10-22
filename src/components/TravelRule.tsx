import { useState } from 'react';
import { motion } from 'framer-motion';

export function TravelRule() {
  const [selectedProtocol, setSelectedProtocol] = useState('trisa');

  const protocols = [
    { id: 'trisa', name: 'TRISA', logo: '🔗', standard: 'FATF Recommendation 16' },
    { id: 'notabene', name: 'Notabene', logo: '📧', standard: 'FATF Travel Rule' },
    { id: 'sygna', name: 'Sygna Bridge', logo: '🌉', standard: 'FATF Travel Rule' },
    { id: 'openvasp', name: 'OpenVASP', logo: '🔓', standard: 'Open Standard' },
  ];

  const complianceChecks = [
    { name: 'Originator Information', description: 'Name, account number, address of sender', required: true, encrypted: true },
    { name: 'Beneficiary Information', description: 'Name, account number of receiver', required: true, encrypted: true },
    { name: 'Transaction Amount', description: 'Amount and currency of transfer', required: true, encrypted: false },
    { name: 'Purpose of Transfer', description: 'Reason for transaction (if > $3,000)', required: false, encrypted: false },
    { name: 'VASP Identification', description: 'Both sending and receiving VASP IDs', required: true, encrypted: true }
  ];

  const thresholds = [
    { region: 'EU (MiCA)', threshold: '€1,000', strictness: 'High' },
    { region: 'US (BSA)', threshold: '$3,000', strictness: 'Medium' },
    { region: 'UK (FCA)', threshold: '£1,000', strictness: 'High' },
    { region: 'Singapore (MAS)', threshold: 'SGD 1,500', strictness: 'High' },
    { region: 'Global (FATF)', threshold: '$1,000 / €1,000', strictness: 'Baseline' }
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
          <span className="text-blue-400 text-sm font-medium">FATF Travel Rule Compliance</span>
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-100 mb-4">Travel Rule Module</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Automated compliance with FATF Recommendation 16. Multi-protocol support, end-to-end encryption.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-gray-100 mb-4">Select Protocol</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {protocols.map((protocol) => (
            <button
              key={protocol.id}
              onClick={() => setSelectedProtocol(protocol.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedProtocol === protocol.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="text-3xl mb-2">{protocol.logo}</div>
              <div className="text-sm font-bold text-gray-100">{protocol.name}</div>
              <div className="text-xs text-gray-400 mt-1">{protocol.standard}</div>
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
        <h3 className="text-lg font-bold text-gray-100 mb-4">Required Data Fields</h3>
        <div className="space-y-3">
          {complianceChecks.map((check, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  check.required ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'
                }`}>
                  {check.required ? '✓' : '?'}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-100">{check.name}</div>
                  <div className="text-xs text-gray-400">{check.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {check.encrypted && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                    🔒 Encrypted
                  </span>
                )}
                <span className={`px-2 py-1 rounded text-xs ${
                  check.required ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'
                }`}>
                  {check.required ? 'Required' : 'Optional'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-gray-100 mb-4">Regional Thresholds</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Region</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Threshold</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Strictness</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Auto-Apply</th>
              </tr>
            </thead>
            <tbody>
              {thresholds.map((threshold, i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="py-3 px-4 text-gray-300">{threshold.region}</td>
                  <td className="py-3 px-4 text-center text-cyan-400 font-mono">{threshold.threshold}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      threshold.strictness === 'High' ? 'bg-red-500/20 text-red-400' :
                      threshold.strictness === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {threshold.strictness}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-emerald-400">✓</td>
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
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-gray-100 mb-4">⚔️ VS Competitors</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Feature</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Notabene</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Sygna Bridge</th>
                <th className="text-center py-3 px-4 text-emerald-400 font-medium">Factory Travel Rule</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Multi-Protocol Support</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Proprietary only</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Proprietary only</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ TRISA + Notabene + Sygna + OpenVASP</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Ledger Integration</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Manual</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Manual</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Auto-sync with Ledger</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Regional Auto-Detection</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Manual config</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Manual config</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Auto-apply by jurisdiction</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-300">Evidence Pack</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Basic logs</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Basic logs</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Audit-ready CSV + Merkle proof</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-6 text-center"
      >
        <h3 className="text-2xl font-bold text-gray-100 mb-2">Module Pricing</h3>
        <div className="text-4xl font-bold text-blue-400 mb-2">$35,000</div>
        <div className="text-gray-400 mb-4">One-time setup + $5,000/month (includes protocol updates)</div>
        <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all">
          Add to Your Factory
        </button>
      </motion.div>
    </div>
  );
}
