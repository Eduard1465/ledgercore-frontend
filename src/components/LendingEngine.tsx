import { useState } from 'react';
import { motion } from 'framer-motion';

export function LendingEngine() {
  const [selectedProduct, setSelectedProduct] = useState('personal');

  const products = [
    { id: 'personal', name: 'Personal Loans', icon: '👤', rate: '8.5-15%', term: '12-60 months' },
    { id: 'business', name: 'Business Loans', icon: '🏢', rate: '6.5-12%', term: '24-120 months' },
    { id: 'mortgage', name: 'Mortgage', icon: '🏠', rate: '4.5-7%', term: '180-360 months' },
    { id: 'auto', name: 'Auto Loans', icon: '🚗', rate: '5.5-9%', term: '24-72 months' },
  ];

  const loans = [
    { id: 'LN-001', customer: 'John Doe', amount: 50000, rate: 8.5, term: 36, status: 'active', risk: 'low' },
    { id: 'LN-002', customer: 'Jane Smith', amount: 120000, rate: 6.5, term: 60, status: 'active', risk: 'medium' },
    { id: 'LN-003', customer: 'Bob Johnson', amount: 250000, rate: 5.2, term: 180, status: 'active', risk: 'low' },
    { id: 'LN-004', customer: 'Alice Brown', amount: 35000, rate: 12.5, term: 24, status: 'pending', risk: 'high' },
  ];

  const metrics = [
    { label: 'Total Portfolio', value: '$45.2M', change: '+12.5%', icon: '💰' },
    { label: 'Active Loans', value: '1,247', change: '+8.3%', icon: '📊' },
    { label: 'Default Rate', value: '1.2%', change: '-0.3%', icon: '⚠️' },
    { label: 'Avg Interest', value: '7.8%', change: '+0.2%', icon: '📈' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full mb-6"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm font-medium">Automated Lending Platform</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">Lending Engine</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          End-to-end loan origination, underwriting, and servicing. AI-powered risk assessment.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-gray-100 mb-4">Loan Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedProduct === product.id
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="text-3xl mb-2">{product.icon}</div>
              <div className="font-bold text-gray-100 mb-1">{product.name}</div>
              <div className="text-xs text-gray-400">Rate: {product.rate}</div>
              <div className="text-xs text-gray-400">Term: {product.term}</div>
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
            <div className="text-2xl font-bold text-green-400 mb-1">{metric.value}</div>
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
        <h2 className="text-xl font-bold text-gray-100 mb-4">Loan Portfolio</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Loan ID</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Amount</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Rate</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Term</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4 text-gray-200 font-mono">{loan.id}</td>
                  <td className="py-3 px-4 text-gray-300">{loan.customer}</td>
                  <td className="py-3 px-4 text-center text-green-400 font-bold">${loan.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center text-cyan-400">{loan.rate}%</td>
                  <td className="py-3 px-4 text-center text-gray-300">{loan.term}mo</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      loan.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      loan.risk === 'low' ? 'bg-emerald-500/20 text-emerald-400' :
                      loan.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {loan.risk}
                    </span>
                  </td>
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
          <div className="text-3xl mb-3">🤖</div>
          <h3 className="text-lg font-bold text-gray-100 mb-2">AI Underwriting</h3>
          <p className="text-sm text-gray-400">Automated credit scoring with ML models. 95% accuracy in risk assessment.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="text-lg font-bold text-gray-100 mb-2">Instant Approval</h3>
          <p className="text-sm text-gray-400">Loan decisions in under 60 seconds. Automated document verification.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="text-lg font-bold text-gray-100 mb-2">Portfolio Analytics</h3>
          <p className="text-sm text-gray-400">Real-time portfolio monitoring. Predictive default modeling.</p>
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
                <th className="text-center py-3 px-4 text-red-400 font-medium">Mambu Loans</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Blend</th>
                <th className="text-center py-3 px-4 text-emerald-400 font-medium">Factory Lending</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">AI Underwriting</td>
                <td className="py-3 px-4 text-center text-red-400">✗</td>
                <td className="py-3 px-4 text-center text-yellow-400">⚠ Basic</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Advanced ML</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Multi-Product</td>
                <td className="py-3 px-4 text-center text-yellow-400">⚠ Limited</td>
                <td className="py-3 px-4 text-center text-red-400">✗</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Full suite</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">Ledger Integration</td>
                <td className="py-3 px-4 text-center text-red-400">✗</td>
                <td className="py-3 px-4 text-center text-red-400">✗</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Native</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-300">Compliance</td>
                <td className="py-3 px-4 text-center text-yellow-400">⚠ Basic</td>
                <td className="py-3 px-4 text-center text-yellow-400">⚠ Basic</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Full PCI/SOC2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6 text-center"
      >
        <h3 className="text-2xl font-bold text-gray-100 mb-2">Lending Engine Module</h3>
        <div className="text-4xl font-bold text-green-400 mb-2">$75,000</div>
        <div className="text-gray-400 mb-4">One-time setup + $10,000/month (includes AI models + portfolio analytics)</div>
        <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all">
          Add to Your Factory
        </button>
      </motion.div>
    </div>
  );
}
