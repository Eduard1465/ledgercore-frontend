import { useState } from 'react';
import { motion } from 'framer-motion';

export function ModuleRegistry() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const modules = [
    { name: 'card-issuing', version: 'v1.2.0', author: 'LedgerCore Team', downloads: '2,450', rating: 4.8, description: 'Payment card issuance and processing', dependencies: ['core-ledger', 'audit-trail'], size: '12 MB', license: 'Commercial' },
    { name: 'reconciliation', version: 'v1.1.3', author: 'LedgerCore Team', downloads: '1,890', rating: 4.9, description: 'Transaction reconciliation engine', dependencies: ['core-ledger'], size: '8 MB', license: 'Commercial' },
    { name: 'kyc-waterfall', version: 'v2.0.1', author: 'Compliance Partners', downloads: '3,210', rating: 4.7, description: 'Multi-level KYC/AML verification', dependencies: ['core-ledger', 'audit-trail'], size: '15 MB', license: 'Commercial' },
    { name: 'travel-rule', version: 'v1.0.0', author: 'Crypto Compliance Inc', downloads: '890', rating: 4.6, description: 'FATF Travel Rule compliance', dependencies: ['core-ledger', 'kyc-waterfall'], size: '10 MB', license: 'Commercial' },
    { name: 'iso20022-gateway', version: 'v1.3.2', author: 'Banking Standards', downloads: '1,560', rating: 4.8, description: 'ISO 20022 MT/MX translation', dependencies: ['core-ledger'], size: '6 MB', license: 'Commercial' },
    { name: 'dora-compliance', version: 'v1.0.0', author: 'EU Regulatory', downloads: '720', rating: 4.9, description: 'DORA compliance automation', dependencies: ['audit-trail', 'resilience'], size: '9 MB', license: 'Commercial' },
    { name: 'cbdc-adapter', version: 'v1.1.0', author: 'Central Bank Tech', downloads: '450', rating: 4.5, description: 'Digital Ruble (CBDC) integration', dependencies: ['core-ledger', 'iso20022-gateway'], size: '11 MB', license: 'Commercial' },
    { name: 'agentic-payments', version: 'v0.9.0', author: 'AI Finance Lab', downloads: '320', rating: 4.7, description: 'AI agent payment authorization', dependencies: ['core-ledger', 'kyc-waterfall'], size: '7 MB', license: 'Commercial' }
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
          <span className="text-indigo-400 text-sm font-medium">Module Registry</span>
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-100 mb-4">Factory Module Registry</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Install, update, and manage modules with semantic versioning. Like npm for FinTech infrastructure.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-950 border border-gray-800 rounded-2xl p-6 mb-8 font-mono text-sm"
      >
        <div className="text-gray-500 mb-2"># Install a module</div>
        <div className="text-emerald-400 mb-4">$ factory module add card-issuing@v1.2.0</div>
        <div className="text-gray-500 mb-2"># List installed modules</div>
        <div className="text-emerald-400 mb-4">$ factory module list</div>
        <div className="text-gray-500 mb-2"># Update all modules</div>
        <div className="text-emerald-400 mb-4">$ factory module update --all</div>
        <div className="text-gray-500 mb-2"># Check for breaking changes</div>
        <div className="text-emerald-400">$ factory module diff card-issuing@v1.1.0 card-issuing@v1.2.0</div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {modules.map((module, i) => (
          <motion.div
            key={module.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            onClick={() => setSelectedModule(selectedModule === module.name ? null : module.name)}
            className={`bg-gray-900 border rounded-2xl p-6 cursor-pointer transition-all ${
              selectedModule === module.name
                ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
                : 'border-gray-800 hover:border-gray-700'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-100 font-mono">{module.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{module.description}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-indigo-400 font-mono">{module.version}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-400 text-xs">★</span>
                  <span className="text-xs text-gray-400">{module.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <span>📦 {module.downloads} downloads</span>
              <span>💾 {module.size}</span>
              <span>📄 {module.license}</span>
            </div>

            {selectedModule === module.name && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-4 border-t border-gray-800"
              >
                <div className="text-xs text-gray-500 mb-2">Dependencies:</div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {module.dependencies.map((dep) => (
                    <span key={dep} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 font-mono">
                      {dep}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mb-2">Author:</div>
                <div className="text-sm text-gray-300">{module.author}</div>
                <button className="w-full mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm rounded-lg transition-all">
                  Install {module.name}@{module.version}
                </button>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-gray-100 mb-4">⚔️ VS Alternatives</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Feature</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Terraform Registry</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Helm Hub</th>
                <th className="text-center py-3 px-4 text-emerald-400 font-medium">Factory Registry</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Semantic Versioning</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Dependency Resolution</td>
                <td className="py-3 px-4 text-center text-red-400">✗ Manual</td>
                <td className="py-3 px-4 text-center text-yellow-400">⚠ Basic</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Automatic</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Compliance Validation</td>
                <td className="py-3 px-4 text-center text-red-400">✗ None</td>
                <td className="py-3 px-4 text-center text-red-400">✗ None</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ OPA policies</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-300">Breaking Change Detection</td>
                <td className="py-3 px-4 text-center text-red-400">✗ None</td>
                <td className="py-3 px-4 text-center text-red-400">✗ None</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Automated</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-indigo-400 mb-3">💡 Why Module Registry Matters</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>✓ <strong>Version Control</strong> — Semantic versioning for all modules</li>
          <li>✓ <strong>Dependency Management</strong> — Automatic resolution of module dependencies</li>
          <li>✓ <strong>Compliance Validation</strong> — OPA policies validate module compatibility</li>
          <li>✓ <strong>Breaking Change Detection</strong> — Automated alerts for incompatible updates</li>
          <li>✓ <strong>Enterprise-Grade</strong> — Private registry option for air-gapped environments</li>
        </ul>
      </motion.div>
    </div>
  );
}
