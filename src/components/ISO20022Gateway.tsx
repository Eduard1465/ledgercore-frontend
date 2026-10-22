import { useState } from 'react';
import { motion } from 'framer-motion';

export function ISO20022Gateway() {
  const [selectedStandard, setSelectedStandard] = useState('pacs.008');

  const messageTypes = [
    { id: 'pacs.008', name: 'Customer Credit Transfer', category: 'Payments', logo: '💸' },
    { id: 'pacs.002', name: 'Payment Status Report', category: 'Payments', logo: '📊' },
    { id: 'camt.053', name: 'Bank-to-Customer Statement', category: 'Reporting', logo: '📄' },
    { id: 'pain.001', name: 'Customer Credit Initiation', category: 'Initiation', logo: '🚀' },
    { id: 'pain.002', name: 'Initiation Status Report', category: 'Initiation', logo: '✓' },
    { id: 'admi.004', name: 'Return Information', category: 'Admin', logo: '↩️' },
  ];

  const migrationTimeline = [
    { year: '2022', status: 'completed', description: 'SWIFT CBPR+ migration starts' },
    { year: '2023', status: 'completed', description: 'EU SEPA migration deadline' },
    { year: '2024', status: 'in-progress', description: 'US FedWire migration' },
    { year: '2025', status: 'upcoming', description: 'Global ISO 20022 adoption' },
    { year: '2026', status: 'upcoming', description: 'Legacy MT messages deprecated' },
  ];

  const mappingFeatures = [
    { from: 'MT103', to: 'pacs.008', complexity: 'Medium', coverage: '95%' },
    { from: 'MT940', to: 'camt.053', complexity: 'High', coverage: '90%' },
    { from: 'MT101', to: 'pain.001', complexity: 'Medium', coverage: '92%' },
    { from: 'MT900/910', to: 'camt.054', complexity: 'Low', coverage: '98%' },
    { from: 'MT202', to: 'pacs.009', complexity: 'Medium', coverage: '94%' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full mb-6"
        >
          <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
          <span className="text-orange-400 text-sm font-medium">ISO 20022 Migration</span>
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-100 mb-4">ISO 20022 Gateway</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Automated MT → MX message translation. Ready for SWIFT CBPR+ migration deadline.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-gray-100 mb-4">Migration Timeline</h3>
        <div className="flex items-center justify-between gap-4">
          {migrationTimeline.map((milestone, i) => (
            <div key={i} className="flex-1 text-center">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                milestone.status === 'completed' ? 'bg-emerald-500' :
                milestone.status === 'in-progress' ? 'bg-yellow-500' :
                'bg-gray-700'
              }`}>
                {milestone.status === 'completed' ? '✓' :
                 milestone.status === 'in-progress' ? '⏳' :
                 '○'}
              </div>
              <div className="text-sm font-bold text-gray-100">{milestone.year}</div>
              <div className="text-xs text-gray-400 mt-1">{milestone.description}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-gray-100 mb-4">Message Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {messageTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedStandard(type.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedStandard === type.id
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="text-3xl mb-2">{type.logo}</div>
              <div className="text-sm font-bold text-gray-100">{type.id}</div>
              <div className="text-xs text-gray-400 mt-1">{type.name}</div>
              <div className="text-xs text-orange-400 mt-2">{type.category}</div>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-gray-100 mb-4">MT → MX Mapping</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Legacy (MT)</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">→</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Modern (MX)</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Complexity</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Coverage</th>
              </tr>
            </thead>
            <tbody>
              {mappingFeatures.map((mapping, i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="py-3 px-4 text-red-400 font-mono">{mapping.from}</td>
                  <td className="py-3 px-4 text-center text-gray-500">→</td>
                  <td className="py-3 px-4 text-emerald-400 font-mono">{mapping.to}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      mapping.complexity === 'High' ? 'bg-red-500/20 text-red-400' :
                      mapping.complexity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {mapping.complexity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-cyan-400 font-bold">{mapping.coverage}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
                <th className="text-center py-3 px-4 text-red-400 font-medium">Manual Migration</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">SWIFT Tools</th>
                <th className="text-center py-3 px-4 text-emerald-400 font-medium">Factory Gateway</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Automated Translation</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Manual mapping</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Semi-auto</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Fully automated</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Ledger Integration</td>
                <td className="py-3 px-4 text-center text-red-400">✗ None</td>
                <td className="py-3 px-4 text-center text-red-400">✗ None</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Native integration</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Validation Rules</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Custom code</td>
                <td className="py-3 px-4 text-center text-yellow-400">⚠ Basic</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ OPA policies</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-300">Migration Time</td>
                <td className="py-3 px-4 text-center text-red-400">6-12 months</td>
                <td className="py-3 px-4 text-center text-yellow-400">3-6 months</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-bold">2-4 weeks</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-6 text-center"
      >
        <h3 className="text-2xl font-bold text-gray-100 mb-2">Module Pricing</h3>
        <div className="text-4xl font-bold text-orange-400 mb-2">$50,000</div>
        <div className="text-gray-400 mb-4">One-time setup + $3,000/month (includes message updates)</div>
        <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all">
          Add to Your Factory
        </button>
      </motion.div>
    </div>
  );
}
