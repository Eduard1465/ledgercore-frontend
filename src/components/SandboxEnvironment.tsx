import { useState } from 'react';
import { motion } from 'framer-motion';

export function SandboxEnvironment() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [sandboxUrl, setSandboxUrl] = useState<string | null>(null);
  const [ttl, setTtl] = useState(4); // hours

  const handleSpinUp = () => {
    setIsSpinning(true);
    setSandboxUrl(null);

    // Simulate sandbox creation
    setTimeout(() => {
      const randomId = Math.random().toString(36).substring(7);
      setSandboxUrl(`https://sandbox-${randomId}.ledgercore.dev`);
      setIsSpinning(false);
    }, 3000);
  };

  const handleDestroy = () => {
    setSandboxUrl(null);
    setIsSpinning(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6"
        >
          <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          <span className="text-purple-400 text-sm font-medium">Temporary Infrastructure</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">Sandbox Environment</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Spin up a temporary infrastructure to test your configuration before committing to production
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Control Panel</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">TTL (Time To Live)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="24"
                value={ttl}
                onChange={(e) => setTtl(Number(e.target.value))}
                className="flex-1"
                disabled={!!sandboxUrl}
              />
              <span className="text-lg font-bold text-emerald-400 w-16">{ttl}h</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Sandbox will be automatically destroyed after {ttl} hours</p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Configuration</label>
            <div className="bg-gray-800 rounded-lg p-3 text-sm text-gray-300 font-mono">
              <div>Region: eu-central-1</div>
              <div>Compliance: PCI-DSS, SOC2</div>
              <div>Modules: card-issuing, reconciliation</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {!sandboxUrl ? (
            <motion.button
              onClick={handleSpinUp}
              disabled={isSpinning}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold rounded-xl transition-all"
              whileHover={{ scale: isSpinning ? 1 : 1.02 }}
              whileTap={{ scale: isSpinning ? 1 : 0.98 }}
            >
              {isSpinning ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Spinning up sandbox...
                </span>
              ) : (
                '🚀 Spin Up Sandbox'
              )}
            </motion.button>
          ) : (
            <motion.button
              onClick={handleDestroy}
              className="flex-1 px-6 py-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold rounded-xl transition-all"
            >
              🗑️ Destroy Sandbox
            </motion.button>
          )}
        </div>
      </motion.div>

      {sandboxUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-100 mb-4">✅ Sandbox Active</h2>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-2">Access URL</div>
              <a
                href={sandboxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-mono text-emerald-400 hover:text-emerald-300 underline"
              >
                {sandboxUrl}
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="text-xs text-gray-500 mb-1">Status</div>
                <div className="text-lg font-bold text-emerald-400">Running</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="text-xs text-gray-500 mb-1">TTL Remaining</div>
                <div className="text-lg font-bold text-cyan-400">{ttl}h 00m</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="text-xs text-gray-500 mb-1">Cost</div>
                <div className="text-lg font-bold text-orange-400">$0.00</div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 mt-4">
              <div className="text-sm text-gray-400 mb-2">What's included:</div>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>✓ Full Terraform infrastructure (VPC, EKS, RDS, Vault)</li>
                <li>✓ Generated Go application with your spec</li>
                <li>✓ Kubernetes deployment with Helm charts</li>
                <li>✓ OPA policies loaded and active</li>
                <li>✓ Test data pre-loaded</li>
                <li>✓ API endpoints accessible</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="text-lg font-bold text-gray-100 mb-2">Instant Setup</h3>
          <p className="text-sm text-gray-400">Sandbox spins up in ~30 seconds with your exact configuration</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-3">💰</div>
          <h3 className="text-lg font-bold text-gray-100 mb-2">Free to Test</h3>
          <p className="text-sm text-gray-400">No cost for sandbox environments. Pay only for production deployment</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-3">🔄</div>
          <h3 className="text-lg font-bold text-gray-100 mb-2">Auto Cleanup</h3>
          <p className="text-sm text-gray-400">Sandbox automatically destroys after TTL expires. No manual cleanup needed</p>
        </div>
      </motion.div>
    </div>
  );
}
