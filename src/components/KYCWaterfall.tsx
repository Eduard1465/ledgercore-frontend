import { useState } from 'react';
import { motion } from 'framer-motion';

export function KYCWaterfall() {
  const [selectedProvider, setSelectedProvider] = useState('sumsub');

  const providers = [
    { id: 'sumsub', name: 'SumSub', logo: '🔍', cost: '$0.50/verification' },
    { id: 'onfido', name: 'Onfido', logo: '🆔', cost: '$0.75/verification' },
    { id: 'jumio', name: 'Jumio', logo: '✓', cost: '$1.00/verification' },
    { id: 'veriff', name: 'Veriff', logo: '🎯', cost: '$0.60/verification' },
  ];

  const waterfallSteps = [
    {
      level: 1,
      name: 'Document Verification',
      description: 'Passport/ID scan + OCR + liveness detection',
      providers: ['sumsub', 'onfido', 'jumio', 'veriff'],
      sla: '< 30 seconds',
      accuracy: '99.2%'
    },
    {
      level: 2,
      name: 'Facial Biometrics',
      description: 'Selfie match + liveness check + deepfake detection',
      providers: ['sumsub', 'onfido', 'veriff'],
      sla: '< 10 seconds',
      accuracy: '99.5%'
    },
    {
      level: 3,
      name: 'PEP/Sanctions Screening',
      description: 'Politically Exposed Persons + OFAC + EU sanctions',
      providers: ['refinitiv', 'dowjones', 'chainalysis'],
      sla: '< 5 seconds',
      accuracy: '99.9%'
    },
    {
      level: 4,
      name: 'AML Transaction Monitoring',
      description: 'Real-time pattern detection + risk scoring',
      providers: ['chainalysis', 'elliptic', 'custom'],
      sla: 'Real-time',
      accuracy: '98.5%'
    },
    {
      level: 5,
      name: 'Enhanced Due Diligence (EDD)',
      description: 'Manual review queue + source of funds verification',
      providers: ['internal', 'outsourced'],
      sla: '< 24 hours',
      accuracy: '100% (human)'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6"
        >
          <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          <span className="text-purple-400 text-sm font-medium">KYC/AML Compliance Module</span>
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-100 mb-4">KYC/AML Waterfall</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Multi-level identity verification with cascading providers. Reduce false positives by 60%.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-gray-100 mb-4">Select Primary Provider</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setSelectedProvider(provider.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedProvider === provider.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="text-3xl mb-2">{provider.logo}</div>
              <div className="text-sm font-bold text-gray-100">{provider.name}</div>
              <div className="text-xs text-gray-400 mt-1">{provider.cost}</div>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="space-y-4">
        {waterfallSteps.map((step, i) => (
          <motion.div
            key={step.level}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                  L{step.level}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-100 mb-2">{step.name}</h3>
                <p className="text-gray-400 mb-4">{step.description}</p>

                <div className="flex gap-6 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">SLA</div>
                    <div className="text-sm font-bold text-emerald-400">{step.sla}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Accuracy</div>
                    <div className="text-sm font-bold text-cyan-400">{step.accuracy}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-2">Available Providers</div>
                  <div className="flex flex-wrap gap-2">
                    {step.providers.map((provider) => (
                      <span
                        key={provider}
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          provider === selectedProvider || step.providers.includes(selectedProvider)
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-gray-800 text-gray-400 border border-gray-700'
                        }`}
                      >
                        {provider}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {i < waterfallSteps.length - 1 && (
                <div className="flex-shrink-0 self-center">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-500">
                    ↓
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-gray-100 mb-4">⚔️ VS Competitors</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Feature</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">SumSub Standalone</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Onfido Standalone</th>
                <th className="text-center py-3 px-4 text-emerald-400 font-medium">Factory KYC Module</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Waterfall Architecture</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Single provider</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Single provider</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Multi-level cascade</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Ledger Integration</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Manual</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Manual</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Auto-sync</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">OPA Policy Enforcement</td>
                <td className="py-3 px-4 text-center text-red-400">✗ None</td>
                <td className="py-3 px-4 text-center text-red-400">✗ None</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Built-in</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Evidence Pack</td>
                <td className="py-3 px-4 text-center text-red-400">✗ PDF only</td>
                <td className="py-3 px-4 text-center text-red-400">✗ PDF only</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Audit-ready CSV</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-300">False Positive Reduction</td>
                <td className="py-3 px-4 text-center text-gray-400">Baseline</td>
                <td className="py-3 px-4 text-center text-gray-400">Baseline</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-bold">-60%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6 text-center"
      >
        <h3 className="text-2xl font-bold text-gray-100 mb-2">Module Pricing</h3>
        <div className="text-4xl font-bold text-purple-400 mb-2">$20,000</div>
        <div className="text-gray-400 mb-4">One-time setup + $2,000/month maintenance</div>
        <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-all">
          Add to Your Factory
        </button>
      </motion.div>
    </div>
  );
}
