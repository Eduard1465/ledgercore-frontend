import { useState } from 'react';
import { motion } from 'framer-motion';

export function AISpecOptimizer() {
  const [tps, setTps] = useState(1000);
  const [entities, setEntities] = useState(3);
  const [currencies, setcurrencies] = useState(3);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);

  const handleOptimize = () => {
    setIsOptimizing(true);

    // Simulate AI optimization
    setTimeout(() => {
      setRecommendations({
        replicas: tps > 5000 ? 5 : tps > 1000 ? 3 : 2,
        instanceType: tps > 5000 ? 'r6g.2xlarge' : tps > 1000 ? 'r6g.xlarge' : 'r6g.large',
        dbNodes: entities > 5 ? 5 : entities > 2 ? 3 : 2,
        estimatedCost: Math.round((tps * 0.15) + (entities * 500) + (currencies * 200)),
        complianceGaps: currencies > 5 ? ['Consider splitting entities by currency region'] : [],
        performanceScore: Math.min(100, Math.round((tps / 100) + (entities * 5) + (currencies * 3))),
      });
      setIsOptimizing(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 rounded-full mb-6"
        >
          <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
          <span className="text-violet-400 text-sm font-medium">AI-Powered Optimization</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">AI Spec Optimizer</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Get intelligent recommendations based on your requirements. Our AI analyzes industry benchmarks and optimizes your spec for performance, cost, and compliance.
        </p>
      </div>

      {/* Input Parameters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-gray-100 mb-6">Your Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Peak TPS: {tps.toLocaleString()}</label>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={tps}
              onChange={(e) => setTps(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>100</span>
              <span>10,000</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Legal Entities: {entities}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={entities}
              onChange={(e) => setEntities(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Currencies: {currencies}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={currencies}
              onChange={(e) => setcurrencies(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        </div>

        <motion.button
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold rounded-xl transition-all"
          whileHover={{ scale: isOptimizing ? 1 : 1.02 }}
          whileTap={{ scale: isOptimizing ? 1 : 0.98 }}
        >
          {isOptimizing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing with AI...
            </span>
          ) : (
            '🧠 Optimize Specification'
          )}
        </motion.button>
      </motion.div>

      {/* Recommendations */}
      {recommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-100 mb-6">AI Recommendations</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400 mb-1">K8s Replicas</div>
              <div className="text-2xl font-bold text-emerald-400">{recommendations.replicas}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400 mb-1">Instance Type</div>
              <div className="text-2xl font-bold text-cyan-400 font-mono">{recommendations.instanceType}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400 mb-1">DB Nodes</div>
              <div className="text-2xl font-bold text-purple-400">{recommendations.dbNodes}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400 mb-1">Monthly Cost</div>
              <div className="text-2xl font-bold text-orange-400">${recommendations.estimatedCost.toLocaleString()}</div>
            </div>
          </div>

          {/* Performance Score */}
          <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-100">Performance Score</h3>
              <div className="text-3xl font-bold text-violet-400">{recommendations.performanceScore}/100</div>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${recommendations.performanceScore}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
              />
            </div>
          </div>

          {/* Compliance Gaps */}
          {recommendations.complianceGaps.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <h3 className="text-lg font-bold text-yellow-400 mb-2">⚠️ Compliance Gaps</h3>
              <ul className="space-y-2">
                {recommendations.complianceGaps.map((gap: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-yellow-400">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4">
            <button className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all">
              Apply Recommendations
            </button>
            <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl transition-all">
              Export Report
            </button>
          </div>
        </motion.div>
      )}

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="text-lg font-bold text-gray-100 mb-2">Industry Benchmarks</h3>
          <p className="text-sm text-gray-400">AI trained on 1000+ FinTech deployments. Knows optimal configurations.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-3">💰</div>
          <h3 className="text-lg font-bold text-gray-100 mb-2">Cost Optimization</h3>
          <p className="text-sm text-gray-400">Reduces infrastructure costs by 20-30% through intelligent sizing.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-3">🛡️</div>
          <h3 className="text-lg font-bold text-gray-100 mb-2">Compliance Checks</h3>
          <p className="text-sm text-gray-400">Identifies compliance gaps before deployment. Saves audit time.</p>
        </div>
      </motion.div>

      {/* Pricing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-2xl p-6 text-center"
      >
        <h3 className="text-2xl font-bold text-gray-100 mb-2">AI Spec Optimizer</h3>
        <div className="text-4xl font-bold text-violet-400 mb-2">$25,000</div>
        <div className="text-gray-400 mb-4">One-time setup + $3,000/month (includes AI model updates + benchmark data)</div>
        <button className="px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded-xl transition-all">
          Enable AI Optimizer
        </button>
      </motion.div>
    </div>
  );
}
