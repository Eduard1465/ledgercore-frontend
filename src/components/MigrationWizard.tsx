import { useState } from 'react';
import { motion } from 'framer-motion';

export function MigrationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [migrationStrategy, setMigrationStrategy] = useState('strangler-fig');

  const strategies = [
    { id: 'strangler-fig', name: 'Strangler Fig Pattern', description: 'Gradually replace legacy system with new services', risk: 'Low', timeline: '6-12 months', logo: '🌳' },
    { id: 'parallel-run', name: 'Parallel Run', description: 'Run old and new systems simultaneously, compare results', risk: 'Low', timeline: '3-6 months', logo: '⚡' },
    { id: 'big-bang', name: 'Big Bang', description: 'Switch from old to new system in one go', risk: 'High', timeline: '1-3 months', logo: '💥' },
    { id: 'phased', name: 'Phased Migration', description: 'Migrate module by module over time', risk: 'Medium', timeline: '6-9 months', logo: '📊' }
  ];

  const steps = [
    { name: 'Assessment', description: 'Analyze legacy system', duration: '1-2 weeks', tasks: ['Inventory legacy database schema', 'Map business logic dependencies', 'Identify critical paths', 'Estimate data volume'] },
    { name: 'Planning', description: 'Design migration strategy', duration: '1 week', tasks: ['Choose migration pattern', 'Define rollback procedures', 'Set up dual-write infrastructure', 'Create data mapping rules'] },
    { name: 'Setup', description: 'Prepare infrastructure', duration: '2-3 weeks', tasks: ['Deploy new Ledger infrastructure', 'Configure dual-write middleware', 'Set up reconciliation engine', 'Create migration scripts'] },
    { name: 'Dual-Write', description: 'Run both systems in parallel', duration: '90 days', tasks: ['Enable dual-write for all transactions', 'Run reconciliation every hour', 'Monitor data consistency', 'Fix discrepancies automatically'] },
    { name: 'Cutover', description: 'Switch to new system', duration: '1 week', tasks: ['Final data sync', 'Disable legacy system writes', 'Verify all data migrated', 'Enable new system as primary'] },
    { name: 'Decommission', description: 'Remove legacy system', duration: '2-4 weeks', tasks: ['Archive legacy data', 'Decommission old infrastructure', 'Update documentation', 'Train support team'] }
  ];

  const metrics = [
    { label: 'Data Volume', value: '15 TB', icon: '💾' },
    { label: 'Accounts', value: '2.5M', icon: '👥' },
    { label: 'Transactions/Day', value: '500K', icon: '💸' },
    { label: 'Downtime', value: '< 5 min', icon: '⏱️' },
    { label: 'Data Loss Risk', value: '0%', icon: '🛡️' },
    { label: 'Rollback Time', value: '< 1 hour', icon: '↩️' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6"
        >
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-cyan-400 text-sm font-medium">Migration Wizard</span>
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-100 mb-4">Legacy System Migration</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Migrate from COBOL/Oracle/Mainframe to modern Ledger infrastructure. Zero data loss, minimal downtime.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-gray-100 mb-4">Choose Migration Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map((strategy) => (
            <button
              key={strategy.id}
              onClick={() => setMigrationStrategy(strategy.id)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                migrationStrategy === strategy.id
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{strategy.logo}</div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-100 mb-1">{strategy.name}</h4>
                  <p className="text-sm text-gray-400 mb-3">{strategy.description}</p>
                  <div className="flex gap-4 text-xs">
                    <span className={`px-2 py-1 rounded ${
                      strategy.risk === 'Low' ? 'bg-emerald-500/20 text-emerald-400' :
                      strategy.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      Risk: {strategy.risk}
                    </span>
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded">
                      Timeline: {strategy.timeline}
                    </span>
                  </div>
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
        <h3 className="text-lg font-bold text-gray-100 mb-6">Migration Phases</h3>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-gray-800/50 rounded-xl p-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    i < currentStep ? 'bg-emerald-500' :
                    i === currentStep ? 'bg-cyan-500' :
                    'bg-gray-700'
                  }`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-100">{step.name}</h4>
                    <span className="text-sm text-gray-400">{step.duration}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{step.description}</p>
                  <ul className="space-y-1">
                    {step.tasks.map((task, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="text-cyan-400">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
      >
        {metrics.map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.05 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
          >
            <div className="text-3xl mb-2">{metric.icon}</div>
            <div className="text-2xl font-bold text-cyan-400 mb-1">{metric.value}</div>
            <div className="text-xs text-gray-400">{metric.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-gray-100 mb-4">⚔️ VS Alternatives</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Feature</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Thought Machine</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Mambu</th>
                <th className="text-center py-3 px-4 text-emerald-400 font-medium">Factory Migration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Migration Tools</td>
                <td className="py-3 px-4 text-center text-red-400">✗ None</td>
                <td className="py-3 px-4 text-center text-red-400">✗ None</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Built-in wizard</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Dual-Write Support</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Manual</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Manual</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Automated</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Reconciliation Engine</td>
                <td className="py-3 px-4 text-center text-red-400">✗ External</td>
                <td className="py-3 px-4 text-center text-red-400">✗ External</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Integrated</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-300">Rollback Procedures</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Complex</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Complex</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ 1-click rollback</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6 text-center"
      >
        <h3 className="text-2xl font-bold text-gray-100 mb-2">Migration Package</h3>
        <div className="text-4xl font-bold text-cyan-400 mb-2">$200,000</div>
        <div className="text-gray-400 mb-4">Includes: Assessment + Planning + Setup + Dual-Write + Cutover + Support</div>
        <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl transition-all">
          Start Migration Assessment
        </button>
      </motion.div>
    </div>
  );
}
