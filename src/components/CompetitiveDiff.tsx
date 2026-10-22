import { motion } from 'framer-motion';

interface CompetitiveDiffProps {
  competitorData?: any;
  onClose?: () => void;
}

export function CompetitiveDiff({ competitorData, onClose }: CompetitiveDiffProps) {
  const data = competitorData || {
    vs_unit: {
      has_custom_ledger: false,
      has_ip_ownership: false,
      has_own_infra: false,
      has_compliance_evidence: false,
      pain: "Shared tenancy, no code access, vendor lock-in"
    },
    vs_factory: {
      has_custom_ledger: true,
      has_ip_ownership: true,
      has_own_infra: true,
      has_compliance_evidence: true,
      value: "Your VPC, Your Code, Your State, GitOps"
    }
  };

  const competitors = [
    { name: 'Unit / Stripe Treasury', data: data.vs_unit || data },
    { name: 'Thought Machine', data: data.vs_thought_machine || data },
    { name: 'Factory (You)', data: data.vs_factory || data }
  ];

  const features = [
    { key: 'has_custom_ledger', label: 'Custom Ledger Logic' },
    { key: 'has_ip_ownership', label: 'IP Ownership' },
    { key: 'has_own_infra', label: 'Own Infrastructure' },
    { key: 'has_compliance_evidence', label: 'Compliance Evidence' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 bottom-0 w-96 bg-gray-900 border-l border-gray-800 shadow-2xl z-50 overflow-y-auto"
    >
      <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-100">Competitive Analysis</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-200 transition-all"
          >
            ✕
          </button>
        )}
      </div>

      <div className="p-4 space-y-6">
        {competitors.map((competitor, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`rounded-xl p-4 border ${
              competitor.name.includes('Factory')
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-gray-800/50 border-gray-700'
            }`}
          >
            <h4 className={`text-sm font-bold mb-3 ${
              competitor.name.includes('Factory') ? 'text-emerald-400' : 'text-gray-200'
            }`}>
              {competitor.name}
            </h4>

            <div className="space-y-2">
              {features.map((feature) => {
                const hasFeature = competitor.data[feature.key];
                return (
                  <div key={feature.key} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{feature.label}</span>
                    <span className={`text-lg ${hasFeature ? 'text-emerald-400' : 'text-red-400'}`}>
                      {hasFeature ? '✓' : '✗'}
                    </span>
                  </div>
                );
              })}
            </div>

            {competitor.data.pain && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-xs text-red-400">
                  <span className="font-bold">Pain:</span> {competitor.data.pain}
                </p>
              </div>
            )}
            {competitor.data.value && (
              <div className="mt-3 pt-3 border-t border-emerald-500/30">
                <p className="text-xs text-emerald-400">
                  <span className="font-bold">Value:</span> {competitor.data.value}
                </p>
              </div>
            )}
          </motion.div>
        ))}

        <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-xl p-4">
          <h4 className="text-sm font-bold text-emerald-400 mb-2">💡 Why Factory Wins</h4>
          <ul className="space-y-2 text-xs text-gray-300">
            <li>✓ <strong>IP Ownership</strong> — Your code, your infrastructure, your state</li>
            <li>✓ <strong>Custom Logic</strong> — Go code, not black-box APIs</li>
            <li>✓ <strong>10 Days</strong> — Not months or years</li>
            <li>✓ <strong>Compliance Built-in</strong> — PCI, SOC2, DORA, MiCA from day one</li>
            <li>✓ <strong>No Vendor Lock-in</strong> — GitOps, portable, self-hosted</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
